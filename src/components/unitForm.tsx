import { Input, Select, SelectItem } from '@nextui-org/react';
import { type DefenderSettings, type AttackerSettings } from '../types/core/Unit';
import { UNITS, type UnitClass } from '../types/core/UnitClass';

type AttackerFormProps = {
    input: AttackerSettings;
    onChange: (input: AttackerSettings) => void;
}

export function AttackerForm({ input, onChange }: AttackerFormProps) {

    function selectUnit(classId: string) {
        const unitClass = findUnit(classId);
        const health = unitClass.health ?? unitClass.variants?.[0].health ?? 0;

        onChange({ ...input, unitClass, health });
    }

    return (
        
        <div>
            <Select
                size='sm'
                label='Attacking unit'
                value={input.unitClass.id}
                onChange={e => selectUnit(e.target.value)}
            >
                {UNITS.map(unit => (
                    <SelectItem key={unit.id} value={unit.id}>{unit.label}</SelectItem>
                ))}
            </Select>
            <Input
                className='mt-3'
                size='sm'
                type='number'
                label='Health'
                value={'' + input.health}
                onChange={e => onChange({ ...input, health: parseInt(e.target.value) })}
            />
        </div>
    );
}

type DefenderFormProps = {
    input: DefenderSettings;
    onChange: (input: DefenderSettings) => void;
}

export function DefenderForm({ input, onChange }: DefenderFormProps) {

    function selectUnit(classId: string) {
        const unitClass = findUnit(classId);
        const health = unitClass.health ?? unitClass.variants?.[0].health ?? 0;

        onChange({ ...input, unitClass, health });
    }

    return (
        <div>
            <Select
                size='sm'
                label='Defending unit'
                value={input.unitClass.id}
                onChange={e => selectUnit(e.target.value)}
            >
                {UNITS.map(unit => (
                    <SelectItem key={unit.id} value={unit.id}>{unit.label}</SelectItem>
                ))}
            </Select>
            <Input
                className='mt-3'
                size='sm'
                type='number'
                label='Health'
                value={'' + input.health}
                onChange={e => onChange({ ...input, health: parseInt(e.target.value) })}
            />
        </div>
    );
}

function findUnit(id: string): UnitClass {
    return UNITS.find(unit => unit.id === id)!;
}