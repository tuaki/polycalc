import { type ConditionMap, ConditionType } from './Condition';
import { type Unit } from './Unit';

export type FightResult = {
    attacker: Unit;
    defender: Unit;
};

export function fight(attacker: Unit, defender: Unit, conditions: FightConditions): FightResult {
    const input = { attacker, defender };
    if (!isFightHappening(attacker, defender, conditions))
        return input;

    // The tentacles schenenigans happen before anything else. Also, both units use them at the same time.
    const afterTentacles = conditions.isTentacles ? tentaclesFight(input, conditions) : input;

    return conditions.isBasic && !attacker.unitClass.skills.tentacles
        ? basicFight(afterTentacles, conditions)
        : afterTentacles;
}

function isFightHappening(attacker: Unit, defender: Unit, conditions: FightConditions): boolean {
    if (attacker.isDead || defender.isDead || defender.conditions.converted)
        return false;

    return !!conditions.isBasic || !!conditions.isTentacles;
}

function tentaclesFight({ attacker, defender }: FightResult, conditions: FightConditions): FightResult {
    if (!conditions.isTentacles)
        return { attacker, defender };

    const isAttacker = attacker.unitClass.skills.tentacles;
    const isDefender = defender.unitClass.skills.tentacles && !defender.conditions.freezed;

    // All tentacle action is happening at the same time!
    return {
        attacker: isDefender ? applyTentacles(defender, attacker) : attacker,
        defender: isAttacker ? applyTentacles(attacker, defender) : defender,
    };
}

type BasicFightConditions = Omit<FightConditions, 'isBasic'>;

function basicFight({ attacker, defender }: FightResult, conditions: BasicFightConditions): FightResult {
    const { attackerDamage, defenderDamage } = calculateDamage(attacker, defender, !!conditions.isIndirect);

    const newDefender = defender.update(defender.health - defenderDamage, calculateTargetConditions(attacker, defender, true));

    const noRetaliation =
        // The only unit with this skill behaves this way. Why?
        newDefender.unitClass.skills.freeze ||
        newDefender.isDead ||
        newDefender.conditions.freezed ||
        newDefender.conditions.converted ||
        newDefender.unitClass.skills.stiff ||
        attacker.unitClass.skills.surprise ||
        !!conditions.isRanged ||
        !!conditions.isIndirect;

    const newAttacker = noRetaliation
        ? attacker.update(attacker.health, { ...attacker.conditions, [ConditionType.Boosted]: false })
        : attacker.update(attacker.health - attackerDamage, calculateTargetConditions(defender, attacker, false));

    return {
        attacker: newAttacker,
        defender: newDefender,
    };
}

function calculateDamage(attacker: Unit, defender: Unit, isReduced: boolean): { attackerDamage: number, defenderDamage: number } {
    const attackForce = attacker.attack * (attacker.health / attacker.maxHealth);
    // Here we use the modified defense value (see the comment below).
    const defenseForce = defender.defense * (defender.health / defender.maxHealth);
    const totalForce = attackForce + defenseForce;

    const defenderDamageBeforeReduced = Math.round((attackForce / totalForce) * attacker.attack * DAMAGE_CONSTANT + ROUNDING_ERROR);
    const defenderDamage = isReduced
        ? Math.floor(defenderDamageBeforeReduced * REDUCED_DAMAGE_COEFFICIENT)
        : defenderDamageBeforeReduced;

    // Here it's important to use baseDefense instead of just defense.
    // Basically we need the original defense without any modifiers (defense bonus, wall bonus, poison). This is different from the attack, where we use the modified value for both force and damage.
    const attackerDamage = Math.round((defenseForce / totalForce) * defender.baseDefense * DAMAGE_CONSTANT + ROUNDING_ERROR);

    return { attackerDamage, defenderDamage };
}

function calculateTentaclesDamage(source: Unit, target: Unit): number {
    // In case of tentacles, the defense value acts like attack.
    // However, the defense value is used without any modifiers. Boost also doesn't have any effect.
    const attackForce = source.baseDefense * (source.health / source.maxHealth);
    // Here we use the modified defense value (see the comment below).
    const defenseForce = target.defense * (target.health / target.maxHealth);
    const totalForce = attackForce + defenseForce;

    return Math.round((attackForce / totalForce) * source.baseDefense * DAMAGE_CONSTANT + ROUNDING_ERROR);
}

const DAMAGE_CONSTANT = 4.5;
// Splash, stomp and other indeirect attacks. Except for tentacles!
const REDUCED_DAMAGE_COEFFICIENT = 0.5;
/**
 * This fixes some JS rounding errors.
 * E.g., when a full-HP swordsman attack to an 8-HP swordsman with defense bonus, it should deal 8 damage and kill it. However, normal JS math would let him deal only 7 damage.
 * This computation comes to 40.5 / 5.4, which is 7.5, but JS would say 7.499999... Therefore, it would be rounded down to 7, not upt to 8.
 */
const ROUNDING_ERROR = 1e-6;

/**
 * The conditions that receive any unit when it takes damage (even if the damage is 0).
 * However, some of them are used only if the source is directly attacking the target.
 */
function calculateTargetConditions(source: Unit, target: Unit, isAttack: boolean): ConditionMap {
    const output = {
        ...target.conditions,
        [ConditionType.Boosted]: false,
    };
    if (source.unitClass.skills.poison)
        output[ConditionType.Poisoned] = true;

    if (!isAttack)
        return output;

    if (source.unitClass.skills.freeze)
        output[ConditionType.Freezed] = true;
    if (source.unitClass.skills.convert)
        output[ConditionType.Converted] = true;

    return output;
}

function applyTentacles(source: Unit, target: Unit): Unit {
    const damage = calculateTentaclesDamage(source, target);
    const conditions = calculateTargetConditions(source, target, false);

    return target.update(target.health - damage, conditions);
}

// Fight conditions

/** If any of the following options is undefined, it isn't available for the fight. */
export type FightConditions = {
    /** Whether the basic fight is even happening. */
    isBasic?: boolean;
    /** Whether the attack is indirect. */
    isIndirect?: boolean;
    /** Whether the attacker receives no retaliation. */
    isRanged?: boolean;
    /** Whether any of the units (or both) should receive the tentacle damage. */
    isTentacles?: boolean;
};

export type FightConditionsArray = (keyof FightConditions)[];

export function fightConditionsFromArray(input: FightConditionsArray): FightConditions {
    const conditions: FightConditions = {};
    for (const key of input)
        conditions[key] = true;
    return conditions;
}

/**
 * Returns valid fight conditions for the given combination of attacker and defender.
 * Takes into account previous fight conditions (if they are provided), even if they were used for a different unit.
 * @param prev Previous fight conditions, if available.
 * @param isPassive Whether the default action is to "do nothing". If false, the unit will be attacking or something.
 */
export function createFightConditions(attacker: Unit, defender: Unit, prev?: FightConditions, isPassive?: boolean): FightConditions {
    const isActive = !isPassive;

    // There are two options for the defender - either he has tentacles, or he doesn't. Let's call them T and B.
    // The attacker, however, can have five options - basic, indirect, ranged, indirect + ranged, and tentacles (B, S, R, SR, and T).
    // Therefore, we have 10 combinations - from B-B, B-R, B-S, ..., T-T.

    // Each of the four conditions can be either enabled or disabled. If it's enabled, we try to use the prev value, then the default value.

    if (attacker.unitClass.skills.tentacles) {
        // T-T and T-B are the same - if there is action, it will end up as tentacle fight. Basic fight is not possible since the only tentacle unit in the game lacks normal attack.
        return { isTentacles: prev?.isTentacles ?? isActive };
    }

    // The tentacles option is now fully orthogonal to the other options.
    const isTentacles = computeIsTentacles(attacker, defender, prev, isPassive);

    const isBasic = prev?.isBasic ?? isActive;

    // Indirect attack isn't the default.
    const isIndirect = attacker.unitClass.isIndirectSupported
        ? (prev?.isIndirect ?? false)
        : undefined;

    // Ranged attack is the default.
    const isRanged = attacker.unitClass.range > 1
        ? (prev?.isRanged ?? true)
        : undefined;

    return { isBasic, isIndirect, isRanged, isTentacles };
}

function computeIsTentacles(attacker: Unit, defender: Unit, prev?: FightConditions, isPassive?: boolean): boolean | undefined {
    if (!defender.unitClass.skills.tentacles) {
        // *-B
        return undefined;
    }
    if (prev?.isTentacles !== undefined)
        return prev.isTentacles;
    if (isPassive)
        return false;

    // Let's assume that ranged units will avoid tentacles, while all other units will not. Non-ranged splash units can't avoid them in any case!
    return attacker.unitClass.range <= 1;
}

/**
 * Updates the fight conditions by toggling one of its properties.
 */
export function updateFightConditions(prev: FightConditions, toggle: keyof FightConditions): FightConditions {
    if (prev[toggle] === undefined) {
        // This should not happen.
        console.warn(`Toggling an undefined fight condition: ${toggle}`);
        return prev;
    }

    // We don't check whether the fight is actually happening. If not, we just disable the toggle, but we still keep the settings.
    const copy = { ...prev };
    copy[toggle] = !copy[toggle];

    return copy;
}
