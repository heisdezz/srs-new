import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router";

const theme_array = [
  "srs",
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset",
  "caramellatte",
  "abyss",
  "silk",
] as const;

type Theme = (typeof theme_array)[number];

export const useTheme = () => {
  const props = useRouteLoaderData("root");
  const currentTheme = props["theme"] || "srs";
  const [theme, setTheme] = useState(currentTheme);
  const updateTheme = (theme: Theme) => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    setTheme(theme);
  };

  return { theme, setTheme, theme_array, updateTheme };
};
