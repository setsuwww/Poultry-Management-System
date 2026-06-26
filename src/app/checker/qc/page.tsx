import { prisma } from "@/lib/prisma";
import { QCForm } from "./QCForm"; // We will create this as client component

export default async function QualityControlPage() {
  const pendingHeaders = await prisma.qualityControlHeader.findMany({
    where: { status: "MENUNGGU_QC" },
    include: {
      outlet: true,
      items: { include: { masterPart: true } }
    },
    orderBy: { createdAt: "asc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Verifikasi Quality Control</h1>
          <p className="text-mist-500 mt-2">Daftar Barang Retur dan Rijek dari outlet yang menunggu validasi kondisi fisik.</p>
        </div>
      </div>

      <div className="space-y-6">
        {pendingHeaders.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border shadow-sm text-center text-mist-500">
            Tidak ada antrean QC saat ini.
          </div>
        ) : (
          pendingHeaders.map(header => (
            <QCForm key={header.id} header={header} />
          ))
        )}
      </div>
    </div>
  );
}
