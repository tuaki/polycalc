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
}

export type VersionStatus = 'beta' | 'latest' | 'deprecated';
export type VersionId = 'diplomacy' | 'ocean-0' | 'ocean-1' | 'aquarion-rework';

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
    { id: 'diplomacy', gameId: '2.7.2', label: 'Diplomacy (100)', status: 'deprecated' },
    { id: 'ocean-0', gameId: '2.8.4', label: 'Path of the Ocean (103)', status: 'deprecated' },
    { id: 'ocean-1', gameId: '2.8.5', label: 'Path of the Ocean (104)', status: 'latest' },
    { id: 'aquarion-rework', gameId: '2.9.2', label: 'Aquarion Rework', status: 'beta' },
];

export const VERSION_IDS: readonly VersionId[] = VERSION_DEFINITIONS.map(def => def.id);
export const DEFAULT_VERSION_ID = VERSION_DEFINITIONS.find(v => v.status === 'latest')?.id ?? VERSION_IDS[0];
