import { prisma } from "@/lib/prisma";
import type { 
  DistributionOrderFormValues, 
  PurchaseTransactionFormValues, 
  DailyRevenueFormValues, 
  ReturnedItemFormValues, 
  ProductPriceFormValues 
} from "@/lib/validations";

export class KasirService {
  /**
   * FITUR 1: DISTRIBUSI BARANG
   * - Validasi stok (pack/quantity)
   * - Generate Surat Jalan (SJ-YYYYMMDD-XXXX)
   * - Kurangi stok (secara logis via query sum)
   * - Buat Audit Log
   */
  static async createDistributionOrder(data: DistributionOrderFormValues, user: string = "Kasir") {
    return prisma.$transaction(async (tx) => {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      
      const countToday = await tx.distributionOrder.count({
        where: { sjNumber: { startsWith: `SJ-${dateStr}-` } }
      });
      const sjNumber = `SJ-${dateStr}-${String(countToday + 1).padStart(4, '0')}`;

      let totalWeight = 0;
      let totalItems = 0;

      for (const item of data.items) {
        const packingItem = await tx.packingItem.findUnique({
          where: { id: item.packingItemId },
          include: { productionItem: { include: { masterPart: true } } }
        });
        if (!packingItem) throw new Error(`Packing Item tidak ditemukan.`);

        const distAgg = await tx.distributionItem.aggregate({
          where: { packingItemId: item.packingItemId },
          _sum: { quantity: true }
        });
        
        const distributedQty = distAgg._sum.quantity || 0;
        const availableQty = packingItem.packageCount - distributedQty;

        if (item.quantity > availableQty) {
          throw new Error(`Stok ${packingItem.productionItem.masterPart.name} tidak mencukupi. Sisa: ${availableQty} Pack.`);
        }

        const itemWeight = item.quantity * packingItem.packageSize;
        totalWeight += itemWeight;
        totalItems += item.quantity;
      }

      const order = await tx.distributionOrder.create({
        data: {
          sjNumber,
          date: data.date,
          destination: data.destination,
          type: data.type,
          driverId: data.driverId,
          vehicleId: data.vehicleId,
          totalWeight,
          totalItems,
          items: {
            create: data.items.map(i => ({
              packingItemId: i.packingItemId,
              quantity: i.quantity,
              weight: i.quantity * 5 // We will fetch real weight below
            }))
          }
        },
        include: { items: true }
      });

      // Update real weights
      for (const item of order.items) {
        const pi = await tx.packingItem.findUnique({ where: { id: item.packingItemId } });
        if(pi) {
          await tx.distributionItem.update({
            where: { id: item.id },
            data: { weight: item.quantity * pi.packageSize }
          });
        }
      }

      await tx.auditLog.create({
        data: {
          action: "CREATE_DISTRIBUTION",
          entity: "DistributionOrder",
          entityId: order.id,
          details: JSON.stringify({ sjNumber, totalItems, totalWeight }),
          user
        }
      });

      return order;
    });
  }

  /**
   * FITUR 2: PEMBELIAN BARANG
   */
  static async createPurchaseTransaction(data: PurchaseTransactionFormValues, user: string = "Kasir") {
    return prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      const itemsToCreate = data.items.map(item => {
        const itemTotal = item.quantity * item.price;
        totalAmount += itemTotal;
        return {
          masterSupportItemId: item.masterSupportItemId,
          quantity: item.quantity,
          price: item.price,
          total: itemTotal
        };
      });

      const purchase = await tx.purchaseTransaction.create({
        data: {
          date: data.date,
          supplier: data.supplier,
          notes: data.notes,
          totalAmount,
          items: { create: itemsToCreate }
        }
      });

      for (const item of data.items) {
        await tx.masterSupportItem.update({
          where: { id: item.masterSupportItemId },
          data: { stock: { increment: item.quantity } }
        });
      }

      await tx.auditLog.create({
        data: {
          action: "CREATE_PURCHASE",
          entity: "PurchaseTransaction",
          entityId: purchase.id,
          details: JSON.stringify({ supplier: data.supplier, totalAmount }),
          user
        }
      });

      return purchase;
    });
  }

  /**
   * FITUR 3: OMSET HARIAN
   */
  static async createDailyRevenue(data: DailyRevenueFormValues, user: string = "Kasir") {
    return prisma.$transaction(async (tx) => {
      const totalRevenue = data.cashAmount + data.nonCashAmount + data.receivableAmount;
      const netBalance = totalRevenue - data.expenseAmount;

      const existing = await tx.dailyRevenue.findUnique({ where: { date: data.date } });
      if (existing) throw new Error("Omset untuk tanggal ini sudah tercatat!");

      const revenue = await tx.dailyRevenue.create({
        data: {
          date: data.date,
          totalRevenue,
          cashAmount: data.cashAmount,
          nonCashAmount: data.nonCashAmount,
          receivableAmount: data.receivableAmount,
          expenseAmount: data.expenseAmount,
          expenseNotes: data.expenseNotes,
          netBalance
        }
      });

      await tx.auditLog.create({
        data: {
          action: "CREATE_REVENUE",
          entity: "DailyRevenue",
          entityId: revenue.id,
          details: JSON.stringify({ totalRevenue, netBalance }),
          user
        }
      });

      return revenue;
    });
  }

  /**
   * FITUR 4: BARANG SISA (RETUR)
   */
  static async createReturnedItem(data: ReturnedItemFormValues, user: string = "Kasir") {
    return prisma.$transaction(async (tx) => {
      const distItem = await tx.distributionItem.findUnique({
        where: { id: data.distributionItemId }
      });
      if (!distItem) throw new Error("Item distribusi tidak ditemukan");

      const existingReturAgg = await tx.returnedItem.aggregate({
        where: { distributionItemId: data.distributionItemId },
        _sum: { quantity: true }
      });

      const returnedQty = existingReturAgg._sum.quantity || 0;
      if (data.quantity > (distItem.quantity - returnedQty)) {
        throw new Error("Jumlah retur melebihi jumlah barang yang didistribusikan!");
      }

      const retur = await tx.returnedItem.create({
        data: {
          date: data.date,
          distributionItemId: data.distributionItemId,
          quantity: data.quantity,
          weight: data.weight,
          notes: data.notes
        }
      });

      await tx.auditLog.create({
        data: {
          action: "CREATE_RETURN",
          entity: "ReturnedItem",
          entityId: retur.id,
          details: JSON.stringify({ quantity: data.quantity, weight: data.weight }),
          user
        }
      });

      return retur;
    });
  }

  /**
   * FITUR 5: UPDATE HARGA BARANG
   */
  static async updateProductPrice(data: ProductPriceFormValues, user: string = "Kasir") {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.productPrice.findUnique({
        where: { masterPartId: data.masterPartId }
      });

      let priceRecord;
      let oldPrice = 0;

      if (existing) {
        oldPrice = existing.currentPrice;
        priceRecord = await tx.productPrice.update({
          where: { id: existing.id },
          data: { currentPrice: data.newPrice }
        });
      } else {
        priceRecord = await tx.productPrice.create({
          data: {
            masterPartId: data.masterPartId,
            currentPrice: data.newPrice
          }
        });
      }

      await tx.priceHistory.create({
        data: {
          productPriceId: priceRecord.id,
          oldPrice,
          newPrice: data.newPrice,
          effectiveDate: data.effectiveDate,
          notes: (data as any).notes
        }
      });

      await tx.auditLog.create({
        data: {
          action: "UPDATE_PRICE",
          entity: "ProductPrice",
          entityId: priceRecord.id,
          details: JSON.stringify({ oldPrice, newPrice: data.newPrice }),
          user
        }
      });

      return priceRecord;
    });
  }


}
