const fs = require('fs');
const path = require('path');

const actionsDir = path.join(__dirname, 'src', 'actions');
const files = fs.readdirSync(actionsDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

const replacements = [
  { old: 'revalidatePath("/(outlet)", "layout")', new: 'revalidatePath("/outlet", "layout")' },
  { old: 'revalidatePath("/(admin_so)", "layout")', new: 'revalidatePath("/admin-so", "layout")' },
  { old: 'revalidatePath("/(admin_omset)", "layout")', new: 'revalidatePath("/admin-omset", "layout")' },
  { old: 'revalidatePath("/(checker)", "layout")', new: 'revalidatePath("/checker", "layout")' },
  { old: 'revalidatePath("/(driver)", "layout")', new: 'revalidatePath("/driver", "layout")' },
  { old: 'revalidatePath("/(kasir_produksi)", "layout")', new: 'revalidatePath("/kasir-produksi", "layout")' },
  { old: 'revalidatePath("/incoming")', new: 'revalidatePath("/admin-produksi/incoming")' },
  { old: 'revalidatePath("/production")', new: 'revalidatePath("/admin-produksi/production")' },
  { old: 'revalidatePath("/packing")', new: 'revalidatePath("/admin-produksi/packing")' },
];

files.forEach(file => {
  const filePath = path.join(actionsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  replacements.forEach(r => {
    if (content.includes(r.old)) {
      content = content.split(r.old).join(r.new);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed revalidatePath in ${file}`);
  }
});
