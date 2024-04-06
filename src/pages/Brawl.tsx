import { DefenderFormModal } from '@/components/units/DefenderForm';
import { Button, Card, CardBody } from '@nextui-org/react';
import { type UseBrawlDispatch, type UseBrawlState, useBrawl, type FightMode } from './useBrawl';
import { AttackerFormModal } from '@/components/units/AttackerForm';
import { ArrowButton } from '@/components/forms';
import { FaPlus } from 'react-icons/fa6';
import clsx from 'clsx';

export function Brawl() {
    const { state, dispatch } = useBrawl();

    return (
        <div className='flex flex-col gap-3'>
            <Card>
                <CardBody>
                    <h1>Brawl</h1>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <div className='flex flex-col gap-3 overflow-auto'>
                        {attackersRow(state, dispatch)}
                        {state.defenders.map((_, index) => defenderRow(state, dispatch, index))}
                    </div>
                    <div className='flex gap-2 mt-8 justify-end'>
                        <Button
                            onClick={() => dispatch({ type: 'flag', field: 'isShortLabels', value: !state.isShortLabels })}
                        >
                            {state.isShortLabels ? 'Long labels' : 'Short labels'}
                        </Button>
                        <Button
                            onClick={() => dispatch({ type: 'creteUnit', isAttacker: false })}
                        >
                            <FaPlus />
                            Add defender
                        </Button>
                        <Button
                            onClick={() => dispatch({ type: 'creteUnit', isAttacker: true })}
                        >
                            <FaPlus />
                            Add attacker
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

function attackersRow(state: UseBrawlState, dispatch: UseBrawlDispatch) {
    return (
        <div className='flex'>
            <div className='flex-1' />
            {state.attackers.map((attacker, index) => (
                <div key={index} className='flex-1 flex items-center justify-center gap-1'>
                    <ArrowButton
                        variant='left'
                        className={clsx(index === 0 && 'opacity-0')}
                        onClick={() => dispatch({ type: 'moveUnit', index, value: 'left' })}
                    />
                    <AttackerFormModal
                        unit={attacker.unit}
                        onChange={unit => dispatch({ type: 'editUnit', isAttacker: true, index, unit })}
                        onDelete={() => dispatch({ type: 'deleteUnit', isAttacker: true, index })}
                        short={state.isShortLabels}
                    />
                    <ArrowButton
                        variant='right'
                        className={clsx(index === state.attackers.length - 1 && 'opacity-0')}
                        onClick={() => dispatch({ type: 'moveUnit', index, value: 'right' })}
                    />
                </div>
            ))}
        </div>
    );
}

function defenderRow(state: UseBrawlState, dispatch: UseBrawlDispatch, index: number) {
    const defender = state.defenders[index];
    
    return (
        <div key={index} className='flex items-center'>
            <div className='flex-1'>
                <DefenderFormModal
                    unit={defender}
                    onChange={unit => dispatch({ type: 'editUnit', isAttacker: false, index, unit })}
                    onDelete={() => dispatch({ type: 'deleteUnit', isAttacker: false, index })}
                    short={state.isShortLabels}
                />
            </div>
            {state.attackers.map((attacker, attackerIndex) => {
                const fightMode = attacker.fights[index];
                
                return (
                    <div key={attackerIndex} className='flex-1 flex gap-2 items-center justify-center'>
                        <FightModeButton
                            value={fightMode}
                            attackerIndex={attackerIndex}
                            defenderIndex={index}
                            dispatch={dispatch}
                        />
                        <span className='w-6'>
                            {state.results?.[attackerIndex][index]?.health}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

type FightModeButtonProps = Readonly<{
    value: FightMode;
    attackerIndex: number;
    defenderIndex: number;
    dispatch: UseBrawlDispatch;
}>;

function FightModeButton({ value, attackerIndex, defenderIndex, dispatch }: FightModeButtonProps) {
    const nextValue = value === 'none'
        ? 'direct'
        : value === 'direct'
            ? 'indirect'
            : 'none';

    const color = value === 'none'
        ? 'default'
        : value === 'direct'
            ? 'success'
            : 'warning';

    return (
        <Button
            onClick={() => dispatch({ type: 'fightMode', attackerIndex, defenderIndex, value: nextValue })}
            size='sm'
            color={color}
            className='ps-0 pe-0'
        >
            {value}
        </Button>
    );
}