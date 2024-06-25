import clsx from 'clsx';
import { DefenderFormModal } from '@/components/units/DefenderForm';
import { Button, Card, CardBody, ScrollShadow } from '@nextui-org/react';
import { type UseBrawlDispatch, type UseBrawlState, useBrawl, computeReadonlyState } from './useBrawl';
import { AttackerFormModal } from '@/components/units/AttackerForm';
import { ArrowButton } from '@/components/forms';
import { FaPlus, FaSkull } from 'react-icons/fa6';
import { Fragment, useCallback, useMemo } from 'react';
import { UnitIcon } from '@/components/units/UnitIcon';
import { type FightConditions } from '@/types/core/combat';
import { IconFightForm } from './FightForm';
import { Tooltip } from '../common';
import { type ReadonlyBrawlData } from '@/types/core/readonly';
import usePreferences from '../preferences/PreferencesProvider';
import { WikiInfo } from '../wiki/WikiModal';
import { wiki } from '../wiki/wikiPages';

export function Brawl() {
    const { state, dispatch } = useBrawl();

    return (
        <Card className='pc-fit-min-800 mx-auto'>
            <CardBody>
                {brawlInner(state, dispatch, 'pb-3')}
                <div className='flex gap-3 mt-3 justify-end flex-wrap'>
                    <WikiInfo type={wiki.brawl} label='Help' />
                    <div className='flex-grow' />
                    <Button
                        onPress={() => dispatch({ type: 'createUnit', isAttacker: false })}
                    >
                        <FaPlus className='max-sm:hidden' />
                        Add defender
                    </Button>
                    <Button
                        onPress={() => dispatch({ type: 'createUnit', isAttacker: true })}
                    >
                        <FaPlus className='max-sm:hidden' />
                        Add attacker
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}

function brawlInner(state: UseBrawlState, dispatch: UseBrawlDispatch, className?: string) {
    return (
        <ScrollShadow orientation='horizontal' className={className}>
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
    );
}

function attackersRow(state: UseBrawlState, dispatch: UseBrawlDispatch) {
    return (<>
        <div className='grid-item' />
        {state.attackers.map((attacker, index) => (
            <div key={index} className='flex items-center justify-center gap-1 grid-item md:pb-2'>
                {state.isReadonly ? (
                    <UnitIcon unit={attacker.unit} />
                ) : (<>
                    <ArrowButton
                        variant='left'
                        className={clsx(index === 0 && 'invisible')}
                        onPress={() => dispatch({ type: 'moveUnit', index, value: 'left' })}
                    />
                    <AttackerFormModal
                        unit={attacker.unit}
                        onChange={unit => dispatch({ type: 'editUnit', isAttacker: true, index, unit })}
                        onDelete={() => dispatch({ type: 'deleteUnit', isAttacker: true, index })}
                        onCopy={() => dispatch({ type: 'createUnit', isAttacker: true, copyIndex: index })}
                    />
                    <ArrowButton
                        variant='right'
                        className={clsx(index === state.attackers.length - 1 && 'invisible')}
                        onPress={() => dispatch({ type: 'moveUnit', index, value: 'right' })}
                    />
                </>)}
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
                {state.isReadonly ? (
                    <UnitIcon unit={defender} />
                ) : (
                    <DefenderFormModal
                        unit={defender}
                        onChange={unit => dispatch({ type: 'editUnit', isAttacker: false, index, unit })}
                        onDelete={() => dispatch({ type: 'deleteUnit', isAttacker: false, index })}
                        onCopy={() => dispatch({ type: 'createUnit', isAttacker: false, copyIndex: index })}
                    />
                )}
            </div>
            {state.attackers.map((_, attackerIndex) => {
                const fightResult = state.results.middleFights[attackerIndex][index];
                
                if (fightResult.wasDead) {
                    return (
                        <div key={attackerIndex} className='grid-item flex gap-3 items-center justify-center'>
                            {(fightResult.wasDead === 'defender' || fightResult.wasDead === 'both') && (
                                <Tooltip content='Defender was dead'>
                                    <div>
                                        <FaSkull size={24} className='text-xs text-gray-300' />
                                    </div>
                                </Tooltip>
                            )}
                            {(fightResult.wasDead === 'attacker' || fightResult.wasDead === 'both') && (
                                <Tooltip content='Attacker was dead'>
                                    <div>
                                        <FaSkull size={24} className='text-xs text-blue-300' />
                                    </div>
                                </Tooltip>
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
        <IconFightForm value={value} onChange={onChange} result={result} className='grid-item' isReadonly={state.isReadonly} />
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

type ReadonlyBrawlProps = Readonly<{
    data: ReadonlyBrawlData;
    className?: string;
}>;

export function ReadonlyBrawl({ data, className }: ReadonlyBrawlProps) {
    const version = usePreferences().preferences.version;
    const state = useMemo(() => computeReadonlyState(data), [ data ]);
    const dispatch = useCallback(() => {}, []);

    return (
        <Card className={clsx('w-fit mx-auto', className)}>
            <CardBody>
                {brawlInner(state, dispatch)}
                {version.id !== state.units.version.id && (
                    <div className='text-xs mt-3 opacity-60'>
                        Version: {state.units.version.label}
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
