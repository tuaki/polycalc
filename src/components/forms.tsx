import { Radio, RadioGroup, Select, SelectItem } from '@nextui-org/react';
import { type BonusType } from '@/types/core/Unit';
import { type UnitClass } from '@/types/core/UnitClass';
import usePreferences from '@/PreferencesProvider';
import { useEffect, useMemo } from 'react';
import { type UnitTag } from '@/types/core/units';

type BonusProps = {
    value: BonusType;
    onChange: (value: BonusType) => void;
}

export function BonusSelect({ value, onChange }: BonusProps) {
    return (
        <RadioGroup
            label='Defense bonus'
            orientation='horizontal'
            size='sm'
            value={value}
            onChange={e => onChange(e.target.value as BonusType)}
        >
            <Radio value='none'>None</Radio>
            <Radio value='defense'>Basic (1.5)</Radio>
            <Radio value='wall'>Wall (4.0)</Radio>
        </RadioGroup>
    );
}

type UnitClassSelectProps = {
    value: UnitClass;
    onChange: (value: UnitClass) => void;
    label: string;
}

export function UnitClassSelect({ value, onChange, label }: UnitClassSelectProps) {
    const { preferences } = usePreferences();
    const options = useMemo(() => filterUnitsByTags(preferences.version.getClasses(), preferences.filterTags), [ preferences.filterTags ]);

    useEffect(() => {
        if (filterUnitsByTags([ value ], preferences.filterTags).length === 0)
            onChange(options[0]);
    }, [ options ]);

    return (
        <Select
            size='sm'
            label={label}
            selectedKeys={[ value.id ]}
            onChange={e => onChange(preferences.version.getClass(e.target.value)!)}
        >
            {options.map(unit => (
                <SelectItem key={unit.id} value={unit.id}>{unit.label}</SelectItem>
            ))}
        </Select>
    );
}

function filterUnitsByTags(units: readonly UnitClass[], tags: UnitTag[]): readonly UnitClass[] {
    return tags.length === 0
        ? units
        : units.filter(unit => tags.some(tag => unit.tags.includes(tag)));
}