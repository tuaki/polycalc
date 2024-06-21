import clsx from 'clsx';
import { DefenderFormModal } from '@/components/units/DefenderForm';
import { Button, Card, CardBody, Divider, ScrollShadow } from '@nextui-org/react';
import { type UseBrawlDispatch, type UseBrawlState, useBrawl } from './useBrawl';
import { AttackerFormModal } from '@/components/units/AttackerForm';
import { ArrowButton } from '@/components/forms';
import { FaPlus, FaSkull } from 'react-icons/fa6';
import { Fragment } from 'react';
import { GiCurledTentacle, GiFlame, GiHighShot } from 'react-icons/gi';
import { LuShield, LuSword, LuSwords, LuTarget } from 'react-icons/lu';
import { MdNotInterested } from 'react-icons/md';
import { UnitIcon } from '@/components/units/UnitIcon';

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
            {state.attackers.map((attacker, attackerIndex) => {
                const fightConditions = attacker.fights[index];
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

                const health = fightResult.defender.health;

                const showSecondRow = fightConditions.isIndirect !== undefined
                    || fightConditions.isRanged !== undefined
                    || fightConditions.isTentacles !== undefined;
                const isLessThanThree = fightConditions.isIndirect === undefined
                    || fightConditions.isRanged === undefined
                    || fightConditions.isTentacles === undefined;
                const marginClass = isLessThanThree ? 'mx-2' : 'mx-1';

                return (
                    <div key={attackerIndex} className='grid-item flex flex-col justify-center gap-1'>
                        <div className='flex items-center justify-center'>
                            <IsBasicToggle
                                value={fightConditions.isBasic}
                                attackerIndex={attackerIndex}
                                defenderIndex={index}
                                dispatch={dispatch}
                                className='mx-2'
                            />
                            <div className={clsx('leading-5 w-9 text-center', health <= 0 && 'text-danger')}>
                                {health}
                            </div>
                        </div>
                        {showSecondRow && (<>
                            <Divider className='w-20 self-center' />
                            <div className='flex items-center justify-center'>
                                {fightConditions.isIndirect !== undefined && (
                                    <IsIndirectToggle
                                        value={fightConditions.isIndirect}
                                        attackerIndex={attackerIndex}
                                        defenderIndex={index}
                                        dispatch={dispatch}
                                        className={marginClass}
                                        disabled={!fightConditions.isBasic}
                                    />
                                )}
                                {fightConditions.isRanged !== undefined && !fightConditions.isIndirect && (
                                    // Indirect attack is always 'ranged', meaning no retaliation is taken, so we hide the icon.
                                    <IsRangedToggle
                                        value={fightConditions.isRanged}
                                        attackerIndex={attackerIndex}
                                        defenderIndex={index}
                                        dispatch={dispatch}
                                        className={marginClass}
                                        disabled={!fightConditions.isBasic}
                                    />
                                )}
                                {fightConditions.isTentacles !== undefined && (
                                    <IsTentaclesToggle
                                        value={fightConditions.isTentacles}
                                        attackerIndex={attackerIndex}
                                        defenderIndex={index}
                                        dispatch={dispatch}
                                        className={marginClass}
                                    />
                                )}
                            </div>
                        </>)}
                    </div>
                );
            })}
            <div className='grid-item flex items-center md:ps-2'>
                <UnitIcon unit={finalDefender} />
            </div>
        </Fragment>
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

type IsBasicToggleProps = Readonly<{
    value: boolean;
    attackerIndex: number;
    defenderIndex: number;
    dispatch: UseBrawlDispatch;
    className?: string;
}>;

function IsBasicToggle({ value, attackerIndex, defenderIndex, dispatch, className }: IsBasicToggleProps) {
    return (
        <button
            onClick={() => dispatch({ type: 'fightConditions', attackerIndex, defenderIndex, operation: 'isBasic' })}
            className={className}
            aria-label={value ? 'Fight' : 'Skip'}
        >
            {value ? (
                <LuSwords size={20} className='text-success' />
            ) : (
                <MdNotInterested size={20} className='text-gray-400' />
            )}
        </button>
    );
}

type IsIndirectToggleProps = Readonly<{
    value: boolean;
    attackerIndex: number;
    defenderIndex: number;
    dispatch: UseBrawlDispatch;
    className?: string;
    disabled?: boolean;
}>;

function IsIndirectToggle({ value, attackerIndex, defenderIndex, dispatch, className, disabled }: IsIndirectToggleProps) {
    const colorClass = disabled
        ? 'text-gray-400'
        : (value ? 'text-warning' : 'text-red-800');
    const icon = value ? GiFlame : LuTarget;

    return (
        <button
            onClick={() => dispatch({ type: 'fightConditions', attackerIndex, defenderIndex, operation: 'isIndirect' })}
            className={clsx(className, colorClass)}
            aria-label={value ? 'Splash damage' : 'Direct damage'}
            disabled={disabled}
        >
            {icon({ size: 20 })}
        </button>
    );
}

type IsRangedToggleProps = Readonly<{
    value: boolean;
    attackerIndex: number;
    defenderIndex: number;
    dispatch: UseBrawlDispatch;
    className?: string;
    disabled?: boolean;
}>;

function IsRangedToggle({ value, attackerIndex, defenderIndex, dispatch, className, disabled }: IsRangedToggleProps) {
    const colorClass = disabled
        ? 'text-gray-400'
        : (value ? 'text-yellow-900' : '');
    const icon = value ? GiHighShot : LuSword;

    return (
        <button
            onClick={() => dispatch({ type: 'fightConditions', attackerIndex, defenderIndex, operation: 'isRanged' })}
            className={clsx(className, colorClass)}
            aria-label={value ? 'Ranged combat' : 'Close combat'}
            disabled={disabled}
        >
            {icon({ size: 20, className: value ? '' : '-scale-x-100' })}
        </button>
    );
}

type IsTentaclesToggleProps = Readonly<{
    value: boolean;
    attackerIndex: number;
    defenderIndex: number;
    dispatch: UseBrawlDispatch;
    className?: string;
}>;

function IsTentaclesToggle({ value, attackerIndex, defenderIndex, dispatch, className }: IsTentaclesToggleProps) {
    return (
        <button
            onClick={() => dispatch({ type: 'fightConditions', attackerIndex, defenderIndex, operation: 'isTentacles' })}
            className={className}
            aria-label={value ? 'Tentacles enabled' : 'Tentacles disabled'}
        >
            {value ? (
                <GiCurledTentacle size={20} className='text-purple-600' />
            ) : (
                <LuShield size={20} />
            )}
        </button>
    );
}
