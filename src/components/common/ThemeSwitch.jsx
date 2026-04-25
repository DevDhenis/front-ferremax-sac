import { useTheme } from "@/hooks/useTheme";
import { Button } from "primereact/button";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      icon={theme === "dark" ? "pi pi-sun" : "pi pi-moon"}
      label={theme === "dark" ? "Claro" : "Oscuro"}
      onClick={toggleTheme}
      className="p-button-rounded p-button-text"
    />
  );
}
