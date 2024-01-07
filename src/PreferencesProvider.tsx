import { createContext, useCallback, useContext, useState } from 'react';
import { type UnitTag } from './types/core/units';
import localStorage from './types/utils/localStorage';
import { DEFAULT_VERSION_ID, type VersionId, type Version } from './types/core/Version';
import { VERSIONS } from './types/core/UnitClass';

const PREFERENCES_KEY = 'preferences';

export type FilterTag = Exclude<UnitTag, UnitTag.Land | UnitTag.Naval>;

type Preferences = {
    filterTags: FilterTag[];
    version: Version;
}

type PreferencesContext = {
    preferences: Preferences;
    setPreferences: (preferences: Preferences) => void;
}

type StoredPreferences = {
    filterTags?: FilterTag[];
    versionId?: string;
};

function fromStored(): Preferences {
    const stored = localStorage.get<StoredPreferences>(PREFERENCES_KEY) ?? {};

    const versionId = (
        (stored.versionId && stored.versionId in VERSIONS)
            ? stored.versionId
            : DEFAULT_VERSION_ID
    ) as VersionId;

    return {
        filterTags: stored.filterTags ?? [],
        version: VERSIONS[versionId],
    };
}

const defaultPreferences = fromStored();

function toStored(preferences: Preferences): StoredPreferences {
    return {
        filterTags: preferences.filterTags,
        versionId: preferences.version.id,
    };
}

export const PreferencesContext = createContext<PreferencesContext | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
    const [ preferences, setPreferencesRaw ] = useState(defaultPreferences);

    const setPreferences = useCallback((preferences: Preferences) => {
        localStorage.set(PREFERENCES_KEY, toStored(preferences));
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