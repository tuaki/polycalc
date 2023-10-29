import { getStringEnumValues } from '../utils/common';

/**
 * Only those relevant for the combat outcome.
 */
export enum SkillType {
    Convert = 'convert',
    Explode = 'explode',
    Fortify = 'fortify',
    Freeze = 'freeze',
    Infiltrate = 'infiltrate',
    Poison = 'poison',
    Splash = 'splash',
    Surprise = 'surprise',
    /** Custom skill - the unit can become veteran */
    Promote = 'promote',
}

export class Skill {
    public constructor(
        readonly id: SkillType,
        readonly label: string,
        readonly description: string,
    ) {}
}

export type SkillMap = Record<SkillType, boolean>;

export function createSkillMap(array: readonly SkillType[]): SkillMap {
    const map: SkillMap = {} as SkillMap;
    getStringEnumValues(SkillType).forEach(skill => map[skill] = false);
    array.forEach(skill => map[skill] = true);

    return map;
}

type SkillDefinition = Omit<Skill, 'id'>;

const SKILL_DEFINITIONS: Record<SkillType, SkillDefinition> = {
    [SkillType.Convert]: {
        label: 'Convert',
        description: 'TODO',
    },
    [SkillType.Explode]: {
        label: 'Explode',
        description: 'TODO',
    },
    [SkillType.Fortify]: {
        label: 'Fortify',
        description: 'TODO',
    },
    [SkillType.Freeze]: {
        label: 'Freeze',
        description: 'TODO',
    },
    [SkillType.Infiltrate]: {
        label: 'Infiltrate',
        description: 'TODO',
    },
    [SkillType.Poison]: {
        label: 'Poison',
        description: 'TODO',
    },
    [SkillType.Splash]: {
        label: 'Splash',
        description: 'TODO',
    },
    [SkillType.Surprise]: {
        label: 'Surprise',
        description: 'TODO',
    },
    [SkillType.Promote]: {
        label: 'Promotable',
        description: 'TODO',
    },
};

export const SKILLS: Record<SkillType, Skill> = getStringEnumValues(SkillType).reduce((ans, skill) => {
    const def = SKILL_DEFINITIONS[skill];
    ans[skill] = new Skill(skill, def.label, def.description);
    return ans;
}, {} as Record<SkillType, Skill>);
