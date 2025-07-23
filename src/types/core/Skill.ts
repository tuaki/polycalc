import { getStringEnumValues } from '@/types/utils/common';

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
    /** The unit's target doesn't retaliate. */
    Surprise = 'surprise',
    /** The unit doesn't retaliate. */
    Stiff = 'stiff',
    /** The unit does splash-like damage to adjacent units when moving. Normal attack isn't affected. */
    Stomp = 'stomp',
    /**
     * The unit does damage to all units that move next to it (before they attack). Both when they move and when this moves.
     * Apply also to training - if a tentacle unit is trained, it damages its surroundings. However, it doesn't work the other way around.
     * If there are multiple units with tentacles, only one of them applies.
     * TODO two units with tentacles controlled by different players.
     */
    Tentacles = 'tentacles',
    /** The unit can't become veteran. */
    Static = 'static',
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
    [SkillType.Stiff]: {
        label: 'Stiff',
        description: 'TODO',
    },
    [SkillType.Stomp]: {
        label: 'Stomp',
        description: 'TODO',
    },
    [SkillType.Tentacles]: {
        label: 'Tentacles',
        description: 'TODO',
    },
    [SkillType.Static]: {
        label: 'Static',
        description: 'TODO',
    },
};

export const SKILLS: Record<SkillType, Skill> = getStringEnumValues(SkillType).reduce((ans, skill) => {
    const def = SKILL_DEFINITIONS[skill];
    ans[skill] = new Skill(skill, def.label, def.description);
    return ans;
}, {} as Record<SkillType, Skill>);
