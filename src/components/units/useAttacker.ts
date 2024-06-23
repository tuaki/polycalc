import { useEffect, useMemo, useReducer } from 'react';
import usePreferences from '@/components/preferences/PreferencesProvider';
import { ConditionType, createConditionMap } from '@/types/core/Condition';
import { Unit, VETERAN_HEALTH_BONUS } from '@/types/core/Unit';
import { type UnitVariant, type UnitClass } from '@/types/core/UnitClass';
import { type UnitsCache } from '@/types/core/Version';

export function useAttacker(input: Unit, onChange: (unit: Unit) => void) {
    const { units } = usePreferences();
    const [ state, dispatch ] = useReducer(reducer, computeInitialState(input));

    useEffect(() => {
        dispatch({ type: 'units', value: units });
    }, [ units ]);

    const innerUnit = useMemo(() => toUnit(state), [ state ]);
    // TODO signals probably ...
    useEffect(() => {
        onChange(innerUnit);
    }, [ innerUnit ]);

    return { state, dispatch };
}

type Action = UnitClassAction | VariantAction | HealthAction | FlagAction | VersionAction;

function reducer(state: State, action: Action): State {
    console.log('Reduce:', state, action);

    const newState = innerReducer(state, action);
    if (newState.isHealthLinked)
        newState.health = computeDefaultHealth(newState);

    return newState;
}

function computeDefaultHealth({ unitClass, variant, isVeteran }: Pick<State, 'unitClass' | 'variant' | 'isVeteran'>): number {
    return (unitClass.health ?? variant!.health) + (isVeteran ? VETERAN_HEALTH_BONUS : 0);
}

function innerReducer(state: State, action: Action): State {
    switch (action.type) {
    case 'unitClass': return unitClass(state, action.value);
    case 'variant': return variant(state, action.value);
    case 'health': {
        const health = 'value' in action
            ? action.value
            : state.health + (action.operation === 'increment' ? 1 : -1);

        const isHealthLinked = state.isHealthLinked && health === computeDefaultHealth(state);

        return { ...state, health, isHealthLinked };
    }
    case 'flag': return { ...state, [action.field]: action.value };
    case 'units': return units(state, action.value);
    }
}

type State = {
    unitClass: UnitClass;
    variant?: UnitVariant;
    /** If yes, the health will update when changing classes, variants etc. */
    isHealthLinked: boolean;
    health: number;
    isBoosted: boolean;
    isVeteran: boolean;
};

function computeInitialState(unit: Unit): State {
    const unitClass = unit.unitClass;
    const variant = unit.variant;
    const isVeteran = unit.conditions.veteran;
    const defaultHealth = computeDefaultHealth({ unitClass, variant, isVeteran });
    const health = unit.health;

    return {
        unitClass,
        variant,
        isHealthLinked: defaultHealth === health,
        health,
        isVeteran,
        isBoosted: unit.conditions.boosted,
    };
}

export function createDefaultAttacker(units: UnitsCache): Unit {
    const unitClass = units.getDefaultClass();
    const variant = unitClass.getDefaultVariant();
    const health = computeDefaultHealth({ unitClass, variant, isVeteran: false });

    return new Unit(unitClass, variant, health, createConditionMap());
}

function toUnit(state: State): Unit {
    return new Unit(state.unitClass, state.variant, state.health, createConditionMap({
        [ConditionType.Boosted]: state.isBoosted,
        [ConditionType.Veteran]: state.isVeteran,
    }));
}

type UnitClassAction = {
    type: 'unitClass';
    value: UnitClass;
};

function unitClass(state: State, unitClass: UnitClass): State {
    return { 
        ...state,
        unitClass,
        variant: unitClass.getDefaultVariant(),
        isVeteran: state.isVeteran && unitClass.skills.promote,
    };
}

export function updateAttackerUnitClass(unit: Unit, newClass: UnitClass): Unit {
    const state = computeInitialState(unit);
    const updatedState = unitClass(state, newClass);

    return toUnit(updatedState);
}

type VariantAction = {
    type: 'variant';
    value: UnitVariant;
};

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
};

type VersionAction = {
    type: 'units';
    value: UnitsCache;
};

function units(state: State, units: UnitsCache): State {
    const newClass = units.findClass(state.unitClass.id) ?? units.getDefaultClass();
    if (newClass === state.unitClass)
        // The current class is the same in the new version, we don't have to change anything.
        return state;

    // Otherwise it's just like changing the unit class.
    return unitClass(state, newClass);
}
