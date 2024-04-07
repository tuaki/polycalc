import { useReducer } from 'react';
import { type Unit } from '@/types/core/Unit';
import { fight } from '@/types/core/combat';
import { createDefaultDefender } from '@/components/units/useDefender';
import usePreferences from '@/PreferencesProvider';
import { type Version } from '@/types/core/Version';
import { createDefaultAttacker } from '@/components/units/useAttacker';

export function useBrawl() {
    const { preferences } = usePreferences();
    const [ state, dispatch ] = useReducer(reducer, computeInitialState(preferences.version));

    return { state, dispatch };
}

type Action = CreateUnitAction | EditUnitAction | DeleteUnitAction | MoveUnitAction | FightModeAction;

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
    case 'fightMode': return fightMode(state, action);
    }
}

export type UseBrawlDispatch = React.Dispatch<Action>;

export type FightMode = 'none' | 'direct' | 'indirect';

type Attacker = {
    unit: Unit;
    fights: FightMode[];
}

export type UseBrawlState = {
    version: Version; // TODO
    defenders: Unit[];
    attackers: Attacker[];
    results: (Unit | undefined)[][] | undefined;
};

function computeInitialState(version: Version): UseBrawlState {
    return {
        version,
        defenders: [ createDefaultDefender(version) ],
        attackers: [ { unit: createDefaultAttacker(version), fights: [ 'direct' ] } ],
        results: undefined,
    };
}

type CreateUnitAction = {
    type: 'creteUnit';
    isAttacker: boolean;
};

function creteUnit(state: UseBrawlState, { isAttacker }: CreateUnitAction): UseBrawlState {
    if (isAttacker) {
        const fights: FightMode[] = state.defenders.map(() => 'none');
        return { ...state, attackers: [ ...state.attackers, { unit: createDefaultAttacker(state.version), fights } ] };
    }
    
    const defenders = [ ...state.defenders, createDefaultDefender(state.version) ];
    const attackers: Attacker[] = state.attackers.map(attacker => ({ ...attacker, fights: [ ...attacker.fights, 'none' ] }));

    return { ...state, defenders, attackers };
}

type EditUnitAction = {
    type: 'editUnit';
    isAttacker: boolean;
    index: number;
    unit: Unit;
};

function editUnit(state: UseBrawlState, { isAttacker, index, unit }: EditUnitAction): UseBrawlState {
    if (!isAttacker) {
        const defenders = [ ...state.defenders ];
        defenders[index] = unit;

        return { ...state, defenders };
    }

    const attackers = [ ...state.attackers ];
    attackers[index] = { ...state.attackers[index], unit };

    return { ...state, attackers };
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

type FightModeAction = {
    type: 'fightMode';
    defenderIndex: number;
    attackerIndex: number;
}

function fightMode(state: UseBrawlState, action: FightModeAction): UseBrawlState {
    const attacker = { ...state.attackers[action.attackerIndex] };
    attacker.fights = [ ...attacker.fights ];

    const currentValue = attacker.fights[action.defenderIndex];
    const isIndeirectSupported = attacker.unit.unitClass.skills.stomp || attacker.unit.unitClass.skills.splash;
    const nextValue = getNextFightMode(currentValue, isIndeirectSupported);

    attacker.fights[action.defenderIndex] = nextValue;
    if (isIndeirectSupported && nextValue === 'direct') {
        for (let i = 0; i < attacker.fights.length; i++) {
            if (i !== action.defenderIndex && attacker.fights[i] === 'direct')
                attacker.fights[i] = 'indirect';
        }
    }

    const attackers = [ ...state.attackers ];
    attackers[action.attackerIndex] = attacker;

    return { ...state, attackers };
}

function getNextFightMode(current: FightMode, isIndeirectSupported: boolean): FightMode {
    if (current === 'none')
        return 'direct';
    if (current === 'indirect')
        return 'none';

    return isIndeirectSupported ? 'indirect' : 'none';
}

function computeResults({ attackers, defenders }: UseBrawlState): (Unit | undefined)[][] {
    const results = [];
    let previousDefenders: (Unit | undefined)[] = defenders;

    for (const element of attackers) {
        const attacker = element.unit;
        const attackerResults = previousDefenders.map((defender, defenderIndex) => {
            if (!defender || defender.isDead)
                return;

            const fightMode = element.fights[defenderIndex];
            if (fightMode === 'none')
                return defender;

            const indirectAttack = fightMode === 'indirect';
            const updatedAttacker = attacker.update(attacker.health, { ...attacker.conditions, indirectAttack });
            const fightResult = fight(updatedAttacker, defender);

            return fightResult?.defender;
        });

        results.push(attackerResults);
        previousDefenders = attackerResults;
    }

    return results;
}
