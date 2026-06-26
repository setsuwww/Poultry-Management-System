import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-mist-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-extrabold text-mist-900 mb-2">Akses Ditolak</h1>
        <p className="text-mist-500 mb-6">
          Anda tidak memiliki izin (role) yang cukup untuk mengakses halaman ini.
        </p>
        <Link
          href="/"
          className="bg-mist-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-black"
        >
          Kembali ke Dashboard Saya
        </Link>
      </div>
    </div>
  );
}
