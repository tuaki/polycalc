import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { type Unit } from '@/types/core/Unit';
import { LinkSwitch, UnitClassSelect, UnitVariantSelect, ArrowButton } from '../forms';
import { useAttacker } from './useAttacker';
import clsx from 'clsx';
import { UnitStats } from './UnitStats';
import { UnitIconButton } from './UnitIcon';

type AttackerFormProps = Readonly<{
    unit: Unit;
    onChange: (unit: Unit) => void;
}>;

export function AttackerForm({ unit, onChange }: AttackerFormProps) {
    const { state, dispatch } = useAttacker(unit, onChange);

    const isVariants = !!state.unitClass.variants;

    return (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
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
                    />
                    <div className='flex flex-col justify-between h-12'>
                        <ArrowButton variant='up'
                            onClick={() => dispatch({ type: 'health', operation: 'increment' })}
                        />
                        <ArrowButton variant='down'
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
                    isSelected={state.isBoosted}
                    onValueChange={value => dispatch({ type: 'flag', field: 'isBoosted', value })}
                >
                    Boosted
                </Checkbox>
            </div>
            <div>
                <UnitStats unit={unit} />
            </div>
        </div>
    );
}

type AttackerFormModalProps = AttackerFormProps & Readonly<{
    onDelete: () => void;
}>;

export function AttackerFormModal({ unit, onChange, onDelete }: AttackerFormModalProps) {
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
                        Attacker
                    </ModalHeader>
                    <ModalBody>
                        <AttackerForm unit={unit} onChange={onChange} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={innerDelete} color='danger'>
                            Remove
                        </Button>
                        <Button onClick={onClose}>
                            OK
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
