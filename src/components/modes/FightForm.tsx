import { type FightResult, type FightConditions } from '@/types/core/combat';
import { Checkbox, Divider } from '@nextui-org/react';
import clsx from 'clsx';
import { GiCurledTentacle, GiFlame, GiHighShot } from 'react-icons/gi';
import { LuShield, LuSword, LuSwords, LuTarget } from 'react-icons/lu';
import { MdNotInterested } from 'react-icons/md';
import { Tooltip } from '../common';

type IconFightFormProps = Readonly<{
    value: FightConditions;
    onChange: (toggle: keyof FightConditions) => void;
    result: FightResult;
    className?: string;
}>;

export function IconFightForm({ value, onChange, result, className }: IconFightFormProps) {
    const { primaryIsBasic, showIndirect, showRanged, showSecondaryTentacles } = computeShow(value);
    const showRangedIcon = showRanged && !value.isIndirect;
    const downRowTotal = +showIndirect + +showRangedIcon + +showSecondaryTentacles;
    const health = result.defender.health;

    return (
        <div className={clsx('flex flex-col justify-center gap-1', className)}>
            <div className='flex items-center justify-center'>
                <div className='h-5 mx-2'>
                    {primaryIsBasic ? (
                        <IsBasicToggle value={value.isBasic!} onChange={onChange} />
                    ) : (
                        <IsTentaclesToggle value={value.isTentacles!} onChange={onChange} variant='up' />
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
                        <IsIndirectToggle value={value.isIndirect!} onChange={onChange} />
                    )}
                    {showRangedIcon && (
                        // Indirect attack is always 'ranged', meaning no retaliation is taken, so we hide the icon.
                        <IsRangedToggle value={value.isRanged!} onChange={onChange} />
                    )}
                    {showSecondaryTentacles && (
                        <IsTentaclesToggle value={value.isTentacles!} onChange={onChange} variant='down' />
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
}>;

function IsBasicToggle({ value, onChange }: BaseToggleProps) {
    const label = value ? 'Take part in this fight' : 'Skip this fight';

    return (
        <Tooltip content={label}>
            <button onClick={() => onChange('isBasic')} aria-label={label}>
                {value ? (
                    <LuSwords size={20} className='text-green-500' />
                ) : (
                    <MdNotInterested size={20} className='text-gray-400' />
                )}
            </button>
        </Tooltip>
    );
}

function IsIndirectToggle({ value, onChange }: BaseToggleProps) {
    const label = value ? 'Splash damage' : 'Direct damage';

    return (
        <Tooltip content={label}>
            <button onClick={() => onChange('isIndirect')} aria-label={label}>
                {value ? (
                    <GiFlame size={20} className='text-yellow-500' />
                ) : (
                    <LuTarget size={20} className='text-red-800' />
                )}
            </button>
        </Tooltip>
    );
}

function IsRangedToggle({ value, onChange }: BaseToggleProps) {
    const label = value ? 'Ranged combat' : 'Close combat';

    return (
        <Tooltip content={label}>
            <button onClick={() => onChange('isRanged')} aria-label={label}>
                {value ? (
                    <GiHighShot size={20} className='text-yellow-900' />
                ) : (
                    <LuSword size={20} className='-scale-x-100' />
                )}
            </button>
        </Tooltip>
    );
}

type IsTentaclesToggleProps = BaseToggleProps & Readonly<{
    variant: 'up' | 'down';
}>;

function IsTentaclesToggle({ value, onChange, variant }: IsTentaclesToggleProps) {
    const label = value ? 'Use tentacles' : 'Skip tentacles';

    return (
        <Tooltip content={label}>
            <button onClick={() => onChange('isTentacles')} aria-label={label}>
                {value ? (
                    <GiCurledTentacle size={20} className='text-purple-600' />
                ) : (<>
                    {variant === 'up' ? (
                        <MdNotInterested size={20} className='text-gray-400' />
                    ) : (
                        <LuShield size={20} />
                    )}
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
