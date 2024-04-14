import { type UnitClass } from './UnitClass';

export type VersionId = 'diplomacy' | 'ocean-0' | 'ocean-1';

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
        readonly isBeta: boolean,
        readonly units: readonly UnitClass[],
    ) {}

    getClasses(): readonly UnitClass[] {
        return this.units;
    }

    getClass(id: string): UnitClass | undefined {
        return this.units.find(unit => unit.id === id);
    }

    getDefaultClass(): UnitClass {
        return this.units[0];
    }
}

type VersionDefinition = {
    id: VersionId;
    gameId: string;
    label: string;
    isBeta: boolean;
};

export const VERSION_DEFINITIONS: readonly VersionDefinition[] = [
    { id: 'diplomacy', gameId: '2.7.2', label: 'Diplomacy (100)', isBeta: false },
    { id: 'ocean-0', gameId: '2.8.4', label: 'Path of the Ocean (103)', isBeta: false },
    { id: 'ocean-1', gameId: '2.8.5', label: 'Path of the Ocean (104)', isBeta: false },
];

export const VERSION_IDS: readonly VersionId[] = VERSION_DEFINITIONS.map(def => def.id);
export const DEFAULT_VERSION_ID = VERSION_IDS[0];
