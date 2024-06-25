import { type FightResult, type FightConditions } from '@/types/core/combat';
import { Checkbox, Divider } from '@nextui-org/react';
import clsx from 'clsx';
import { GiCurledTentacle, GiFlame, GiHighShot } from 'react-icons/gi';
import { LuShield, LuSword, LuSwords, LuTarget } from 'react-icons/lu';
import { MdNotInterested } from 'react-icons/md';
import { Tooltip } from '../common';
import { type ReactNode } from 'react';

type IconFightFormProps = Readonly<{
    value: FightConditions;
    onChange: (toggle: keyof FightConditions) => void;
    result: FightResult;
    className?: string;
    isReadonly?: boolean;
}>;

export function IconFightForm({ value, onChange, result, className, isReadonly }: IconFightFormProps) {
    const { primaryIsBasic, showIndirect, showRanged, showSecondaryTentacles } = computeShow(value);
    const showRangedIcon = showRanged && !value.isIndirect;
    const downRowTotal = +showIndirect + +showRangedIcon + +showSecondaryTentacles;
    const health = result.defender.health;

    return (
        <div className={clsx('flex flex-col justify-center gap-1', className)}>
            <div className='flex items-center justify-center'>
                <div className='h-5 mx-2'>
                    {primaryIsBasic ? (
                        <IsBasicToggle value={value.isBasic!} onChange={onChange} isReadonly={isReadonly} />
                    ) : (
                        <IsTentaclesToggle value={value.isTentacles!} onChange={onChange} isReadonly={isReadonly} variant='up' />
                    )}
                </div>
                <div className={clsx('leading-5 w-9 text-center font-medium', health <= 0 && 'text-danger')}>
                    {health}
                </div>
            </div>
            {downRowTotal > 0 && (<>
                <Divider className='w-20 self-center' />
                <div className={clsx('flex items-center justify-center', downRowTotal === 3 ? 'gap-2' : 'gap-4')}>
                    {showIndirect && (
                        <IsIndirectToggle value={value.isIndirect!} onChange={onChange} isReadonly={isReadonly} />
                    )}
                    {showRangedIcon && (
                        // Indirect attack is always 'ranged', meaning no retaliation is taken, so we hide the icon.
                        <IsRangedToggle value={value.isRanged!} onChange={onChange} isReadonly={isReadonly} />
                    )}
                    {showSecondaryTentacles && (
                        <IsTentaclesToggle value={value.isTentacles!} onChange={onChange} isReadonly={isReadonly} variant='down' />
                    )}
                </div>
            </>)}
        </div>
    );
}

function computeShow({ isBasic, isIndirect, isRanged, isTentacles }: FightConditions) {
    const showBasic = isBasic !== undefined;
    const showTentaclesPrimary = isTentacles !== undefined && !showBasic;
    
    return {
        primaryIsBasic: !showTentaclesPrimary,
        showIndirect: !!isBasic && isIndirect !== undefined,
        showRanged: !!isBasic && isRanged !== undefined,
        showSecondaryTentacles: isTentacles !== undefined && showBasic,
    };
}

type BaseToggleProps = Readonly<{
    value: boolean;
    onChange: (toggle: keyof FightConditions) => void;
    isReadonly?: boolean;
}>;

export const TOGGLE_ICONS = {
    isBasic: { true: <LuSwords size={20} className='text-green-500' />, false: <MdNotInterested size={20} className='text-gray-400' /> },
    isIndirect: { true: <GiFlame size={20} className='text-yellow-500' />, false: <LuTarget size={20} className='text-red-800' /> },
    isRanged: { true: <GiHighShot size={20} className='text-yellow-900' />, false: <LuSword size={20} className='-scale-x-100' /> },
    isTentacles: { true: <GiCurledTentacle size={20} className='text-purple-600' />, false: <LuShield size={20} /> },
} as const satisfies { [key in keyof FightConditions]: { true: ReactNode, false: ReactNode } };

function IsBasicToggle({ value, onChange, isReadonly }: BaseToggleProps) {
    const label = value ? 'Take part in this fight' : 'Skip this fight';

    return (
        <Tooltip content={label}>
            <button onClick={() => onChange?.('isBasic')} aria-label={label} disabled={isReadonly}>
                {TOGGLE_ICONS.isBasic[value ? 'true' : 'false']}
            </button>
        </Tooltip>
    );
}

function IsIndirectToggle({ value, onChange, isReadonly }: BaseToggleProps) {
    const label = value ? 'Splash damage' : 'Direct damage';

    return (
        <Tooltip content={label}>
            <button onClick={() => onChange?.('isIndirect')} aria-label={label} disabled={isReadonly}>
                {TOGGLE_ICONS.isIndirect[value ? 'true' : 'false']}
            </button>
        </Tooltip>
    );
}

function IsRangedToggle({ value, onChange, isReadonly }: BaseToggleProps) {
    const label = value ? 'Ranged combat' : 'Close combat';

    return (
        <Tooltip content={label}>
            <button onClick={() => onChange?.('isRanged')} aria-label={label} disabled={isReadonly}>
                {TOGGLE_ICONS.isRanged[value ? 'true' : 'false']}
            </button>
        </Tooltip>
    );
}

type IsTentaclesToggleProps = BaseToggleProps & Readonly<{
    variant: 'up' | 'down';
}>;

function IsTentaclesToggle({ value, onChange, isReadonly, variant }: IsTentaclesToggleProps) {
    const label = value ? 'Use tentacles' : 'Skip tentacles';

    return (
        <Tooltip content={label}>
            <button onClick={() => onChange?.('isTentacles')} aria-label={label} disabled={isReadonly}>
                {value ? TOGGLE_ICONS.isTentacles.true : (<>
                    {variant === 'up' ? TOGGLE_ICONS.isBasic.false : TOGGLE_ICONS.isTentacles.false}
                </>)}
            </button>
        </Tooltip>
    );
}

type TextFightFormProps = Readonly<{
    value: FightConditions;
    onChange: (toggle: keyof FightConditions) => void;
    className?: string;
}>;

export function TextFightForm({ value, onChange, className }: TextFightFormProps) {
    const { primaryIsBasic, showIndirect, showRanged, showSecondaryTentacles } = computeShow(value);
    const rangedIsDetermined = !!value.isIndirect;
    const showTentacles = !primaryIsBasic || showSecondaryTentacles;

    const showTotal = +showIndirect + +showRanged + +showTentacles;
    if (showTotal === 0)
        return null;

    return (
        <div className={clsx('flex flex-col gap-1', className)}>
            {showIndirect && (
                <Checkbox
                    size='sm'
                    isSelected={value.isIndirect}
                    onValueChange={() => onChange('isIndirect')}
                >
                    Splash damage
                </Checkbox>
            )}
            {showRanged && (
                <Checkbox
                    size='sm'
                    isSelected={rangedIsDetermined || value.isRanged}
                    onValueChange={() => onChange('isRanged')}
                    isDisabled={rangedIsDetermined}
                >
                    Ranged combat
                </Checkbox>
            )}
            {showTentacles && (
                <Checkbox
                    size='sm'
                    isSelected={value.isTentacles}
                    onValueChange={() => onChange('isTentacles')}
                >
                    Use tentacles
                </Checkbox>
            )}
        </div>
    );
}
