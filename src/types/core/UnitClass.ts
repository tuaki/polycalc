import { type PlainType } from '@/types/utils/common';
import { type SkillMap, type SkillType, createSkillMap } from './Skill';
import { UNIT_DEFINITIONS, UNIT_VARIANT_DEFINITIONS, UnitTag } from './units';
import { VERSION_DEFINITIONS, VERSION_IDS, Version, type VersionId } from './Version';

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

export type UnitVariantDefinition = PlainType<UnitVariant>;

export class UnitClass {
    constructor(
        readonly id: string,
        readonly idShort: string,
        readonly label: string,
        readonly health: number | undefined, // Might be a ship
        readonly attack: number,
        readonly defense: number,
        readonly range: number,
        readonly skills: SkillMap,
        readonly tags: readonly UnitTag[],
        readonly variants: readonly UnitVariant[] | undefined,
    ) {}

    static fromDefinition(def: UnitClassDefinition, allVariants: readonly UnitVariant[]): UnitClass {
        const { health, variants } = getHealthOrVariants(def, allVariants);

        return new UnitClass(def.id, def.idShort, def.label, health, def.attack, def.defense, def.range, createSkillMap(def.skills), def.tags, variants);
    }

    getDefaultVariant(): UnitVariant | undefined {
        return this.variants?.[0];
    }

    getDefaultHealth(): number {
        // A unit has either health or variants.
        return this.health ?? this.getDefaultVariant()?.health as number;
    }

    // A hack for now, might need a fix later.
    get isNavalOnly(): boolean {
        return !this.tags.includes(UnitTag.Land);
    }

    get isIndirectSupported(): boolean {
        return this.skills.stomp || this.skills.splash;
    }
}

function getHealthOrVariants(def: UnitClassDefinition, allVariants: readonly UnitVariant[]): { health?: number, variants?: readonly UnitVariant[] } {
    if ('health' in def)
        return { health: def.health };

    const variants = def.variantIds.map(id => allVariants.find(v => v.id === id)).filter((v): v is UnitVariant => v !== undefined);

    return { variants };
}

export type UnitClassDefinition = {
    id: string;
    idShort: string;
    label: string;
    attack: number;
    defense: number;
    range: number;
    skills: readonly SkillType[];
    tags: readonly UnitTag[];
} & ({
    health: number;
} | {
    variantIds: readonly string[];
});

const UNIT_VARIANTS = UNIT_VARIANT_DEFINITIONS.map(UnitVariant.fromDefinition);

function createUnits() {
    const output = {} as Record<VersionId, readonly UnitClass[]>;
    const current: Map<string, UnitClass> = new Map();

    // We iterate versions from the oldest to the newest, so that we can override unit classes.
    VERSION_IDS.forEach(versionId => {
        UNIT_DEFINITIONS[versionId].forEach(def => {
            if (typeof def === 'string') {
                // If the unit definition is only string, it means that it should be removed.
                current.delete(def);
            }
            else {
                const unit = UnitClass.fromDefinition(def, UNIT_VARIANTS);
                current.set(unit.id, unit);
            }
        });
        output[versionId] = [ ...current.values() ];
    });

    return output;
}

export const UNITS = createUnits();

function createVersions() {
    const output = {} as Record<VersionId, Version>;
    VERSION_DEFINITIONS.forEach(def => output[def.id] = new Version(def.id, def.gameId, def.label, def.isBeta, UNITS[def.id]));
    return output;
}

export const VERSIONS = createVersions();
