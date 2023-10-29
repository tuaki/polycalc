import { Checkbox, Input } from '@nextui-org/react';
import { type DefenderSettings, type AttackerSettings } from '../types/core/Unit';
import { type UnitClass } from '../types/core/UnitClass';
import { BonusSelect, UnitClassSelect } from './forms';

type AttackerFormProps = {
    input: AttackerSettings;
    onChange: (input: AttackerSettings) => void;
}

export function AttackerForm({ input, onChange }: AttackerFormProps) {

    function selectUnit(unitClass: UnitClass) {
        const health = unitClass.health ?? unitClass.variants?.[0].health ?? 0;
        onChange({ ...input, unitClass, health });
    }

    return (
        <div className='grid grid-cols-2 gap-3'>
            <UnitClassSelect
                label='Attacking unit'
                value={input.unitClass}
                onChange={selectUnit}
            />
            <div />
            <Input
                size='sm'
                type='number'
                label='Health'
                value={'' + input.health}
                onChange={e => onChange({ ...input, health: parseInt(e.target.value) })}
            />
            <Checkbox
                size='sm'
                isSelected={input.isBoosted}
                onValueChange={value => onChange({ ...input, isBoosted: value })}
            >
                Boosted
            </Checkbox>
        </div>
    );
}

type DefenderFormProps = {
    input: DefenderSettings;
    onChange: (input: DefenderSettings) => void;
}

export function DefenderForm({ input, onChange }: DefenderFormProps) {

    function selectUnit(unitClass: UnitClass) {
        const health = unitClass.health ?? unitClass.variants?.[0].health ?? 0;
        onChange({ ...input, unitClass, health });
    }

    return (
        <div className='grid grid-cols-2 gap-3'>
            <UnitClassSelect
                label='Defending unit'
                value={input.unitClass}
                onChange={selectUnit}
            />
            <div />
            <Input
                size='sm'
                type='number'
                label='Health'
                value={'' + input.health}
                onChange={e => onChange({ ...input, health: parseInt(e.target.value) })}
            />
            <BonusSelect
                value={input.bonus}
                onChange={bonus => onChange({ ...input, bonus })}
            />
        </div>
    );
}

