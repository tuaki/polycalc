import { ConditionType } from '@/types/core/Condition';
import { type Unit } from '@/types/core/Unit';
import { type UnitClass } from '@/types/core/UnitClass';
import clsx from 'clsx';

type UnitIconButtonProps = UnitIconProps & Readonly<{
    onClick: () => void;
}>;

export function UnitIconButton({ unit, size, onClick }: UnitIconButtonProps) {
    return (
        <button className='' onClick={onClick} aria-label={unit.toString()}>
            <UnitIcon unit={unit} size={size} />
        </button>
    );
}

type UnitIconProps = Readonly<{
    unit: Unit;
    size?: number;
}>;

export function UnitIcon({ unit, size }: UnitIconProps) {
    const innerSize = size ?? 48;
    const conditions = unit.activeConditions.splice(0, 4);

    return (
        <div style={{ width: innerSize, height: innerSize }} className='grid grid-cols-4 grid-rows-4 text-center text-xs leading-3 font-medium'>
            <div className='col-span-3 row-span-3'>
                <UnitClassIcon unitClass={unit.unitClass} />
            </div>
            <div className={clsx('col-span-3 row-start-4', unit.health <= 0 && 'text-danger')}>
                {unit.health}/{unit.maxHealth}
            </div>
            {conditions.map(condition => {
                const { label, color } = conditionLabels[condition];
                return (
                    <div key={condition} className={color}>
                        {label}
                    </div>
                );
            })}
        </div>
    );
}


const conditionLabels: Record<ConditionType, { label: string, color: string }> = {
    [ConditionType.Veteran]:        { label: 'V', color: 'text-amber-400' },
    [ConditionType.DefenseBonus]:   { label: 'D', color: 'text-zinc-400' },
    [ConditionType.WallBonus]:      { label: 'W', color: 'text-zinc-400' },
    [ConditionType.Freezed]:        { label: 'F', color: 'text-sky-400' },
    [ConditionType.Poisoned]:       { label: 'P', color: 'text-lime-500' },
    [ConditionType.Boosted]:        { label: 'B', color: 'text-red-500' },
    [ConditionType.NoRetaliation]:  { label: 'R', color: '' },
    [ConditionType.IndirectAttack]: { label: 'S', color: '' },
    [ConditionType.Converted]:      { label: 'C', color: 'text-purple-500' },
};

type UnitClassIconProps = Readonly<{
    unitClass: UnitClass;
    size?: number | 'auto';
}>;

export function UnitClassIcon({ unitClass, size }: UnitClassIconProps) {
    const path = `./icons/units/${unitClass.id}.png`;
    const width = (size ?? 48);

    return (
        <img src={path} alt={unitClass.label} style={{ width }} />
    );
}