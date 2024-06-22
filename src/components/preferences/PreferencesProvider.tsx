import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { type UnitTag } from '@/types/core/units';
import { localStorage } from '@/types/utils/localStorage';
import { DEFAULT_VERSION_ID, type VersionId, type Version, UnitsCache } from '@/types/core/Version';
import { VERSIONS } from '@/types/core/UnitClass';
import { MODE_IDS, type ModeId } from '../modes/Modes';

const PREFERENCES_KEY = 'preferences';

export type Theme = 'dark' | 'light';
export type FilterTag = Exclude<UnitTag, UnitTag.Land | UnitTag.Naval>;

type Preferences = {
    theme: Theme;
    isCollapsed: boolean;
    filterTags: FilterTag[];
    version: Version;
    modeId: ModeId;
    isIconsHidden: boolean;
};

type PreferencesContext = {
    units: UnitsCache;
    preferences: Preferences;
    setPreferences: (preferences: Preferences) => void;
};

type StoredPreferences = {
    theme: Theme;
    isCollapsed: boolean;
    filterTags: FilterTag[];
    versionId: string;
    modeId: string;
    isIconsHidden: boolean;
};

function fromStored(): Preferences {
    const stored = localStorage.get<Partial<StoredPreferences>>(PREFERENCES_KEY) ?? {};

    const versionId = (
        (stored.versionId && stored.versionId in VERSIONS)
            ? stored.versionId
            : DEFAULT_VERSION_ID
    ) as VersionId;

    const modeId = (
        (stored.modeId && MODE_IDS.includes(stored.modeId as ModeId))
            ? stored.modeId
            : MODE_IDS[0]
    ) as ModeId;

    return {
        theme: stored.theme ?? 'dark',
        isCollapsed: stored.isCollapsed ?? false,
        filterTags: stored.filterTags ?? [],
        version: VERSIONS[versionId],
        modeId,
        isIconsHidden: stored.isIconsHidden ?? false,
    };
}

const defaultPreferences = fromStored();

function toStored(preferences: Preferences): StoredPreferences {
    return {
        theme: preferences.theme,
        isCollapsed: preferences.isCollapsed,
        filterTags: preferences.filterTags,
        versionId: preferences.version.id,
        modeId: preferences.modeId,
        isIconsHidden: preferences.isIconsHidden,
    };
}

export const PreferencesContext = createContext<PreferencesContext | undefined>(undefined);

export function PreferencesProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [ preferences, setPreferences ] = useState(defaultPreferences);

    const setPreferencesWithStorage = useCallback((preferences: Preferences) => {
        localStorage.set(PREFERENCES_KEY, toStored(preferences));
        setPreferences(preferences);
    }, []);

    const units = useMemo(() => new UnitsCache(preferences.version, preferences.filterTags), [ preferences.version, preferences.filterTags ]);

    return (
        <PreferencesContext.Provider value={{ units, preferences, setPreferences: setPreferencesWithStorage }}>
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