const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'src', 'app');

// 1. Rename directories
const renames = [
  { old: '(admin_produksi)', new: 'admin-produksi' },
  { old: '(admin_omset)', new: 'admin-omset' },
  { old: '(admin_so)', new: 'admin-so' },
  { old: '(checker)', new: 'checker' },
  { old: '(driver)', new: 'driver' },
  { old: '(kasir_produksi)', new: 'kasir-produksi' },
  { old: '(outlet)', new: 'outlet' }
];

renames.forEach(r => {
  const oldPath = path.join(appDir, r.old);
  const newPath = path.join(appDir, r.new);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${r.old} to ${r.new}`);
  }
});

// 2. Update auth.ts
const authPath = path.join(__dirname, 'src', 'lib', 'auth.ts');
if (fs.existsSync(authPath)) {
  let content = fs.readFileSync(authPath, 'utf8');
  content = content.replace(/export const ROLE_PERMISSIONS: Record<string, string\[\]> = \{[\s\S]*?\};/, `export const ROLE_PERMISSIONS: Record<string, string[]> = {
  "Owner": ["/admin-produksi", "/kasir-produksi", "/driver", "/outlet", "/admin-so", "/admin-omset", "/checker"],
  "Admin Produksi": ["/admin-produksi"],
  "Kasir Produksi": ["/kasir-produksi"],
  "Driver": ["/driver"],
  "Kasir Outlet": ["/outlet"],
  "Admin SO": ["/admin-so"],
  "Admin Omset": ["/admin-omset"],
  "Checker Sasak": ["/checker"]
};`);
  fs.writeFileSync(authPath, content);
  console.log('Updated auth.ts');
}

// 3. Update proxy.ts
const proxyPath = path.join(__dirname, 'src', 'proxy.ts');
if (fs.existsSync(proxyPath)) {
  let content = fs.readFileSync(proxyPath, 'utf8');
  content = content.replace(/const roleRoutes: Record<string, string> = \{[\s\S]*?\};\s*const redirectPath = roleRoutes\[session\.role\] \|\| ".*?";/, `const roleRoutes: Record<string, string> = {
      "Owner": "/admin-produksi/dashboard",
      "Admin Produksi": "/admin-produksi/dashboard",
      "Kasir Produksi": "/kasir-produksi/kasir",
      "Driver": "/driver/driver",
      "Kasir Outlet": "/outlet/penerimaan",
      "Admin SO": "/admin-so/so",
      "Admin Omset": "/admin-omset/finance",
      "Checker Sasak": "/checker/qc"
    };
    const redirectPath = roleRoutes[session.role] || "/admin-produksi/dashboard";`);
  fs.writeFileSync(proxyPath, content);
  console.log('Updated proxy.ts');
}

// 4. Update Nav Links in Layouts
const layoutsDir = path.join(__dirname, 'src', 'components', 'layout');
if (fs.existsSync(layoutsDir)) {
  const layouts = {
    'AppLayout.tsx': '/admin-produksi',
    'AdminOmsetLayout.tsx': '/admin-omset',
    'AdminSOLayout.tsx': '/admin-so',
    'CheckerLayout.tsx': '/checker',
    'DriverLayout.tsx': '/driver',
    'KasirLayout.tsx': '/kasir-produksi',
    'OutletLayout.tsx': '/outlet'
  };

  Object.entries(layouts).forEach(([file, prefix]) => {
    const filePath = path.join(layoutsDir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // We need to carefully replace href: "/something" to href: "/prefix/something"
      // But only for the navItems array!
      // If href is already prefixed, we should avoid double prefixing.
      content = content.replace(/href:\s*"(.*?)"/g, (match, p1) => {
        if (p1.startsWith(prefix)) return match; // Already prefixed
        if (p1 === '/' || p1 === '/dashboard') return `href: "${prefix}/dashboard"`;
        return `href: "${prefix}${p1.startsWith('/') ? p1 : '/' + p1}"`;
      });

      fs.writeFileSync(filePath, content);
      console.log(`Updated nav links in ${file}`);
    }
  });
}
