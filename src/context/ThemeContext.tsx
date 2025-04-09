import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";

type ThemeContextType = {
  theme: 'dark' | 'light';
  setTheme: Dispatch<SetStateAction<'dark' | 'light'>>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
		document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
