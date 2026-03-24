import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

interface ThemeContextType {
    theme: Theme;
    fontSize: FontSize;
    setTheme: (theme: Theme) => void;
    setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const FONT_SIZES = {
    'small': '14px',
    'medium': '16px',
    'large': '18px',
    'extra-large': '20px'
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('questia_theme');
        return (saved as Theme) || 'dark';
    });

    const [fontSize, setFontSize] = useState<FontSize>(() => {
        const saved = localStorage.getItem('questia_font_size');
        return (saved as FontSize) || 'medium';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem('questia_theme', theme);
    }, [theme]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.style.setProperty('--font-size-base', FONT_SIZES[fontSize]);
        localStorage.setItem('questia_font_size', fontSize);
    }, [fontSize]);

    return (
        <ThemeContext.Provider value={{ theme, fontSize, setTheme, setFontSize }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
