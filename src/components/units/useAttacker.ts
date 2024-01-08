import usePreferences from '@/PreferencesProvider';
import { ConditionType, createConditionMap } from '@/types/core/Condition';
import { Unit, VETERAN_HEALTH_BONUS } from '@/types/core/Unit';
import { type UnitVariant, type UnitClass } from '@/types/core/UnitClass';
import { type Version } from '@/types/core/Version';
import { useEffect, useMemo, useReducer } from 'react';

export function useAttacker() {
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
    case 'flag': return { ...state, [action.field]: action.value };
    case 'version': return version(state, action.value);
    }
}

export function toUnit(state: State): Unit {
    return new Unit(state.unitClass, state.variant, state.health, createConditionMap({
        [ConditionType.Boosted]: state.isBoosted,
        [ConditionType.Veteran]: state.isVeteran,
        [ConditionType.NoRetaliation]: state.isRanged,
        [ConditionType.IndirectAttack]: state.isIndirect,
    }));
}

type State = {
    unitClass: UnitClass;
    variant?: UnitVariant;
    /** If yes, the health will update when changing classes, variants etc. */
    isHealthLinked: boolean;
    health: number;
    isBoosted: boolean;
    isVeteran: boolean;
    /** If yes, there will be no retaliation. */
    isRanged: boolean;
    /** Splash or stomp. */
    isIndirect: boolean;
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
        isBoosted: false,
        isVeteran: false,
        isRanged: false,
        isIndirect: false,
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
        isRanged: state.isRanged && unitClass.range > 1,
        isIndirect: state.isIndirect && (unitClass.skills.splash || unitClass.skills.stomp),
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
    field: 'isHealthLinked' | 'isBoosted' | 'isVeteran' | 'isRanged' | 'isIndirect';
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
