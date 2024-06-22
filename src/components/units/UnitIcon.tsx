import usePreferences from '@/components/preferences/PreferencesProvider';
import { CONDITIONS, ConditionType } from '@/types/core/Condition';
import { type Unit } from '@/types/core/Unit';
import { type UnitClass } from '@/types/core/UnitClass';
import { capitalize } from '@/types/utils/common';
import { Tooltip } from '@/components/common';
import clsx from 'clsx';

type UnitIconButtonProps = UnitIconProps & Readonly<{
    onClick: () => void;
}>;

export function UnitIconButton({ unit, size, onClick }: UnitIconButtonProps) {
    return (
        <button onClick={onClick} aria-label={unit.toString()}>
            <UnitIcon unit={unit} size={size} />
        </button>
    );
}

type UnitIconProps = Readonly<{
    unit: Unit;
    size?: number;
}>;

export function UnitIcon({ unit, size }: UnitIconProps) {
    const innerSize = size ?? DEFAULT_ICON_SIZE;
    const conditions = unit.activeConditions.splice(0, 4);

    return (
        <div style={{ width: innerSize, height: innerSize }} className='overflow-hidden grid grid-cols-4 grid-rows-4 text-center text-xs leading-3 font-medium unselectable'>
            <div className='col-span-3 row-span-3'>
                <UnitClassIcon unitClass={unit.unitClass} size={iconSizeToClassIconSize(innerSize)} />
            </div>
            <div className={clsx('col-span-3 row-start-4', unit.health <= 0 && 'text-danger')}>
                {unit.health}/{unit.maxHealth}
            </div>
            {conditions.map(condition => {
                const { label, color } = conditionLabels[condition];
                const textLabel = CONDITIONS[condition].label;

                return (
                    <Tooltip key={condition} content={textLabel}>
                        <div key={condition} className={clsx(color, 'font-semibold')}>
                            {label}
                        </div>
                    </Tooltip>
                );
            })}
        </div>
    );
}

const DEFAULT_ICON_SIZE = 48;
function iconSizeToClassIconSize(size: number) {
    return size * 3 / 4;
}

const conditionLabels: Record<ConditionType, { label: string, color: string }> = {
    [ConditionType.Veteran]:        { label: 'V', color: 'text-amber-400' },
    [ConditionType.DefenseBonus]:   { label: 'D', color: 'text-zinc-400' },
    [ConditionType.WallBonus]:      { label: 'W', color: 'text-zinc-400' },
    [ConditionType.Freezed]:        { label: 'F', color: 'text-sky-400' },
    [ConditionType.Poisoned]:       { label: 'P', color: 'text-lime-500' },
    [ConditionType.Boosted]:        { label: 'B', color: 'text-red-500' },
    [ConditionType.Converted]:      { label: 'C', color: 'text-purple-500' },
};

type UnitClassIconProps = Readonly<{
    unitClass: UnitClass;
    size?: number;
}>;

export function UnitClassIcon({ unitClass, size: inputSize }: UnitClassIconProps) {
    const { isIconsHidden } = usePreferences().preferences;
    const size = (inputSize ?? iconSizeToClassIconSize(DEFAULT_ICON_SIZE));
    
    if (!isIconsHidden) {
        const path = `./icons/units/${unitClass.id}.png`;
        
        return (
            <img src={path} alt={unitClass.label} style={{ width: size, height: size }} className='non-draggable' />
        );
    }

    const { fontSize, padding, borderWidth } = getSizes(size);
    const innerSize = size - 2 * padding - 2 * borderWidth;
    
    return (
        <div style={{ width: size, height: size, padding }}>
            <div
                className='text-center align-middle font-mono border border-current rounded'
                style={{ lineHeight: `${innerSize}px`, fontSize: `${fontSize}px`, borderWidth: `${borderWidth}px` }}
            >
                {capitalize(unitClass.idShort)}
            </div>
        </div>
    );
}

function getSizes(size: number): { fontSize: number, borderWidth: number, padding: number} {
    if (size <= 24) 
        return { fontSize: size * 2 / 3, padding: 0, borderWidth: 0 };
    
    if (size <= 36) {
        return {
            fontSize: size / 2,
            padding: 2,
            borderWidth: 1,
        };
    }
    
    return {
        fontSize: size / 2,
        padding: 4,
        borderWidth: 2,
    };
}
