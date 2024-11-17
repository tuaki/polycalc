import { createConditionMap } from './Condition';
import { Unit } from './Unit';
import { type UnitClass } from './UnitClass';
import { type UnitTag } from './units';

export class UnitsCache {
    private readonly units: readonly UnitClass[];

    constructor(
        readonly version: Version,
        readonly tags: readonly UnitTag[],
    ) {
        this.units = tags.length === 0
            ? [ ...version.classes ]
            : version.classes.filter(unit => tags.some(tag => unit.tags.includes(tag)));
    }

    getClasses(): readonly UnitClass[] {
        return this.units;
    }

    findClass(id: string): UnitClass | undefined {
        return this.units.find(unit => unit.id === id);
    }

    getDefaultClass(): UnitClass {
        return this.units[0];
    }

    tryParse(input: string): Unit | undefined {
        const matches = unitRegex.exec(input.trim());
        if (!matches)
            return;

        const [ _, idShort, rawHealth, flags ] = matches;

        const unitClass = this.units.find(u => u.idShort === idShort);
        if (!unitClass)
            return;

        const conditions = createConditionMap();
        if (flags.includes('d'))
            conditions.defenseBonus = true;

        const health = rawHealth ? Number.parseInt(rawHealth) : unitClass.getDefaultHealth();

        return new Unit(unitClass, undefined, health, conditions);
    }
}

const unitRegex = new RegExp(/([a-z]{2}) *(\d*) *([d]?)/);

export type VersionStatus = 'beta' | 'latest' | 'deprecated';
export type VersionId = 'diplomacy' | 'ocean-0' | 'ocean-1' | 'aquarion-0' | 'aquarion-1';

/**
 * Each version represents a major update which has an impact on the game mechanics. Therefore, most actual versions are skipped.
 * For each such update, only the last version is included.
 */
export class Version {
    constructor(
        readonly id: VersionId,
        /** E.g., 2.7.2 */
        readonly gameId: string,
        readonly label: string,
        readonly status: VersionStatus,
        readonly classes: readonly UnitClass[],
    ) {}
}

type VersionDefinition = {
    id: VersionId;
    gameId: string;
    label: string;
    status: VersionStatus;
};

export const VERSION_DEFINITIONS: readonly VersionDefinition[] = [
    { id: 'diplomacy', gameId: '2.2.9.8251', label: '(100) Diplomacy', status: 'deprecated' },
    { id: 'ocean-0', gameId: '2.8.0', label: '(101) Path of the Ocean', status: 'deprecated' },
    { id: 'ocean-1', gameId: '2.8.5.11917', label: '(104) Path of the Ocean', status: 'deprecated' },
    { id: 'aquarion-0', gameId: '2.10.1.12787', label: '(105) Aquarion Rework', status: 'deprecated' },
    { id: 'aquarion-1', gameId: '2.11.1.13205', label: '(108) Aquarion Rework', status: 'latest' },
];

export const VERSION_IDS: readonly VersionId[] = VERSION_DEFINITIONS.map(def => def.id);
export const DEFAULT_VERSION_ID = VERSION_DEFINITIONS.find(v => v.status === 'latest')?.id ?? VERSION_IDS[0];
