import { useEffect, useReducer } from 'react';
import { type Unit } from '@/types/core/Unit';
import { type FightConditions, fight, createFightConditions, updateFightConditions } from '@/types/core/combat';
import { createDefaultDefender, updateDefenderUnitClass } from '@/components/units/useDefender';
import usePreferences from '@/components/preferences/PreferencesProvider';
import { type UnitsCache } from '@/types/core/Version';
import { createDefaultAttacker, updateAttackerUnitClass } from '@/components/units/useAttacker';
import { type PartialBy } from '@/types/utils/common';

export function useBrawl() {
    const { units } = usePreferences();
    const [ state, dispatch ] = useReducer(reducer, computeInitialState(units));

    useEffect(() => {
        dispatch({ type: 'units', value: units });
    }, [ units ]);

    return { state, dispatch };
}

type Action = CreateUnitAction | EditUnitAction | DeleteUnitAction | MoveUnitAction | FightConditionsAction | VersionAction;

function reducer(state: UseBrawlState, action: Action): UseBrawlState {
    console.log('Reduce:', state, action);

    const newState = innerReducer(state, action);

    return { ...newState, results: computeResults(newState) };
}

function innerReducer(state: UseBrawlState, action: Action): UseBrawlState {
    switch (action.type) {
    case 'creteUnit': return creteUnit(state, action);
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
    type: 'creteUnit';
    isAttacker: boolean;
};

function creteUnit(state: UseBrawlState, { isAttacker }: CreateUnitAction): UseBrawlState {
    if (isAttacker) {
        const attacker = createDefaultAttacker(state.units);
        const fights: FightConditions[] = state.defenders
            .map((defender, index) => createFightConditions(attacker, defender, undefined, index !== 0));
        return { ...state, attackers: [ ...state.attackers, { unit: attacker, fights } ] };
    }
    
    const defender = createDefaultDefender(state.units);
    const defenders = [ ...state.defenders, defender ];
    const attackers: Attacker[] = state.attackers
        .map(attacker => ({ ...attacker, fights: [ ...attacker.fights, createFightConditions(attacker.unit, defender, undefined, true) ] }));

    return { ...state, defenders, attackers };
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
    const isIndirectSupported = attacker.unit.unitClass.isIndirectSupported;
    const isNewDirectFight = !!nextValue.isBasic
        && !nextValue.isIndirect
        && (action.toggle === 'isBasic' || action.toggle === 'isIndirect');

    if (isNewDirectFight) {
        for (let i = 0; i < attacker.fights.length; i++) {
            if (i === action.defenderIndex || !attacker.fights[i].isBasic)
                continue;

            if (isIndirectSupported) 
                attacker.fights[i].isIndirect = true;
            else 
                attacker.fights[i].isBasic = false;
        }
    }

    const attackers = [ ...state.attackers ];
    attackers[action.attackerIndex] = attacker;

    return { ...state, attackers };
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
