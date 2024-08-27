import { useEffect, useReducer } from 'react';
import { type Unit } from '@/types/core/Unit';
import { type FightConditions, fight, createFightConditions, updateFightConditions } from '@/types/core/combat';
import { createDefaultDefender, updateDefenderUnitClass } from '@/components/units/useDefender';
import usePreferences from '@/components/preferences/PreferencesProvider';
import { type UnitsCache } from '@/types/core/Version';
import { createDefaultAttacker, updateAttackerUnitClass } from '@/components/units/useAttacker';
import { type PartialBy } from '@/types/utils/common';
import { type ReadonlyBrawlData, computeUnits } from '@/types/core/readonly';

export function useBrawl() {
    const { units } = usePreferences();
    const [ state, dispatch ] = useReducer(reducer, {}, () => computeInitialState(units));

    useEffect(() => {
        dispatch({ type: 'units', value: units });
    }, [ units ]);

    return { state, dispatch };
}

type Action = CreateUnitAction | EditUnitAction | DeleteUnitAction | MoveUnitAction | FightConditionsAction | VersionAction;

function reducer(state: UseBrawlState, action: Action): UseBrawlState {
    console.log('Reduce:', state, action);
    const newState = innerReducer(state, action);
    console.log('New state:', newState);

    return { ...newState, results: computeResults(newState) };
}

function innerReducer(state: UseBrawlState, action: Action): UseBrawlState {
    switch (action.type) {
    case 'createUnit': return createUnit(state, action);
    case 'editUnit': return editUnit(state, action);
    case 'deleteUnit': return deleteUnit(state, action);
    case 'moveUnit': return moveUnit(state, action);
    case 'fightConditions': return fightConditions(state, action);
    case 'units': return units(state, action.value);
    }
}

export type UseBrawlDispatch = React.Dispatch<Action>;

type Attacker = {
    unit: Unit;
    fights: FightConditions[];
};

type MiddleResult = {
    attacker: Unit;
    defender: Unit;
    wasDead?: 'attacker' | 'defender' | 'both';
};

type BrawlResults = {
    attackers: Unit[];
    defenders: Unit[];
    middleFights: MiddleResult[][];
};

export type UseBrawlState = {
    units: UnitsCache;
    defenders: Unit[];
    attackers: Attacker[];
    results: BrawlResults;
    /** For showing the brawl as an example without any user interaction. */
    isReadonly?: boolean;
};

function computeInitialState(units: UnitsCache): UseBrawlState {
    const defender = createDefaultDefender(units);
    const attacker = createDefaultAttacker(units);

    const state: Omit<UseBrawlState, 'results'> = {
        units,
        defenders: [ defender ],
        attackers: [ { unit: attacker, fights: [ createFightConditions(attacker, defender) ] } ],
    };

    return { ...state, results: computeResults(state) };
}

type CreateUnitAction = {
    type: 'createUnit';
    isAttacker: boolean;
    copyIndex?: number;
};

function createUnit(state: UseBrawlState, { isAttacker, copyIndex }: CreateUnitAction): UseBrawlState {
    if (isAttacker) {
        const attacker = createAttacker(state, copyIndex);
        return { ...state, attackers: [ ...state.attackers, attacker ] };
    }

    const defender = copyIndex !== undefined
        ? state.defenders[copyIndex]
        : createDefaultDefender(state.units);
    const defenders = [ ...state.defenders, defender ];
    const attackers: Attacker[] = state.attackers
        .map(attacker => ({ ...attacker, fights: [ ...attacker.fights, createFightConditions(attacker.unit, defender, undefined, true) ] }));

    return { ...state, defenders, attackers };
}

function createAttacker(state: UseBrawlState, copyIndex?: number): Attacker {
    if (copyIndex !== undefined) {
        const { unit, fights } = state.attackers[copyIndex];
        return {
            unit: unit.copy(),
            fights: fights.map(fight => ({ ...fight })),
        };
    }

    const unit = createDefaultAttacker(state.units);
    const fights: FightConditions[] = state.defenders
        .map((defender, index) => createFightConditions(unit, defender, undefined, index !== 0));

    return { unit, fights };
}

type EditUnitAction = {
    type: 'editUnit';
    isAttacker: boolean;
    index: number;
    unit: Unit;
};

function editUnit(state: UseBrawlState, { isAttacker, index, unit }: EditUnitAction): UseBrawlState {
    if (isAttacker) {
        const attackers = [ ...state.attackers ];
        // Update all fights for this attacker.
        const fights = state.defenders.map((defender, i) => createFightConditions(unit, defender, attackers[index].fights[i]));
        attackers[index] = { unit, fights };

        return { ...state, attackers };
    }

    const defenders = [ ...state.defenders ];
    defenders[index] = unit;

    // Update all fights for this defender, which means updating all attackers.
    const attackers: Attacker[] = state.attackers.map(attacker => {
        const fights = [ ...attacker.fights ];
        fights[index] = createFightConditions(attacker.unit, unit, fights[index]);
        return { ...attacker, fights };
    });

    return { ...state, attackers, defenders };
}

type DeleteUnitAction = {
    type: 'deleteUnit';
    isAttacker: boolean;
    index: number;
};

function deleteUnit(state: UseBrawlState, { isAttacker, index }: DeleteUnitAction): UseBrawlState {
    if (isAttacker)
        return { ...state, attackers: state.attackers.filter((_, i) => i !== index) };

    const defenders = state.defenders.filter((_, i) => i !== index);
    const attackers: Attacker[] = state.attackers.map(attacker => ({ ...attacker, fights: attacker.fights.filter((_, i) => i !== index) }));

    return { ...state, defenders, attackers };
}

type MoveUnitAction = {
    type: 'moveUnit';
    index: number;
    value: 'left' | 'right';
};

function moveUnit(state: UseBrawlState, action: MoveUnitAction): UseBrawlState {
    const attackers = [ ...state.attackers ];
    const attacker = attackers[action.index];
    attackers[action.index] = attackers[action.index + (action.value === 'left' ? -1 : 1)];
    attackers[action.index + (action.value === 'left' ? -1 : 1)] = attacker;

    return { ...state, attackers };
}

type FightConditionsAction = {
    type: 'fightConditions';
    defenderIndex: number;
    attackerIndex: number;
    toggle: keyof FightConditions;
};

function fightConditions(state: UseBrawlState, action: FightConditionsAction): UseBrawlState {
    const attacker = { ...state.attackers[action.attackerIndex] };
    attacker.fights = [ ...attacker.fights ];

    const currentValue = attacker.fights[action.defenderIndex];
    const nextValue = updateFightConditions(currentValue, action.toggle);
    attacker.fights[action.defenderIndex] = nextValue;

    // If this is a direct fight, we should turn off all other direct fights. We either make them indirect (if it's supported), or none.
    // In order to qualify, either we had a no-fight that become direct fight, or we had an indirect fight that became direct fight.
    // Explosion fights are similar, but much more complicated. We have to handle them separately.
    const isCheckNeeded = !!nextValue.isBasic && (action.toggle === 'isBasic' || action.toggle === 'isIndirect');
    if (isCheckNeeded) {
        if (attacker.unit.unitClass.skills.explode)
            tryFixExplosionFights(attacker, action);
        else
            tryFixIndirectFights(attacker, action);
    }

    const attackers = [ ...state.attackers ];
    attackers[action.attackerIndex] = attacker;

    return { ...state, attackers };
}

function tryFixIndirectFights(attacker: Attacker, action: FightConditionsAction) {
    const nextValue = attacker.fights[action.defenderIndex];
    if (nextValue.isIndirect)
        return;

    const isIndirectSupported = attacker.unit.unitClass.isIndirectSupported;
    updateAllOtherActiveFights(attacker.fights, action.defenderIndex, isIndirectSupported);
}

function updateAllOtherActiveFights(fights: FightConditions[], defenderIndex: number, isIndirectSupported: boolean) {
    for (let i = 0; i < fights.length; i++) {
        if (i === defenderIndex || !fights[i].isBasic)
            continue;

        fights[i] = { ...fights[i] };

        if (isIndirectSupported)
            fights[i].isIndirect = true;
        else
            fights[i].isBasic = false;
    }
}

function tryFixExplosionFights(attacker: Attacker, action: FightConditionsAction) {
    // At any moment, there should be either one direct fight, or any number of indirect ones.
    const otherActiveFights = attacker.fights.filter((fight, index) => fight.isBasic && index !== action.defenderIndex);
    if (otherActiveFights.length === 0)
        // No need to do anything, the updated fight is the only one active.
        return;

    // There are two modes - either we use explosion (all other active fights are indirect), or we don't.
    const wasExplosion = otherActiveFights.some(fight => fight.isIndirect);
    // If it was explosion and it was flipped, now it isn't explosion anymore, or vice versa.
    const isExplosion = (wasExplosion && action.toggle !== 'isIndirect') || (!wasExplosion && action.toggle === 'isIndirect');

    // If it's explosion, all active fights have to be indirect.
    // Otherwise, there might be at most one active fight (which is the currently updated one). It also has to be direct.
    updateAllOtherActiveFights(attacker.fights, action.defenderIndex, isExplosion);
    attacker.fights[action.defenderIndex].isIndirect = isExplosion;
}

function computeResults({ attackers, defenders }: Omit<UseBrawlState, 'results'>): BrawlResults {
    const output: BrawlResults = {
        attackers: [],
        defenders: [],
        middleFights: [],
    };
    // For the previous attackers
    let previousFights: PartialBy<MiddleResult, 'attacker'>[] = defenders.map(defender => ({ defender }));

    for (const element of attackers) {
        let attacker = element.unit;
        const attackerResults: MiddleResult[] = previousFights.map(({ defender }, defenderIndex) => {
            let wasDead: MiddleResult['wasDead'] = undefined;
            if (defender.isDead)
                wasDead = attacker.isDead ? 'both' : 'defender';

            else if (attacker.isDead)
                wasDead = 'attacker';

            if (wasDead)
                return { attacker, defender, wasDead };

            const result = fight(attacker, defender, element.fights[defenderIndex]);
            attacker = result.attacker;

            return result;
        });

        output.middleFights.push(attackerResults);
        previousFights = attackerResults;

        output.attackers.push(attacker);
    }

    for (let i = 0; i < defenders.length; i++)
        output.defenders.push(output.middleFights[attackers.length - 1][i].defender);

    return output;
}

type VersionAction = {
    type: 'units';
    value: UnitsCache;
};

function units(state: UseBrawlState, units: UnitsCache): UseBrawlState {
    const defenders = state.defenders.map(unit => {
        const newClass = units.findClass(unit.unitClass.id) ?? units.getDefaultClass();
        return newClass === unit.unitClass ? unit : updateDefenderUnitClass(unit, newClass);
    });

    const attackers = state.attackers.map(attacker => {
        const { unit, fights } = attacker;
        const newClass = units.findClass(unit.unitClass.id) ?? units.getDefaultClass();
        if (newClass === unit.unitClass)
            return attacker;

        const newUnit = updateAttackerUnitClass(unit, newClass);
        // We have to fix all fights. There might be tentacles in play, or something even more scarier.
        const newFights = fights.map((fight, index) => createFightConditions(newUnit, state.defenders[index], fight));

        return { unit: newUnit, fights: newFights };
    });

    return { ...state, defenders, attackers };
}

export function computeReadonlyState(data: ReadonlyBrawlData) {
    const { units, attackers, defenders, fights } = computeUnits(data);
    const state: Omit<UseBrawlState, 'results'> = {
        units,
        defenders,
        attackers: attackers.map((unit, index) => ({
            unit,
            fights: fights[index],
        })),
        isReadonly: true,
    };

    return { ...state, results: computeResults(state) };
}
