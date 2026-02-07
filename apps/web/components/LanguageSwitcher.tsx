"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleLocaleChange(newLocale: string) {
    router.replace(pathname, { locale: newLocale as any });
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`px-2 py-1 rounded text-xs font-medium uppercase transition-colors ${
            locale === loc
              ? "bg-accent text-white"
              : "text-text-muted hover:text-primary"
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
