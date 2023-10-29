import { type PlainType } from '../utils/common';
import { type SkillMap, type SkillType, createSkillMap } from './Skill';
import { UNIT_DEFINITIONS, UNIT_VARIANT_DEFINITIONS, type UnitTag } from './units';

/**
 * A unit variant specifies health in case it can't be derived from the unit class.
 * Usecase: ships.
 * Some other units can become veterans, however we don't use variants for that since it's just a binary flag.
 */
export class UnitVariant {
    constructor(
        readonly id: string,
        readonly label: string,
        readonly health: number,
    ) {}

    static fromDefinition(def: UnitVariantDefinition): UnitVariant {
        return new UnitVariant(def.id, def.label, def.health);
    }
}

export const UNIT_VARIANTS = UNIT_VARIANT_DEFINITIONS.map(UnitVariant.fromDefinition);

export type UnitVariantDefinition = PlainType<UnitVariant>;

export class UnitClass {
    constructor(
        readonly id: string,
        readonly label: string,
        readonly health: number | undefined, // Might be a ship
        readonly attack: number,
        readonly defense: number,
        readonly skills: SkillMap,
        readonly tags: readonly UnitTag[],
        readonly variants: readonly UnitVariant[] | undefined,
    ) {}

    static fromDefinition(def: UnitClassDefinition): UnitClass {
        const foundVariants = def.variantIds?.map(id => UNIT_VARIANTS.find(v => v.id === id)).filter((v): v is UnitVariant => v !== undefined) ?? [];
        const variants = foundVariants.length > 0 ? foundVariants : undefined;

        return new UnitClass(def.id, def.label, def.health, def.attack, def.defense, createSkillMap(def.skills), def.tags, variants);
    }
}

export type UnitClassDefinition = Omit<UnitClass, 'skills' | 'variants'> & {
    skills: readonly SkillType[];
    variantIds?: readonly string[];
};

export const UNITS = UNIT_DEFINITIONS.map(UnitClass.fromDefinition);
