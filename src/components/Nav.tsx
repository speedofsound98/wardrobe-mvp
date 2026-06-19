"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shirt, PlusCircle, Sparkles, LayoutDashboard, BookMarked, Sun, Snowflake, Leaf } from "lucide-react";
import { PROFILES } from "@/lib/profiles";
import { useProfile } from "@/lib/useProfile";
import { useSeason, type SeasonMode } from "@/lib/useSeason";

const SEASON_MODES: { mode: SeasonMode; icon: React.ElementType; label: string }[] = [
  { mode: "all", icon: Leaf, label: "All seasons" },
  { mode: "summer", icon: Sun, label: "Summer" },
  { mode: "winter", icon: Snowflake, label: "Winter" },
];

const links = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/wardrobe", label: "Wardrobe", icon: Shirt },
  { href: "/add", label: "Add item", icon: PlusCircle },
  { href: "/outfit", label: "Outfit", icon: Sparkles },
  { href: "/outfits", label: "Saved", icon: BookMarked },
];

export default function Nav() {
  const pathname = usePathname();
  const [profile, switchProfile] = useProfile();
  const [season, switchSeason] = useSeason();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight text-slate-900">Wardrobe</span>
          <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-0.5">
            {PROFILES.map((p) => (
              <button
                key={p}
                onClick={() => switchProfile(p)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                  profile === p ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                } ${profile === null ? "opacity-0" : ""}`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* season toggle */}
          <div className={`flex rounded-xl border border-slate-200 bg-slate-100 p-0.5 transition-opacity ${season === null ? "opacity-0" : ""}`}>
            {SEASON_MODES.map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => switchSeason(mode)}
                title={label}
                className={`rounded-lg p-1.5 transition-colors ${
                  season === mode ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
        <ul className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
