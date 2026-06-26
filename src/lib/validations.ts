import { z } from "zod";

export const incomingChickenSchema = z.object({
  date: z.coerce.date(),
  deliveryOrder: z.string().min(1, "Delivery Order harus diisi"),
  farmId: z.string().min(1, "Kandang harus dipilih"),
  driverId: z.string().min(1, "Supir harus dipilih"),
  vehicleId: z.string().min(1, "No Polisi harus dipilih"),
  totalWeight: z.coerce.number().positive("Berat harus lebih dari 0"),
  totalCount: z.coerce.number().int().positive("Jumlah ekor harus lebih dari 0"),
  basketCount: z.coerce.number().int().positive("Jumlah keranjang harus lebih dari 0"),
});

export type IncomingChickenFormValues = z.infer<typeof incomingChickenSchema>;

export const productionItemSchema = z.object({
  masterPartId: z.string().min(1, "Bagian ayam harus dipilih"),
  weight: z.coerce.number().min(0, "Berat tidak boleh negatif"),
});

export const productionBatchSchema = z.object({
  incomingChickenId: z.string().min(1, "Ayam Hidup (DO) harus dipilih"),
  items: z.array(productionItemSchema).min(1, "Minimal harus ada 1 bagian ayam"),
}).refine((data) => {
  const partIds = data.items.map((item) => item.masterPartId);
  return new Set(partIds).size === partIds.length;
}, {
  message: "Tidak boleh ada bagian ayam yang duplikat dalam 1 batch",
  path: ["items"],
});

export type ProductionBatchFormValues = z.infer<typeof productionBatchSchema>;

export const packingItemSchema = z.object({
  productionItemId: z.string().min(1, "Bagian ayam harus dipilih"),
  packageSize: z.coerce.number().min(0.1, "Ukuran kemasan harus lebih dari 0"),
  packageCount: z.coerce.number().int().min(1, "Jumlah plastik minimal 1"),
});

export const packingBatchSchema = z.object({
  productionBatchId: z.string().min(1, "Production Batch harus dipilih"),
  packingDate: z.coerce.date(),
  items: z.array(packingItemSchema).min(1, "Minimal harus ada 1 item packing"),
});

export type PackingBatchFormValues = z.infer<typeof packingBatchSchema>;

export const purchaseItemSchema = z.object({
  masterSupportItemId: z.string().min(1, "Barang pendukung wajib dipilih"),
  quantity: z.coerce.number().int().min(1, "Quantity minimal 1"),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
});

export const purchaseTransactionSchema = z.object({
  date: z.coerce.date(),
  supplier: z.string().min(1, "Supplier harus diisi"),
  notes: z.string().optional(),
  items: z.array(purchaseItemSchema).min(1, "Minimal 1 barang"),
});

export type PurchaseTransactionFormValues = z.infer<typeof purchaseTransactionSchema>;

export const distributionItemSchema = z.object({
  packingItemId: z.string().min(1, "Barang harus dipilih"),
  quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
});

export const distributionOrderSchema = z.object({
  date: z.coerce.date(),
  destination: z.string().min(1, "Tujuan harus diisi"),
  type: z.enum(["OUTLET", "RESELLER"]),
  driverId: z.string().min(1, "Sopir harus dipilih"),
  vehicleId: z.string().min(1, "Kendaraan harus dipilih"),
  items: z.array(distributionItemSchema).min(1, "Minimal 1 barang"),
});

export type DistributionOrderFormValues = z.infer<typeof distributionOrderSchema>;

export const dailyRevenueSchema = z.object({
  date: z.coerce.date(),
  cashAmount: z.coerce.number().min(0, "Tidak boleh negatif"),
  nonCashAmount: z.coerce.number().min(0, "Tidak boleh negatif"),
  receivableAmount: z.coerce.number().min(0, "Tidak boleh negatif"),
  expenseAmount: z.coerce.number().min(0, "Tidak boleh negatif"),
  expenseNotes: z.string().optional(),
});

export type DailyRevenueFormValues = z.infer<typeof dailyRevenueSchema>;

export const returnedItemSchema = z.object({
  date: z.coerce.date(),
  distributionItemId: z.string().min(1, "Item distribusi harus dipilih"),
  quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
  weight: z.coerce.number().min(0.1, "Berat minimal 0.1 kg"),
  notes: z.string().optional(),
});

export type ReturnedItemFormValues = z.infer<typeof returnedItemSchema>;

export const productPriceSchema = z.object({
  masterPartId: z.string().min(1, "Bagian ayam harus dipilih"),
  newPrice: z.coerce.number().min(1, "Harga tidak boleh nol"),
  effectiveDate: z.coerce.date(),
});

export type ProductPriceFormValues = z.infer<typeof productPriceSchema>;

export const driverVerificationSchema = z.object({
  distributionOrderId: z.string().min(1, "SJ harus dipilih"),
  status: z.enum(["APPROVED", "REJECTED"]),
  notes: z.string().optional()
});

export type DriverVerificationFormValues = z.infer<typeof driverVerificationSchema>;

export const outletVerificationItemSchema = z.object({
  distributionItemId: z.string(),
  receivedQuantity: z.coerce.number().min(0, "Tidak boleh negatif"),
  missingQuantity: z.coerce.number().min(0),
  missingReason: z.string().optional()
});

export const outletVerificationSchema = z.object({
  distributionOrderId: z.string(),
  items: z.array(outletVerificationItemSchema)
});

export type OutletVerificationFormValues = z.infer<typeof outletVerificationSchema>;

export const dailyOutletRevenueSchema = z.object({
  date: z.coerce.date(),
  totalRevenue: z.coerce.number().min(0, "Total Omset tidak boleh negatif"),
  cashAmount: z.coerce.number().min(0),
  nonCashAmount: z.coerce.number().min(0),
  receivableAmount: z.coerce.number().min(0),
  expenseAmount: z.coerce.number().min(0),
  expenseNotes: z.string().optional()
});

export type DailyOutletRevenueFormValues = z.infer<typeof dailyOutletRevenueSchema>;

export const cashDepositSchema = z.object({
  date: z.coerce.date(),
  amount: z.coerce.number().min(0, "Jumlah setoran tidak boleh negatif"),
  notes: z.string().optional()
});

export type CashDepositFormValues = z.infer<typeof cashDepositSchema>;

export const verifyDepositSchema = z.object({
  cashDepositId: z.string(),
  actualSalesAmount: z.coerce.number().min(0, "Jumlah tidak boleh negatif"),
  notes: z.string().optional()
});

export type VerifyDepositFormValues = z.infer<typeof verifyDepositSchema>;
