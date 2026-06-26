import { CashDepositForm } from "@/components/outlet/forms/CashDepositForm";

export default function OutletSetoranPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Penyerahan Kas Fisik</h1>
        <p className="text-mist-500 mt-2">Laporkan jumlah uang fisik yang Anda setor. Data ini akan diverifikasi oleh Admin Omset.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <CashDepositForm />
        </div>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-sm text-blue-900">
          <h4 className="font-bold mb-2">Aturan Penyetoran:</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Setoran harus diserahkan secara utuh dan sesuai dengan penjualan riil.</li>
            <li>Admin Omset akan membandingkan uang fisik ini dengan catatan di <strong>Aplikasi Kasir Pintar</strong>.</li>
            <li>Jika uang setoran <strong>KURANG</strong>, maka Anda akan dikenakan Tanggungan (Denda) sebesar <strong>2x lipat dari nilai kekurangan</strong>.</li>
            <li>Jika uang setoran <strong>LEBIH</strong>, maka kelebihan tersebut akan digunakan untuk mengkompensasi atau melunasi <strong>Minus Barang</strong> (jika ada). Jika tidak ada Minus Barang, uang lebih akan masuk ke kas perusahaan.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
