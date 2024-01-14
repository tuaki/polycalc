import { Checkbox, Input } from '@nextui-org/react';
import { type Unit } from '@/types/core/Unit';
import { LinkSwitch, UnitClassSelect, UnitVariantSelect, UpDownButton } from '../forms';
import { useAttacker } from './useAttacker';
import { useEffect } from 'react';
import clsx from 'clsx';

type AttackerFormProps = Readonly<{
    onChange: (unit: Unit) => void;
}>;

export default function AttackerForm({ onChange }: AttackerFormProps) {
    const { state, dispatch, unit } = useAttacker();

    // TODO signals probably ...
    useEffect(() => {
        onChange(unit);
    }, [ unit, onChange ]);

    const isVariants = !!state.unitClass.variants;

    return (
        <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-3'>
                <div className={clsx(isVariants && 'grid grid-cols-2 gap-3')}>
                    <UnitClassSelect
                        label='Attacking unit'
                        value={state.unitClass}
                        onChange={value => dispatch({ type: 'unitClass', value })}
                    />
                    <UnitVariantSelect
                        label='Variant'
                        unitClass={state.unitClass}
                        value={state.variant}
                        onChange={value => dispatch({ type: 'variant', value })}
                    />
                </div>
                <div className='flex items-start gap-2'>
                    <LinkSwitch
                        size='sm'
                        isSelected={state.isHealthLinked}
                        onValueChange={value => dispatch({ type: 'flag', field: 'isHealthLinked', value })}
                    />
                    <Input
                        size='sm'
                        type='number'
                        label='Health'
                        value={'' + state.health}
                        onChange={e => dispatch({ type: 'health', value: parseInt(e.target.value) })}
                        disabled={state.isHealthLinked}
                    />
                    <div className='flex flex-col justify-between h-12'>
                        <UpDownButton up disabled={state.isHealthLinked}
                            onClick={() => dispatch({ type: 'health', operation: 'increment' })}
                        />
                        <UpDownButton disabled={state.isHealthLinked}
                            onClick={() => dispatch({ type: 'health', operation: 'decrement' })}
                        />
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                {state.unitClass.skills.promote && (
                    <Checkbox
                        size='sm'
                        isSelected={state.isVeteran}
                        onValueChange={value => dispatch({ type: 'flag', field: 'isVeteran', value })}
                    >
                        Veteran
                    </Checkbox>
                )}
                <Checkbox
                    size='sm'
                    isSelected={state.isBoosted}
                    onValueChange={value => dispatch({ type: 'flag', field: 'isBoosted', value })}
                >
                    Boosted
                </Checkbox>
                {state.unitClass.skills.stomp || state.unitClass.skills.splash && (
                    <Checkbox
                        size='sm'
                        isSelected={state.isIndirect}
                        onValueChange={value => dispatch({ type: 'flag', field: 'isIndirect', value })}
                    >
                        {state.unitClass.skills.stomp ? 'Stomp' : 'Indirect'}
                    </Checkbox>
                )}
                {state.unitClass.range > 1 && (
                    <Checkbox
                        size='sm'
                        isSelected={state.isRanged}
                        onValueChange={value => dispatch({ type: 'flag', field: 'isRanged', value })}
                    >
                        Ranged
                    </Checkbox>
                )}
            </div>
        </div>
    );
}
