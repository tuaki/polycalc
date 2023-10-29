import { Card, CardBody, Listbox, ListboxItem } from '@nextui-org/react';
import usePreferences, { type FilterableTag as FilterTag } from '../PreferencesProvider';
import { UnitTag } from '../types/core/units';

export function Preferences() {
    const { preferences, setPreferences } = usePreferences();

    return (
        <Card>
            <CardBody>
                <h1>Preferences</h1>
                <Listbox
                    aria-label='Tribe selection'
                    variant='flat'
                    selectionMode='multiple'
                    selectedKeys={preferences.filterTags}
                    onSelectionChange={keys => setPreferences({ ...preferences, filterTags: [ ...keys ] as FilterTag[] })}
                >
                    {tagOptions.map(({ value, label }) => (
                        <ListboxItem key={value}>{label}</ListboxItem>
                    ))}
                </Listbox>
            </CardBody>
        </Card>
    );
}

const tagDetails: Record<FilterTag, { label: string }> = {
    [UnitTag.Classic]: { label: 'Classic' },
    [UnitTag.Aquarion]: { label: 'Aquarion' },
    [UnitTag.Elyrion]: { label: 'Elyrion' },
    [UnitTag.Polaris]: { label: 'Polaris' },
    [UnitTag.Cymanti]: { label: 'Cymanti' },
};

const tagOptions = Object.entries(tagDetails).map(([ value, { label } ]) => ({ value, label }));