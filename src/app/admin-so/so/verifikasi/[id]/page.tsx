import { prisma } from "@/lib/prisma";
import { VerifyClosingForm } from "@/components/admin-so/forms/VerifyClosingForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function VerifyClosingPage({ params }: { params: { id: string } }) {
  const closing = await prisma.outletClosing.findUnique({
    where: { id: params.id },
    include: {
      outlet: true,
      employees: true,
      items: { include: { masterPart: true } }
    }
  });

  if (!closing) {
    return <div className="p-8 text-center font-bold text-red-600">Data Closing tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/so" className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Verifikasi Audit SO</h1>
        <p className="text-mist-500 mt-1">Laporan dari Outlet: <strong className="text-rose-600">{closing.outlet.name}</strong></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-mist-500 font-medium">Tanggal Shift</p>
          <p className="text-lg font-bold text-mist-900">{new Date(closing.date).toLocaleDateString("id-ID")}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-mist-500 font-medium">Petugas Terlibat</p>
          <div className="mt-1">
            {closing.employees.map(emp => (
              <span key={emp.id} className="inline-block bg-mist-100 px-2 py-1 rounded text-xs font-semibold mr-1">
                {emp.name} ({emp.role})
              </span>
            ))}
          </div>
        </div>
      </div>

      <VerifyClosingForm closing={closing} />
    </div>
  );
}
