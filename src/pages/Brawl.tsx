import clsx from 'clsx';
import { DefenderFormModal } from '@/components/units/DefenderForm';
import { Button, Card, CardBody } from '@nextui-org/react';
import { type UseBrawlDispatch, type UseBrawlState, useBrawl, type FightMode } from './useBrawl';
import { AttackerFormModal } from '@/components/units/AttackerForm';
import { ArrowButton } from '@/components/forms';
import { FaPlus } from 'react-icons/fa6';
import { Fragment } from 'react';
import { GiFlame } from 'react-icons/gi';
import { LuSwords } from 'react-icons/lu';
import { MdNotInterested } from 'react-icons/md';

export function Brawl() {
    const { state, dispatch } = useBrawl();

    return (
        <div className='flex flex-col gap-3'>
            <Card>
                <CardBody className='py-3'>
                    <h1>Brawl</h1>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <div
                        className='grid gap-1 pc-brawl-grid w-fit'
                        style={{
                            gridTemplateColumns: `48px repeat(${state.attackers.length}, 104px)`,
                            gridTemplateRows: `repeat(${state.defenders.length + 1}, 48px)`,
                        }}
                    >
                        {attackersRow(state, dispatch)}
                        {state.defenders.map((_, index) => defenderRow(state, dispatch, index))}
                    </div>
                    <div className='flex gap-2 mt-8 justify-end'>
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
    return (<>
        <div className='grid-item' />
        {state.attackers.map((attacker, index) => (
            <div key={index} className='flex items-center justify-center gap-1 grid-item'>
                <ArrowButton
                    variant='left'
                    className={clsx(index === 0 && 'opacity-0')}
                    onClick={() => dispatch({ type: 'moveUnit', index, value: 'left' })}
                />
                <AttackerFormModal
                    unit={attacker.unit}
                    onChange={unit => dispatch({ type: 'editUnit', isAttacker: true, index, unit })}
                    onDelete={() => dispatch({ type: 'deleteUnit', isAttacker: true, index })}
                />
                <ArrowButton
                    variant='right'
                    className={clsx(index === state.attackers.length - 1 && 'opacity-0')}
                    onClick={() => dispatch({ type: 'moveUnit', index, value: 'right' })}
                />
            </div>
        ))}
    </>);
}

function defenderRow(state: UseBrawlState, dispatch: UseBrawlDispatch, index: number) {
    const defender = state.defenders[index];
    
    return (
        <Fragment key={index}>
            <div className='grid-item'>
                <DefenderFormModal
                    unit={defender}
                    onChange={unit => dispatch({ type: 'editUnit', isAttacker: false, index, unit })}
                    onDelete={() => dispatch({ type: 'deleteUnit', isAttacker: false, index })}
                />
            </div>
            {state.attackers.map((attacker, attackerIndex) => {
                const fightMode = attacker.fights[index];
                const health = state.results?.[attackerIndex][index]?.health;

                return (
                    <div key={attackerIndex} className='flex-1 flex items-center justify-center grid-item'>
                        <FightModeButton
                            value={fightMode}
                            attackerIndex={attackerIndex}
                            defenderIndex={index}
                            dispatch={dispatch}
                            className={health === undefined ? 'opacity-40' : ''}
                        />
                        <span className={clsx('w-6 text-end', (health ?? 1) <= 0 && 'text-danger')}>
                            {health}
                        </span>
                    </div>
                );
            })}
        </Fragment>
    );
}

type FightModeButtonProps = Readonly<{
    value: FightMode;
    attackerIndex: number;
    defenderIndex: number;
    dispatch: UseBrawlDispatch;
    className?: string;
}>;

function FightModeButton({ value, attackerIndex, defenderIndex, dispatch, className }: FightModeButtonProps) {
    return (
        <button
            onClick={() => dispatch({ type: 'fightMode', attackerIndex, defenderIndex })}
            className={className}
            aria-label={'Current fight mode: ' + value}
        >
            {value === 'none' && <MdNotInterested size={20} className='text-gray-400' />}
            {value === 'direct' && <LuSwords size={20} className='text-success' />}
            {value === 'indirect' && <GiFlame size={20} className='text-warning' />}
        </button>
    );
}