const fs = require('fs');

const replacements = [
  // Admin Produksi - Incoming
  {
    file: 'src/components/incoming/IncomingForm.tsx',
    search: 'href="/incoming"',
    replace: 'href="/admin-produksi/incoming"'
  },
  {
    file: 'src/components/incoming/IncomingForm.tsx',
    search: 'router.push("/incoming")',
    replace: 'router.push("/admin-produksi/incoming")'
  },
  {
    file: 'src/app/admin-produksi/incoming/page.tsx',
    search: 'href="/incoming/new"',
    replace: 'href="/admin-produksi/incoming/new"'
  },
  // Admin Produksi - Production
  {
    file: 'src/components/production/ProductionForm.tsx',
    search: 'href="/production"',
    replace: 'href="/admin-produksi/production"'
  },
  {
    file: 'src/components/production/ProductionForm.tsx',
    search: 'router.push("/production")',
    replace: 'router.push("/admin-produksi/production")'
  },
  {
    file: 'src/app/admin-produksi/production/page.tsx',
    search: 'href="/production/new"',
    replace: 'href="/admin-produksi/production/new"'
  },
  {
    file: 'src/app/admin-produksi/production/[id]/page.tsx',
    search: 'href="/production"',
    replace: 'href="/admin-produksi/production"'
  },
  // Admin Produksi - Packing
  {
    file: 'src/components/packing/PackingForm.tsx',
    search: 'href="/packing"',
    replace: 'href="/admin-produksi/packing"'
  },
  {
    file: 'src/components/packing/PackingForm.tsx',
    search: 'router.push("/packing")',
    replace: 'router.push("/admin-produksi/packing")'
  },
  {
    file: 'src/app/admin-produksi/packing/page.tsx',
    search: 'href="/packing/new"',
    replace: 'href="/admin-produksi/packing/new"'
  },
  {
    file: 'src/app/admin-produksi/packing/[id]/page.tsx',
    search: 'href="/packing"',
    replace: 'href="/admin-produksi/packing"'
  },
  // Outlet
  {
    file: 'src/components/outlet/forms/OutletClosingForm.tsx',
    search: 'router.push("/outlet/stok")',
    replace: 'router.push("/outlet/outlet/stok")'
  },
  // Admin SO
  {
    file: 'src/components/admin-so/forms/VerifyClosingForm.tsx',
    search: 'router.push("/so")',
    replace: 'router.push("/admin-so/so")' // Replace multiple
  },
  // Kasir
  {
    file: 'src/components/kasir/forms/DistributionForm.tsx',
    search: 'router.push("/kasir")',
    replace: 'router.push("/kasir-produksi/kasir")'
  },
  {
    file: 'src/components/kasir/forms/PurchaseForm.tsx',
    search: 'router.push("/kasir")',
    replace: 'router.push("/kasir-produksi/kasir")'
  },
  {
    file: 'src/components/kasir/forms/ReturnForm.tsx',
    search: 'router.push("/kasir")',
    replace: 'router.push("/kasir-produksi/kasir")'
  },
  {
    file: 'src/components/kasir/forms/RevenueForm.tsx',
    search: 'router.push("/kasir")',
    replace: 'router.push("/kasir-produksi/kasir")'
  },
  {
    file: 'src/components/kasir/forms/PriceForm.tsx',
    search: 'router.push("/kasir")',
    replace: 'router.push("/kasir-produksi/kasir")'
  }
];

replacements.forEach(({ file, search, replace }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // globally replace if multiple occur
    content = content.split(search).join(replace);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Replaced in ${file}: ${search} -> ${replace}`);
  } else {
    console.warn(`File not found: ${file}`);
  }
});
