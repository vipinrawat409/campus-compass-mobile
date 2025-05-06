
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeColor = 'blue' | 'green' | 'purple' | 'pink' | 'peach' | 'yellow' | 'orange';

interface ThemeContextType {
  themeColor: ThemeColor;
  changeTheme: (color: ThemeColor) => void;
  getInstituteTheme: (instituteId: number) => ThemeColor;
}

interface InstituteThemeMapping {
  [instituteId: number]: ThemeColor;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');
  const [instituteThemes, setInstituteThemes] = useState<InstituteThemeMapping>({});

  // Apply CSS variables based on theme color
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', getThemeColorValue(themeColor));
    document.documentElement.style.setProperty('--theme-light', getThemeLightValue(themeColor));
  }, [themeColor]);

  const changeTheme = (color: ThemeColor) => {
    setThemeColor(color);
    localStorage.setItem('institute-theme', color);
  };

  // Load theme from localStorage on initial render
  useEffect(() => {
    // Load user's theme
    const savedTheme = localStorage.getItem('institute-theme') as ThemeColor | null;
    if (savedTheme) {
      setThemeColor(savedTheme);
    }
    
    // Load institute themes mapping
    const savedInstituteThemes = localStorage.getItem('institute-themes-mapping');
    if (savedInstituteThemes) {
      setInstituteThemes(JSON.parse(savedInstituteThemes));
    }
  }, []);

  // Get theme for a specific institute
  const getInstituteTheme = (instituteId: number): ThemeColor => {
    return instituteThemes[instituteId] || 'blue';
  };

  // Helper functions to get color values
  function getThemeColorValue(color: ThemeColor): string {
    switch (color) {
      case 'blue': return '#3B82F6';
      case 'green': return '#10B981';
      case 'purple': return '#8B5CF6';
      case 'pink': return '#EC4899';
      case 'peach': return '#F97316';
      case 'yellow': return '#EAB308';
      case 'orange': return '#F59E0B';
      default: return '#3B82F6';
    }
  }

  function getThemeLightValue(color: ThemeColor): string {
    switch (color) {
      case 'blue': return '#D3E4FD';
      case 'green': return '#F2FCE2';
      case 'purple': return '#E5DEFF';
      case 'pink': return '#FFDEE2';
      case 'peach': return '#FDE1D3';
      case 'yellow': return '#FEF7CD';
      case 'orange': return '#FEC6A1';
      default: return '#D3E4FD';
    }
  }

  return (
    <ThemeContext.Provider value={{ themeColor, changeTheme, getInstituteTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
