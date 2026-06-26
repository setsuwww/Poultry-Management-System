import { hasPermission } from "./src/lib/auth";

console.log("hasPermission Admin Produksi, /admin-produksi/incoming/new:", hasPermission("Admin Produksi", "/admin-produksi/incoming/new"));
console.log("hasPermission Admin Produksi, /admin-produksi/incoming:", hasPermission("Admin Produksi", "/admin-produksi/incoming"));
