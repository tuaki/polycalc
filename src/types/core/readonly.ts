import { type ConditionType, createConditionMap } from './Condition';
import { Unit } from './Unit';
import { VERSIONS } from './UnitClass';
import { DEFAULT_VERSION_ID, UnitsCache, type VersionId } from './Version';
import { createFightConditions, fightConditionsFromArray, type FightConditionsArray } from './combat';

export type ReadonlyBrawlData = {
    versionId?: VersionId;
    attackers: ReadonlyUnit[];
    defenders: ReadonlyUnit[];
    fights: FightConditionsArray[][];
};

export function computeUnits(data: ReadonlyBrawlData) {
    const version = VERSIONS[data.versionId ?? DEFAULT_VERSION_ID];
    const units = new UnitsCache(version, []);

    const attackers = data.attackers.map(unit => computeUnit(unit, units));
    const defenders = data.defenders.map(unit => computeUnit(unit, units));
    const fights = data.fights.map((forAttacker, index) => computeFightsForAttacker(attackers[index], defenders, forAttacker));

    return { units, attackers, defenders, fights };
}

type ReadonlyUnit = {
    classId: string;
    variantId?: string;
    health?: number;
    conditions?: ConditionType[];
};

function computeUnit(data: ReadonlyUnit, units: UnitsCache) {
    const unitClass = units.findClass(data.classId);
    if (!unitClass)
        throw new Error(`Unit class not found: ${data.classId}`);
    const variant = data.variantId ? unitClass.variants?.find(variant => variant.id === data.variantId) : unitClass.getDefaultVariant();

    const conditions = createConditionMap();
    data.conditions?.forEach(condition => conditions[condition] = true);

    const health = data.health ?? unitClass.getHealth(variant, conditions.veteran);

    return new Unit(unitClass, variant, health, conditions);
}

function computeFightsForAttacker(attacker: Unit, defenders: Unit[], fights: FightConditionsArray[]) {
    return fights.map((fight, defenderIndex) => createFightConditions(attacker, defenders[defenderIndex], fightConditionsFromArray(fight), true));
}
