import { Tab, Tabs } from '@nextui-org/react';
import usePreferences from '@/components/preferences/PreferencesProvider';
import { type Key, type ReactNode } from 'react';
import { Duel } from './Duel';
import { Brawl } from './Brawl';
import { Tests } from './Tests';

export const MODE_IDS = [ 'duel', 'brawl', 'tests' ] as const;
export type ModeId = typeof MODE_IDS[number];

const modes: { [id in ModeId]: { label: string, component: ReactNode } } = {
    duel: { label: 'Duel', component: <Duel /> },
    brawl: { label: 'Brawl', component: <Brawl /> },
    tests: { label: 'Tests', component: <Tests /> },
};

export function ModeSelect() {
    const { preferences, setPreferences } = usePreferences();

    function onChange(key: Key) {
        if (typeof key === 'string' && (MODE_IDS as readonly string[]).includes(key))
            setPreferences({ ...preferences, modeId: key as ModeId });
    }

    return (
        <Tabs aria-label='Application mode' selectedKey={preferences.modeId} onSelectionChange={onChange} >
            {MODE_IDS.map(modeOption)}
        </Tabs>
    );
}

function modeOption(id: ModeId) {
    return (
        <Tab key={id} title={modes[id].label} />
    );
}

export function ApplicationMode() {
    const { preferences } = usePreferences();

    return modes[preferences.modeId].component;
}
