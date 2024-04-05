import usePreferences from '@/PreferencesProvider';
import { ConditionType, createConditionMap } from '@/types/core/Condition';
import { Unit, VETERAN_HEALTH_BONUS } from '@/types/core/Unit';
import { type UnitVariant, type UnitClass } from '@/types/core/UnitClass';
import { type Version } from '@/types/core/Version';
import { useEffect, useMemo, useReducer } from 'react';

export function useDefender() {
    const { preferences } = usePreferences();
    const [ state, dispatch ] = useReducer(reducer, computeInitialState(preferences.version));
    const unit = useMemo(() => toUnit(state), [ state ]);

    useEffect(() => {
        dispatch({ type: 'version', value: preferences.version });
    }, [ preferences.version ]);

    return { state, dispatch, unit };
}

type Action = UnitClassAction | VariantAction | HealthAction | FlagAction | VersionAction;

export function reducer(state: State, action: Action): State {
    console.log('Reduce:', state, action);
    
    const newState = innerReducer(state, action);
    if (newState.isHealthLinked)
        newState.health = computeDefaultHealth(newState);

    return newState;
}

function computeDefaultHealth({ unitClass, variant, isVeteran }: Pick<State, 'unitClass' | 'variant' | 'isVeteran'>): number {
    return (unitClass.health ?? variant?.health as number) + (isVeteran ? VETERAN_HEALTH_BONUS : 0);
}

function innerReducer(state: State, action: Action): State {
    switch (action.type) {
    case 'unitClass': return unitClass(state, action.value);
    case 'variant': return variant(state, action.value);
    case 'health': {
        if ('value' in action)
            return { ...state, health: action.value };

        return { ...state, health: state.health + (action.operation === 'increment' ? 1 : -1) };
    }
    case 'flag': {
        if (action.field === 'isDefenseBonus')
            return { ...state, bonus: action.value ? 'defense' : 'none' };
        if (action.field === 'isWallBonus')
            return { ...state, bonus: action.value ? 'wall' : 'none' };

        return { ...state, [action.field]: action.value };
    }
    case 'version': return version(state, action.value);
    }
}

export function toUnit(state: State): Unit {
    return new Unit(state.unitClass, state.variant, state.health, createConditionMap({
        [ConditionType.Veteran]: state.isVeteran,
        [ConditionType.Poisoned]: state.isPoisoned,
        [ConditionType.DefenseBonus]: state.bonus === 'defense',
        [ConditionType.WallBonus]: state.bonus === 'wall',
    }));
}

type BonusType = 'none' | 'defense' | 'wall';

type State = {
    unitClass: UnitClass;
    variant?: UnitVariant;
    /** If yes, the health will update when changing classes, variants etc. */
    isHealthLinked: boolean;
    health: number;
    isVeteran: boolean;
    isPoisoned: boolean;
    bonus: BonusType;
};

function computeInitialState(version: Version): State {
    const unitClass = version.getDefaultClass();
    const variant = unitClass.getDefaultVariant();
    const isVeteran = false;
    const health = computeDefaultHealth({ unitClass, variant, isVeteran });

    return {
        unitClass,
        variant,
        isHealthLinked: true,
        health,
        isVeteran,
        isPoisoned: false,
        bonus: 'none',
    };
}

type UnitClassAction = {
    type: 'unitClass';
    value: UnitClass;
}

function unitClass(state: State, unitClass: UnitClass): State {
    return { 
        ...state,
        unitClass,
        variant: unitClass.getDefaultVariant(),
        isVeteran: state.isVeteran && unitClass.skills.promote,
        bonus: (unitClass.isNavalOnly && state.bonus === 'wall') ? 'none' : state.bonus,
    };
}

type VariantAction = {
    type: 'variant';
    value: UnitVariant;
}

function variant(state: State, variant: UnitVariant): State {
    if (!state.unitClass.variants?.includes(variant))
        return state;
    
    return { ...state, variant };
}

type HealthAction = {
    type: 'health';
} & ({
    value: number;
} | {
    operation: 'increment' | 'decrement';
});

type FlagAction = {
    type: 'flag';
    field: 'isHealthLinked' | 'isVeteran' | 'isPoisoned' | 'isDefenseBonus' | 'isWallBonus';
    value: boolean;
}

type VersionAction = {
    type: 'version';
    value: Version;
}

function version(state: State, version: Version): State {
    const newClass = version.getClass(state.unitClass.id) ?? version.getDefaultClass();
    if (newClass === state.unitClass)
        // The current class is the same in the new version, we don't have to change anything.
        return state;

    // Otherwise it's just like changing the unit class.
    return unitClass(state, newClass);
}
