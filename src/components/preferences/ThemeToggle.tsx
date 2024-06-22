import usePreferences, { type Theme } from '@/components/preferences/PreferencesProvider';
import { Button } from '@nextui-org/react';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

export function ThemeToggle() {
    const { preferences, setPreferences } = usePreferences();
    const { theme } = preferences;

    const nextValue = toggleTheme(theme);

    return (
        <Button
            isIconOnly
            aria-label={`Switch to ${nextValue} theme`}
            onClick={() => setPreferences({ ...preferences, theme: nextValue })}
            variant='faded'
        >
            {theme === 'dark' ? (
                <MdOutlineDarkMode size={22} />
            ) : (
                <MdOutlineLightMode size={22} />
            )}
        </Button>
    );
}

function toggleTheme(theme: Theme) {
    return theme === 'dark' ? 'light' : 'dark';
}
