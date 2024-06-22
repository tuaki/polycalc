import usePreferences, { type Theme } from '@/components/preferences/PreferencesProvider';
import { Button } from '@nextui-org/react';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { Tooltip } from '../common';

export function ThemeToggle() {
    const { preferences, setPreferences } = usePreferences();
    const { theme } = preferences;
    const nextValue = toggleTheme(theme);
    const label = `Switch to ${nextValue} theme`;

    return (
        <Tooltip content={label}>
            <Button
                isIconOnly
                aria-label={label}
                onClick={() => setPreferences({ ...preferences, theme: nextValue })}
                variant='faded'
            >
                {theme === 'dark' ? (
                    <MdOutlineDarkMode size={22} />
                ) : (
                    <MdOutlineLightMode size={22} />
                )}
            </Button>
        </Tooltip>
    );
}

function toggleTheme(theme: Theme) {
    return theme === 'dark' ? 'light' : 'dark';
}
