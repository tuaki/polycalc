import { createContext, useCallback, useContext, useState } from 'react';
import { type UnitTag } from './types/core/units';
import localStorage from './types/utils/localStorage';

const PREFERENCES_KEY = 'preferences';

export type FilterableTag = Exclude<UnitTag, UnitTag.Land | UnitTag.Naval>;

type Preferences = {
    filterTags: FilterableTag[];
}

type PreferencesContext = {
    preferences: Preferences;
    setPreferences: (preferences: Preferences) => void;
}

const defaultPreferences: Preferences = localStorage.get(PREFERENCES_KEY) ?? {
    filterTags: [],
};

export const PreferencesContext = createContext<PreferencesContext | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
    const [ preferences, setPreferencesRaw ] = useState(defaultPreferences);

    const setPreferences = useCallback((preferences: Preferences) => {
        localStorage.set(PREFERENCES_KEY, preferences);
        setPreferencesRaw(preferences);
    }, []);

    return (
        <PreferencesContext.Provider value={{ preferences, setPreferences }}>
            {children}
        </PreferencesContext.Provider>
    );
}

export default function usePreferences(): PreferencesContext {
    const context = useContext(PreferencesContext);
    if (context === undefined)
        throw new Error('usePreferences must be used within an PreferencesProvider');

    return context;
}