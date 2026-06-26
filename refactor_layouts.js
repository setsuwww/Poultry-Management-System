const fs = require("fs");
const path = require("path");

const componentsDir = path.join(__dirname, "src/components/layout");
const appDir = path.join(__dirname, "src/app");

const layoutFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith("Layout.tsx"));

// The standard replacement for the layout structure
const replacementLayout = (originalContent) => {
  let content = originalContent;

  // Add TopHeader import if not present
  if (!content.includes("TopHeader")) {
    content = content.replace(/import \{.*\} from "lucide-react";/, `$&
import { TopHeader } from "./TopHeader";`);
  }

  // Ensure user prop is in the interface or parameters
  if (!content.includes("user?: any")) {
    content = content.replace(/\{ children \}: \{ children: React\.ReactNode \}/, "{ children, user }: { children: React.ReactNode; user?: any }");
  }

  // Replace active styles
  content = content.replace(/isActive\s*\?\s*"[^"]+"\s*:\s*"[^"]+"/g,
    `isActive
                    ? "bg-orange-50 text-orange-700 font-semibold border-r-4 border-orange-600 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500"
                    : "text-mist-600 hover:bg-mist-100 hover:text-mist-900 dark:text-mist-400 dark:hover:bg-mist-800 dark:hover:text-mist-50"`
  );

  // Remove the hardcoded user block at the bottom of the sidebar
  content = content.replace(/<div className="absolute bottom-4 left-4 right-4">[\s\S]*?<\/div>\s*<\/aside>/, "</aside>");

  // Refactor the main container to include TopHeader
  content = content.replace(/<main className="pl-64 w-full">[\s\S]*?<\/main>/,
    `<div className="flex flex-col flex-1 pl-64 w-full min-h-screen">
        <TopHeader user={user} />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl p-8">{children}</div>
        </main>
      </div>`
  );

  return content;
};

layoutFiles.forEach(file => {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  content = replacementLayout(content);

  // Fix specific items if they have other roles
  if (file === "AppLayout.tsx") {
    // Keep only Admin Produksi items
    content = content.replace(/const navItems = \[[\s\S]*?\];/, `const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Ayam Masuk", href: "/incoming", icon: Truck },
  { name: "Produksi", href: "/production", icon: Scissors },
  { name: "Packing", href: "/packing", icon: PackageOpen },
];`);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Refactored ${file}`);
});

// Update the Server Layout wrappers to fetch session
const appFolders = fs.readdirSync(appDir).filter(f => f.startsWith("("));

appFolders.forEach(folder => {
  const layoutPath = path.join(appDir, folder, "layout.tsx");
  if (fs.existsSync(layoutPath)) {
    let content = fs.readFileSync(layoutPath, "utf8");

    // Fix imports
    if (!content.includes("getSession")) {
      content = `import { getSession } from "@/lib/auth";\n` + content;
    }

    // Fix component to be async
    content = content.replace(/export default function (\w+)\(/, "export default async function $1(");

    // Inject session
    const layoutMatch = content.match(/<([A-Za-z0-9]+Layout)[^>]*>\{children\}<\/\1>/);
    if (layoutMatch) {
      const layoutName = layoutMatch[1];
      content = content.replace(/return\s+<([A-Za-z0-9]+Layout)[^>]*>\{children\}<\/\1>;/,
        `const session = await getSession();\n  return <${layoutName} user={session}>{children}</${layoutName}>;`);
    }

    fs.writeFileSync(layoutPath, content);
    console.log(`Updated layout wrapper for ${folder}`);
  }
});
