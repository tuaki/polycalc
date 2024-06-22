import clsx from 'clsx';
import { DefenderFormModal } from '@/components/units/DefenderForm';
import { Button, Card, CardBody, ScrollShadow } from '@nextui-org/react';
import { type UseBrawlDispatch, type UseBrawlState, useBrawl } from './useBrawl';
import { AttackerFormModal } from '@/components/units/AttackerForm';
import { ArrowButton } from '@/components/forms';
import { FaPlus, FaSkull } from 'react-icons/fa6';
import { Fragment, useCallback } from 'react';
import { UnitIcon } from '@/components/units/UnitIcon';
import { type FightConditions } from '@/types/core/combat';
import { IconFightForm } from './FightForm';

export function Brawl() {
    const { state, dispatch } = useBrawl();

    return (
        <div className='flex flex-col gap-3'>
            <Card>
                <CardBody>
                    <ScrollShadow orientation='horizontal' className='pb-3'>
                        <div
                            className='grid gap-1 pc-brawl-grid w-fit'
                            style={{
                                gridTemplateColumns: `auto repeat(${state.attackers.length}, 104px) auto`,
                                gridTemplateRows: `auto repeat(${state.defenders.length}, 72px) auto`,
                            }}
                        >
                            {attackersRow(state, dispatch)}
                            {state.defenders.map((_, index) => defenderRow(state, dispatch, index))}
                            {finalAttackersRow(state)}
                        </div>
                    </ScrollShadow>
                    <div className='flex gap-3 mt-3 justify-end'>
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
            <div key={index} className='flex items-center justify-center gap-1 grid-item md:pb-2'>
                <ArrowButton
                    variant='left'
                    className={clsx(index === 0 && 'invisible')}
                    onClick={() => dispatch({ type: 'moveUnit', index, value: 'left' })}
                />
                <AttackerFormModal
                    unit={attacker.unit}
                    onChange={unit => dispatch({ type: 'editUnit', isAttacker: true, index, unit })}
                    onDelete={() => dispatch({ type: 'deleteUnit', isAttacker: true, index })}
                />
                <ArrowButton
                    variant='right'
                    className={clsx(index === state.attackers.length - 1 && 'invisible')}
                    onClick={() => dispatch({ type: 'moveUnit', index, value: 'right' })}
                />
            </div>
        ))}
        <div className='grid-item' />
    </>);
}

function defenderRow(state: UseBrawlState, dispatch: UseBrawlDispatch, index: number) {
    const defender = state.defenders[index];
    const finalDefender = state.results.defenders[index];
    
    return (
        <Fragment key={index}>
            <div className='grid-item flex items-center md:pe-2'>
                <DefenderFormModal
                    unit={defender}
                    onChange={unit => dispatch({ type: 'editUnit', isAttacker: false, index, unit })}
                    onDelete={() => dispatch({ type: 'deleteUnit', isAttacker: false, index })}
                />
            </div>
            {state.attackers.map((_, attackerIndex) => {
                const fightResult = state.results.middleFights[attackerIndex][index];
                
                if (fightResult.wasDead) {
                    return (
                        <div key={attackerIndex} className='grid-item flex gap-3 items-center justify-center'>
                            {(fightResult.wasDead === 'defender' || fightResult.wasDead === 'both') && (
                                <FaSkull size={24} className='text-xs text-gray-300' />
                            )}
                            {(fightResult.wasDead === 'attacker' || fightResult.wasDead === 'both') && (
                                <FaSkull size={24} className='text-xs text-blue-300' />
                            )}
                        </div>
                    );
                }
                
                return (
                    <BrawlFightForm key={attackerIndex} state={state} dispatch={dispatch} attackerIndex={attackerIndex} defenderIndex={index} />
                );
            })}
            <div className='grid-item flex items-center md:ps-2'>
                <UnitIcon unit={finalDefender} />
            </div>
        </Fragment>
    );
}

type BrawlFightFormProps = Readonly<{
    state: UseBrawlState;
    dispatch: UseBrawlDispatch;
    attackerIndex: number;
    defenderIndex: number;
}>;

function BrawlFightForm({ state, dispatch, attackerIndex, defenderIndex }: BrawlFightFormProps) {
    const value = state.attackers[attackerIndex].fights[defenderIndex];
    const result = state.results.middleFights[attackerIndex][defenderIndex];
    
    const onChange = useCallback((toggle: keyof FightConditions) => {
        dispatch({ type: 'fightConditions', attackerIndex, defenderIndex, toggle });
    }, [ dispatch, attackerIndex, defenderIndex ]);

    return (
        <IconFightForm value={value} onChange={onChange} result={result} className='grid-item' />
    );
}

function finalAttackersRow(state: UseBrawlState) {
    return (<>
        <div className='grid-item' />
        {state.results.attackers.map((attacker, index) => (
            <div key={index} className='flex justify-center grid-item md:pt-2'>
                <UnitIcon unit={attacker} />
            </div>
        ))}
        <div className='grid-item' />
    </>);
}
