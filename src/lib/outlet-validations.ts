import { z } from "zod";

export const outletClosingItemSchema = z.object({
  masterPartId: z.string().min(1, "Barang wajib dipilih"),
  initialStock: z.coerce.number().min(0, "Stok awal minimal 0"),
  finalPhysical: z.coerce.number().min(0, "Sisa fisik minimal 0"),
  notes: z.string().optional()
});

export const closingEmployeeSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  role: z.string().min(1, "Peran wajib diisi")
});

export const outletClosingSchema = z.object({
  outletId: z.string().min(1, "Outlet wajib dipilih"),
  date: z.coerce.date(),
  items: z.array(outletClosingItemSchema).min(1, "Minimal 1 barang"),
  employees: z.array(closingEmployeeSchema).min(1, "Minimal 1 petugas pada shift ini")
});
export type OutletClosingFormValues = z.infer<typeof outletClosingSchema>;

export const stockTransferItemSchema = z.object({
  masterPartId: z.string().min(1, "Barang wajib dipilih"),
  quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
  notes: z.string().optional()
});

export const stockTransferSchema = z.object({
  fromOutletId: z.string().min(1, "Outlet Asal wajib dipilih"),
  toOutletId: z.string().min(1, "Outlet Tujuan wajib dipilih"),
  date: z.coerce.date(),
  notes: z.string().optional(),
  items: z.array(stockTransferItemSchema).min(1, "Minimal 1 barang dipindahkan")
}).refine(data => data.fromOutletId !== data.toOutletId, {
  message: "Outlet Asal dan Outlet Tujuan tidak boleh sama",
  path: ["toOutletId"]
});
export type StockTransferFormValues = z.infer<typeof stockTransferSchema>;

export const returnedItemV2Schema = z.object({
  masterPartId: z.string().min(1, "Barang wajib dipilih"),
  quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
  reason: z.string().min(1, "Alasan wajib diisi")
});

export const returnedGoodsSchema = z.object({
  outletId: z.string().min(1, "Outlet wajib dipilih"),
  date: z.coerce.date(),
  notes: z.string().optional(),
  items: z.array(returnedItemV2Schema).min(1, "Minimal 1 barang diretur")
});
export type ReturnedGoodsFormValues = z.infer<typeof returnedGoodsSchema>;

export const rejectedItemSchema = z.object({
  masterPartId: z.string().min(1, "Barang wajib dipilih"),
  quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
  reason: z.string().min(1, "Alasan wajib diisi")
});

export const rejectedGoodsSchema = z.object({
  outletId: z.string().min(1, "Outlet wajib dipilih"),
  date: z.coerce.date(),
  notes: z.string().optional(),
  items: z.array(rejectedItemSchema).min(1, "Minimal 1 barang diretur")
});
export type RejectedGoodsFormValues = z.infer<typeof rejectedGoodsSchema>;

export const soVerificationSchema = z.object({
  outletClosingId: z.string(),
  isMatch: z.boolean(), 
  notes: z.string().optional(),
  differences: z.array(z.object({
    masterPartId: z.string(),
    missingQuantity: z.number().min(1),
    classification: z.enum(["SUSUT", "HILANG"])
  })).optional(),
  isRejected: z.boolean().default(false)
});
export type SOVerificationFormValues = z.infer<typeof soVerificationSchema>;
