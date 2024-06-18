import { Tab, Tabs } from '@nextui-org/react';
import usePreferences from '@/PreferencesProvider';
import { type Key, type ReactNode } from 'react';
import { Duel } from './Duel';
import { Brawl } from './Brawl';

export type ModeId = 'duel' | 'brawl';
export const MODE_IDS: readonly ModeId[] = [ 'duel', 'brawl' ];

const modes: { [id in ModeId]: { label: string, component: ReactNode } } = {
    duel: { label: 'Duel', component: <Duel /> },
    brawl: { label: 'Brawl', component: <Brawl /> },
};

export function ModeSelect() {
    const { preferences, setPreferences } = usePreferences();

    function onChange(key: Key) {
        if ((MODE_IDS as unknown[]).includes(key))
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