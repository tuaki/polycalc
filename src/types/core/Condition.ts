import { getStringEnumValues } from '../utils/common';

export enum ConditionType {
    Veteran = 'veteran',
    DefenseBonus = 'defenseBonus',
    WallBonus = 'wallBonus',
    Freezed = 'freezed',
    Poisoned = 'poisoned',
    Boosted = 'boosted',
    NoRetaliation = 'noRetaliation',
    SplashAttack = 'splashAttack',
    Converted = 'converted',
}

export class Condition {
    public constructor(
        readonly id: ConditionType,
        readonly label: string,
        readonly description: string,
    ) {}
}

export type ConditionMap = Record<ConditionType, boolean>;

export function createConditionMap(map: Partial<ConditionMap> = {}): ConditionMap {
    const defaultMap: ConditionMap = {} as ConditionMap;
    getStringEnumValues(ConditionType).forEach(condition => defaultMap[condition] = false);

    return {
        ...defaultMap,
        ...map,
    };
}

type ConditionDefinition = Omit<Condition, 'id'>;

const CONDITION_DEFINITIONS: Record<ConditionType, ConditionDefinition> = {
    [ConditionType.Veteran]: {
        label: 'Veteran',
        description: 'TODO',
    },
    [ConditionType.DefenseBonus]: {
        label: 'DefenseBonus',
        description: 'TODO',
    },
    [ConditionType.WallBonus]: {
        label: 'WallBonus',
        description: 'TODO',
    },
    [ConditionType.Freezed]: {
        label: 'Freezed',
        description: 'TODO',
    },
    [ConditionType.Poisoned]: {
        label: 'Poisoned',
        description: 'TODO',
    },
    [ConditionType.Boosted]: {
        label: 'Boosted',
        description: 'TODO',
    },
    [ConditionType.NoRetaliation]: {
        label: 'NoRetaliation',
        description: 'TODO',
    },
    [ConditionType.SplashAttack]: {
        label: 'SplashAttack',
        description: 'TODO',
    },
    [ConditionType.Converted]: {
        label: 'Converted',
        description: 'TODO',
    },
};

export const CONDITIONS: Record<ConditionType, Condition> = getStringEnumValues(ConditionType).reduce((ans, condition) => {
    const def = CONDITION_DEFINITIONS[condition];
    ans[condition] = new Condition(condition, def.label, def.description);
    return ans;
}, {} as Record<ConditionType, Condition>);
