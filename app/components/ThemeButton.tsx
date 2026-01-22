import { useTheme } from "@/helpers/theme";
import { Palette } from "lucide-react";

export default function ThemeButton() {
  const { theme, setTheme, updateTheme, theme_array } = useTheme();

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-square md:btn-wide md:p-2 btn-ghost "
      >
        <Palette className="h-5 w-5" />
        <span className="hidden md:inline capitalize">{theme}</span>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52 max-h-96 overflow-y-auto"
      >
        {theme_array.map((t) => (
          <li key={t}>
            <button
              className={`${theme === t ? "active" : ""} capitalize`}
              onClick={() => updateTheme(t)}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
