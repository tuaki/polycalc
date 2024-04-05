import { Checkbox, Input } from '@nextui-org/react';
import { type Unit } from '@/types/core/Unit';
import { LinkSwitch, UnitClassSelect, UnitVariantSelect, UpDownButton } from '../forms';
import { UnitStats } from './UnitStats';
import { useDefender } from './useDefender';
import { useEffect } from 'react';
import clsx from 'clsx';

type DefenderFormProps = Readonly<{
    onChange: (unit: Unit) => void;
}>;

export function DefenderForm({ onChange }: DefenderFormProps) {
    const { state, dispatch, unit } = useDefender();

    // TODO signals probably ...
    useEffect(() => {
        onChange(unit);
    }, [ unit, onChange ]);

    const isVariants = !!state.unitClass.variants;

    return (
        <div className='grid grid-cols-4 gap-3'>
            <div className='col-span-2 flex flex-col gap-3'>
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
            <div className='flex flex-col gap-2'>
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
                    isSelected={state.isPoisoned}
                    onValueChange={value => dispatch({ type: 'flag', field: 'isPoisoned', value })}
                >
                    Poisoned
                </Checkbox>
                <Checkbox
                    size='sm'
                    isSelected={state.bonus === 'defense'}
                    onValueChange={value => dispatch({ type: 'flag', field: 'isDefenseBonus', value })}
                >
                    Defense bonus (1.5)
                </Checkbox>
                {!unit.unitClass.isNavalOnly && (
                    <Checkbox
                        size='sm'
                        isSelected={state.bonus === 'wall'}
                        onValueChange={value => dispatch({ type: 'flag', field: 'isWallBonus', value })}
                    >
                        Wall bonus (4.0)
                    </Checkbox>
                )}
            </div>
            <div>
                <UnitStats unit={unit} />
            </div>
        </div>
    );
}

