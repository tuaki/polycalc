import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { type Unit } from '@/types/core/Unit';
import { LinkSwitch, UnitClassSelect, UnitVariantSelect, ArrowButton } from '../forms';
import { UnitStats } from './UnitStats';
import { useDefender } from './useDefender';
import clsx from 'clsx';
import { UnitIconButton } from './UnitIcon';

type DefenderFormProps = Readonly<{
    unit: Unit;
    onChange: (unit: Unit) => void;
}>;

export function DefenderForm({ unit, onChange }: DefenderFormProps) {
    const { state, dispatch } = useDefender(unit, onChange);

    const isVariants = !!state.unitClass.variants;

    return (
        <div className='grid grid-cols-2 collapsed-md:grid-cols-4 lg:grid-cols-4 gap-3'>
            <div className='col-span-2 flex flex-col gap-3'>
                <div className={clsx(isVariants && 'grid grid-cols-2 gap-3')}>
                    <UnitClassSelect
                        label='Defending unit'
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
                    />
                    <div className='flex flex-col justify-between h-12'>
                        <ArrowButton variant='up' onPress={() => dispatch({ type: 'health', operation: 'increment' })} />
                        <ArrowButton variant='down' onPress={() => dispatch({ type: 'health', operation: 'decrement' })} />
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

type DefenderFormModalProps = DefenderFormProps & Readonly<{
    onDelete: () => void;
    onCopy: () => void;
}>;

export function DefenderFormModal({ unit, onChange, onDelete, onCopy }: DefenderFormModalProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    function innerDelete() {
        onDelete();
        onClose();
    }

    return (
        <div>
            <UnitIconButton unit={unit} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
                <ModalContent>
                    <ModalHeader>
                        Defender
                    </ModalHeader>
                    <ModalBody>
                        <DefenderForm unit={unit} onChange={onChange} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={innerDelete} color='danger'>
                            Remove
                        </Button>
                        <Button onPress={onCopy} color='primary'>
                            Copy
                        </Button>
                        <Button onPress={onClose}>
                            Ok
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
