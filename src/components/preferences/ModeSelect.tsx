import { Select, SelectItem } from '@nextui-org/react';
import usePreferences from '@/PreferencesProvider';

export type ModeId = 'duel' | 'brawl';
export const MODE_IDS: readonly ModeId[] = [ 'duel', 'brawl' ];

const modeLabels: { [id in ModeId]: string } = {
    duel: 'Duel',
    brawl: 'Brawl',
};

export function ModeSelect() {
    const { preferences, setPreferences } = usePreferences();

    function onChange(modeId: string) {
        if (MODE_IDS.includes(modeId as ModeId)) 
            setPreferences({ ...preferences, modeId: modeId as ModeId });
    }

    return (
        <Select
            size='sm'
            label='Mode'
            selectedKeys={[ preferences.modeId ]}
            onChange={e => onChange(e.target.value)}
        >
            {MODE_IDS.map(modeOption)}
        </Select>
    );
}

function modeOption(id: ModeId) {
    return (
        <SelectItem key={id} value={id}>{modeLabels[id]}</SelectItem>
    );
}