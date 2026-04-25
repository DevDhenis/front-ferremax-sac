import { useState, useEffect, useContext,  } from "react";
import { PrimeReactContext } from "primereact/api";

export function useTheme() {
  const { changeTheme } = useContext(PrimeReactContext);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const link = document.getElementById("theme-link");

    if (changeTheme && link) {
      const currentTheme =
        theme === "dark" ? "lara-light-blue" : "lara-dark-blue";
      const newTheme = theme === "dark" ? "lara-dark-blue" : "lara-light-blue";

      changeTheme(currentTheme, newTheme, "theme-link", () => {
        console.log(`Tema PrimeReact cambiado a ${newTheme}`);
      });
    }

    document.body.style.backgroundColor =
      theme === "dark" ? "#1e293b" : "#f8fafc";
    document.body.style.color = theme === "dark" ? "#e5e7eb" : "#111827";

    localStorage.setItem("theme", theme);
  }, [theme, changeTheme]);

  return { theme, setTheme };
}
