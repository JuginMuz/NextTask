import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Theme = "default" | "high-contrast";
type MotionPreference = "default" | "reduced";

type ThemeContextType = {
  theme: Theme;
  motion: MotionPreference;
  toggleTheme: () => void;
  toggleMotion: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("default");
  const [motion, setMotion] = useState<MotionPreference>("default");
  const hasLoadedPreferences = useRef(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const savedMotion = localStorage.getItem("motion");

      if (savedTheme === "high-contrast") {
        setTheme("high-contrast");
      }

      if (savedMotion === "reduced") {
        setMotion("reduced");
      }
    } catch (error) {
      console.error("Failed to read accessibility preferences:", error);
    } finally {
      hasLoadedPreferences.current = true;
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    if (!hasLoadedPreferences.current) return;

    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-motion", motion);

    if (!hasLoadedPreferences.current) return;

    try {
      localStorage.setItem("motion", motion);
    } catch (error) {
      console.error("Failed to save motion preference:", error);
    }
  }, [motion]);

  function toggleTheme() {
    setTheme((prev) => (prev === "default" ? "high-contrast" : "default"));
  }

  function toggleMotion() {
    setMotion((prev) => (prev === "default" ? "reduced" : "default"));
  }

  return (
    <ThemeContext.Provider value={{ theme, motion, toggleTheme, toggleMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}