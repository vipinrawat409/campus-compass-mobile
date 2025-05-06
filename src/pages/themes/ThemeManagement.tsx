
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { School, Palette, CheckCircle, EyeOff, PaintBucket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/sonner";
import { cn } from '@/lib/utils';
import { INSTITUTES } from '@/contexts/AuthContext';
import { ThemeColor } from '@/contexts/ThemeContext';

const COLOR_THEMES = [
  { 
    id: 'blue', 
    name: 'Blue',
    primary: '#3B82F6',
    secondary: '#2980b9',
    accent: '#D3E4FD',
    text: '#2c3e50'
  },
  { 
    id: 'green', 
    name: 'Green',
    primary: '#10B981',
    secondary: '#27ae60',
    accent: '#F2FCE2',
    text: '#27ae60'  
  },
  { 
    id: 'purple', 
    name: 'Purple',
    primary: '#8B5CF6',
    secondary: '#8e44ad',
    accent: '#E5DEFF',
    text: '#6c3483'
  },
  { 
    id: 'pink', 
    name: 'Pink',
    primary: '#EC4899',
    secondary: '#d35400',
    accent: '#FFDEE2',
    text: '#d35400'
  },
  { 
    id: 'peach', 
    name: 'Peach',
    primary: '#F97316',
    secondary: '#c0392b',
    accent: '#FDE1D3',
    text: '#c0392b'
  },
  { 
    id: 'yellow', 
    name: 'Yellow',
    primary: '#EAB308',
    secondary: '#16a085',
    accent: '#FEF7CD',
    text: '#16a085'
  },
  { 
    id: 'orange', 
    name: 'Orange',
    primary: '#F59E0B',
    secondary: '#d35400',
    accent: '#FEC6A1',
    text: '#d35400'
  },
];

interface PreviewCardProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
}

const PreviewCard = ({ primaryColor, secondaryColor, accentColor, textColor }: PreviewCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between"
        style={{ backgroundColor: primaryColor, color: 'white' }}
      >
        <h3 className="font-bold">Header</h3>
        <PaintBucket size={16} />
      </div>
      
      {/* Sidebar */}
      <div className="flex">
        <div 
          className="w-1/4 p-4 space-y-2"
          style={{ backgroundColor: accentColor, color: textColor }}
        >
          <p className="text-xs font-medium">Sidebar</p>
          <div className="h-3 w-full rounded" style={{ backgroundColor: secondaryColor }}></div>
          <div className="h-3 w-full rounded" style={{ backgroundColor: secondaryColor }}></div>
          <div className="h-3 w-3/4 rounded" style={{ backgroundColor: secondaryColor }}></div>
        </div>
        
        {/* Content */}
        <div className="w-3/4 p-4 bg-white">
          <div className="space-y-3">
            <h4 className="text-sm font-medium" style={{ color: textColor }}>Content Area</h4>
            <div className="space-y-2">
              <div className="h-2 w-full rounded bg-gray-100"></div>
              <div className="h-2 w-5/6 rounded bg-gray-100"></div>
              <div className="h-2 w-4/6 rounded bg-gray-100"></div>
            </div>
            <button 
              className="text-xs px-2 py-1 rounded text-white"
              style={{ backgroundColor: primaryColor }}
            >
              Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ThemeManagement = () => {
  const { user } = useAuth();
  const { themeColor, changeTheme } = useTheme();
  const [selectedInstitute, setSelectedInstitute] = useState<number | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [instituteThemes, setInstituteThemes] = useState<Record<number, string>>({});

  // Load institute themes on component mount
  useEffect(() => {
    const savedThemes = localStorage.getItem('institute-themes-mapping');
    if (savedThemes) {
      setInstituteThemes(JSON.parse(savedThemes));
    } else {
      // Initialize with default themes
      const defaultThemes: Record<number, string> = {};
      INSTITUTES.forEach(institute => {
        defaultThemes[institute.id] = institute.theme;
      });
      setInstituteThemes(defaultThemes);
      localStorage.setItem('institute-themes-mapping', JSON.stringify(defaultThemes));
    }
  }, []);

  if (user?.role !== 'superadmin') {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
        <div className="text-center p-6">
          <div className="flex justify-center mb-4">
            <EyeOff size={48} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium">Access Denied</h3>
          <p className="text-gray-500 mt-2">You don't have permission to access this section.</p>
        </div>
      </div>
    );
  }

  const handleSelectInstitute = (id: number) => {
    setSelectedInstitute(id);
    // Set the initial selected theme to what the institute currently has
    setSelectedTheme(instituteThemes[id] || null);
  };

  const handleSelectTheme = (id: string) => {
    setSelectedTheme(id);
  };

  const applyTheme = () => {
    if (!selectedInstitute || !selectedTheme) return;
    
    const institute = INSTITUTES.find(i => i.id === selectedInstitute);
    const theme = COLOR_THEMES.find(t => t.id === selectedTheme);
    
    if (institute && theme) {
      // Update the institute theme in our state
      const updatedThemes = { ...instituteThemes, [selectedInstitute]: selectedTheme };
      setInstituteThemes(updatedThemes);
      
      // Save to localStorage for persistence
      localStorage.setItem('institute-themes-mapping', JSON.stringify(updatedThemes));
      
      toast(`Theme Applied to ${institute.name}`, {
        description: `${theme.name} theme has been applied to ${institute.name}`
      });
    }
  };

  const selectedThemeData = selectedTheme 
    ? COLOR_THEMES.find(theme => theme.id === selectedTheme) 
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Theme Management</h1>
        <p className="text-gray-500">Customize the look and feel of your institutes</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Institute selection */}
        <div className="card-wrapper">
          <h2 className="text-lg font-medium mb-4">Select Institute</h2>
          <div className="space-y-4">
            {INSTITUTES.map(institute => (
              <div 
                key={institute.id} 
                className={cn(
                  "p-3 border rounded-lg cursor-pointer transition-colors flex items-center justify-between",
                  selectedInstitute === institute.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                )}
                onClick={() => handleSelectInstitute(institute.id)}
              >
                <div className="flex items-center">
                  <School size={18} className="text-primary mr-2" />
                  <div>
                    <p className="font-medium">{institute.name}</p>
                    <p className="text-xs text-gray-500">{institute.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {instituteThemes[institute.id] && (
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLOR_THEMES.find(t => t.id === instituteThemes[institute.id])?.primary }}
                    />
                  )}
                  {selectedInstitute === institute.id && (
                    <CheckCircle size={18} className="text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Middle column - Theme selection */}
        <div className="card-wrapper">
          <h2 className="text-lg font-medium mb-4">Select Theme</h2>
          
          {selectedInstitute ? (
            <div className="grid grid-cols-2 gap-3">
              {COLOR_THEMES.map(theme => (
                <div 
                  key={theme.id}
                  className={cn(
                    "border rounded-lg cursor-pointer transition-colors p-3",
                    selectedTheme === theme.id ? 'border-primary' : 'border-gray-200'
                  )}
                  onClick={() => handleSelectTheme(theme.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{theme.name}</p>
                    {selectedTheme === theme.id && (
                      <CheckCircle size={16} className="text-primary" />
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 rounded-full" style={{backgroundColor: theme.primary}}></div>
                    <div className="w-6 h-6 rounded-full" style={{backgroundColor: theme.secondary}}></div>
                    <div className="w-6 h-6 rounded-full" style={{backgroundColor: theme.accent}}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Palette size={32} />
              <p className="mt-2">Select an institute first</p>
            </div>
          )}
        </div>
        
        {/* Right column - Preview */}
        <div className="card-wrapper">
          <h2 className="text-lg font-medium mb-4">Preview</h2>
          
          {selectedTheme && selectedThemeData ? (
            <>
              <PreviewCard 
                primaryColor={selectedThemeData.primary}
                secondaryColor={selectedThemeData.secondary}
                accentColor={selectedThemeData.accent}
                textColor={selectedThemeData.text}
              />
              
              <div className="mt-4">
                <Button 
                  className="w-full" 
                  onClick={applyTheme}
                >
                  Apply Theme
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Palette size={32} />
              <p className="mt-2">Select a theme to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeManagement;
