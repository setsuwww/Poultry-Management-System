import { OutletRepository } from "@/server/repositories/outlet.repository";

export default async function OutletStokPage() {
  const inventory = await OutletRepository.getInventoryList();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-mist-900 dark:text-white">Stok Outlet</h1>
        <p className="text-mist-500 mt-2">Daftar akumulasi persediaan barang di Outlet.</p>
      </div>

      <div className="bg-white dark:bg-mist-950 rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
              <tr>
                <th className="px-6 py-4 font-medium">Nama Barang</th>
                <th className="px-6 py-4 font-medium text-center">Stok Tersedia</th>
                <th className="px-6 py-4 font-medium text-right">Terakhir Diupdate</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-mist-500">Belum ada barang di outlet.</td>
                </tr>
              ) : (
                inventory.map((row) => (
                  <tr key={row.id} className="border-b dark:border-mist-800 hover:bg-mist-50 dark:hover:bg-mist-900/50">
                    <td className="px-6 py-4 font-bold text-mist-900 dark:text-white">{row.masterPart.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold text-lg">{row.stock} Pack</span>
                    </td>
                    <td className="px-6 py-4 text-right text-mist-500">
                      {new Date(row.updatedAt).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
