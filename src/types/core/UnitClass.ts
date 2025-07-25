import { type PlainType } from '@/types/utils/common';
import { type SkillMap, type SkillType, createSkillMap } from './Skill';
import { UNIT_DEFINITIONS, UNIT_VARIANT_DEFINITIONS, type UnitTag } from './units';
import { VERSION_DEFINITIONS, VERSION_IDS, Version, type VersionId } from './Version';
import { VETERAN_HEALTH_BONUS } from './Unit';

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
    private constructor(
        readonly id: string,
        /** /[a-z]{2}/ */
        readonly idShort: string,
        readonly label: string,
        readonly health: number | undefined, // Might be a ship
        readonly attack: number,
        readonly defense: number,
        /** Range >= 1 allows melee attack. Range >= 2 allows ranged attack. */
        readonly range: number,
        readonly skills: SkillMap,
        readonly tags: readonly UnitTag[],
        readonly variants: readonly UnitVariant[] | undefined,
        /** If there is no image yet. Or am I just lazy to find the image? Who knows? */
        readonly noIcon: boolean,
    ) {}

    static fromDefinition(def: UnitClassDefinition, allVariants: readonly UnitVariant[]): UnitClass {
        const { health, variants } = getHealthOrVariants(def, allVariants);

        return new UnitClass(
            def.id,
            def.idShort,
            def.label,
            health,
            def.attack,
            def.defense,
            def.range,
            createSkillMap(def.skills),
            def.tags,
            variants,
            !!def.noIcon,
        );
    }

    getDefaultVariant(): UnitVariant | undefined {
        return this.variants?.[0];
    }

    getDefaultHealth(): number {
        // A unit has either health or variants.
        return this.health ?? this.getDefaultVariant()!.health;
    }

    getHealth(variant: UnitVariant | undefined, isVeteran: boolean): number {
        return (this.health ?? variant!.health) + (isVeteran ? VETERAN_HEALTH_BONUS : 0);
    }

    get isDirectSupported(): boolean {
        return this.range > 0;
    }

    get isIndirectSupported(): boolean {
        return this.skills.splash || this.skills.stomp || this.skills.explode;
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
    noIcon?: boolean;
} & ({
    health: number;
} | {
    variantIds: readonly string[];
});

const UNIT_VARIANTS = UNIT_VARIANT_DEFINITIONS.map(UnitVariant.fromDefinition);

function createUnits() {
    const definitions = new Map<string, UnitClassDefinition>();
    const output = {} as Record<VersionId, readonly UnitClass[]>;
    const current = new Map<string, UnitClass>();

    // We iterate versions from the oldest to the newest, so that we can override unit classes.
    VERSION_IDS.forEach(versionId => {
        UNIT_DEFINITIONS[versionId].forEach(def => {
            if (!('operation' in def)) {
                const unit = UnitClass.fromDefinition(def, UNIT_VARIANTS);
                definitions.set(def.id, def);
                current.set(unit.id, unit);
                return;
            }

            if (def.operation === 'delete') {
                current.delete(def.id);
                return;
            }

            const newDefinition = { ...definitions.get(def.id), ...def } as UnitClassDefinition & { operation?: string };
            delete(newDefinition.operation);

            const unit = UnitClass.fromDefinition(newDefinition, UNIT_VARIANTS);
            definitions.set(def.id, newDefinition);
            current.set(unit.id, unit);
        });
        output[versionId] = [ ...current.values() ];
    });

    return output;
}

export const UNITS = createUnits();

function createVersions() {
    const output = {} as Record<VersionId, Version>;
    VERSION_DEFINITIONS.forEach(def => output[def.id] = new Version(def.id, def.gameId, def.label, def.status, UNITS[def.id]));
    return output;
}

export const VERSIONS = createVersions();
