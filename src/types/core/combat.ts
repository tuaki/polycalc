import { ConditionType } from './Condition';
import { type Unit } from './Unit';

export type FightResult = {
    attacker: Unit;
    defender: Unit;
};

export function fight(attacker: Unit, defender: Unit, conditions: FightConditions): FightResult {
    const input = { attacker, defender };
    if (!isFightHappening(attacker, defender, conditions))
        return input;

    // First, we try to apply the defender's tentacles.
    const afterDefenderTentacles = tryDefenderTentacles(input, conditions);

    const doAttackerTentacles = conditions.isTentacles && attacker.unitClass.skills.tentacles;
    if (doAttackerTentacles)
        // Now it's the attacker's turn. Again, it's indirect attack.
        return basicFight(afterDefenderTentacles, { isIndirect: true });

    // If the attacker didn't use tentacles, we can proceed with a basic fight (if it's happening).
    return conditions.isBasic
        ? basicFight(afterDefenderTentacles, conditions)
        : afterDefenderTentacles;
}

function isFightHappening(attacker: Unit, defender: Unit, conditions: FightConditions): boolean {
    if (attacker.isDead || defender.isDead || defender.conditions.converted)
        return false;

    return !!conditions.isBasic || !!conditions.isTentacles;
}

// The tentacle combat works like this:
//  - The defender attackes the attacker first.
//      - The tentacle unit always uses its defense value instead of its attack value.
//      - It's indirect attack (which also means that the attacker doesn't retaliate).
//      - Otherwise, everything works as usual.
//  - Then the attacker attacks the defender. Now everything works as usual.
function tryDefenderTentacles(input: FightResult, conditions: FightConditions): FightResult {
    const { attacker, defender } = input;
    if (defender.conditions.freezed)
        return input;

    const doTentacles = conditions.isTentacles && defender.unitClass.skills.tentacles;
    if (!doTentacles)
        return input;

    // An attack with tentacles is always indirect.
    const reversedResult = basicFight({ attacker: defender, defender: attacker }, { isIndirect: true });

    return { attacker: reversedResult.defender, defender: reversedResult.attacker };
}

type BasicFightConditions = Omit<FightConditions, 'isBasic' | 'isTentacles'>;

/** A classic fight without any tentacle action. */
function basicFight({ attacker, defender }: FightResult, conditions: BasicFightConditions): FightResult {
    // Indirect attack causes less damage but can't be retaliated.
    const isIndirect = !!conditions.isIndirect;

    const { attackerDamage, defenderDamage } = calculateDamage(attacker, defender, isIndirect);

    const newDefenderConditions = {
        ...defender.conditions,
        [ConditionType.Boosted]: false,
        [ConditionType.Freezed]: attacker.unitClass.skills.freeze || defender.conditions.freezed,
        [ConditionType.Poisoned]: attacker.unitClass.skills.poison || defender.conditions.poisoned,
        [ConditionType.Converted]: attacker.unitClass.skills.convert,
    };

    const newDefender = defender.update(defender.health - defenderDamage, newDefenderConditions);

    const noRetaliation =
        newDefender.isDead ||
        newDefender.conditions.freezed ||
        newDefender.conditions.converted ||
        newDefender.unitClass.skills.stiff ||
        attacker.unitClass.skills.surprise ||
        !!conditions.isRanged ||
        isIndirect;

    const newAttackerHealth = noRetaliation ? attacker.health : attacker.health - attackerDamage;
    const newAttackerConditions = {
        ...attacker.conditions,
        [ConditionType.Boosted]: false,
    };
    if (!noRetaliation)
        newAttackerConditions[ConditionType.Poisoned] = defender.unitClass.skills.poison;

    const newAttacker = attacker.update(newAttackerHealth, newAttackerConditions);

    return {
        attacker: newAttacker,
        defender: newDefender,
    };
}

function calculateDamage(attacker: Unit, defender: Unit, isIndirect: boolean): { attackerDamage: number, defenderDamage: number } {
    // With tentacles, the attacker uses the defense value instead of the attack value.
    const attackerAttack = attacker.unitClass.skills.tentacles
        ? attacker.unitClass.defense
        : attacker.attack;

    const attackForce = attackerAttack * (attacker.health / attacker.maxHealth);
    // Here we use the modified defense value (see the comment below).
    const defenseForce = defender.defense * (defender.health / defender.maxHealth);
    const totalForce = attackForce + defenseForce;

    const defenderDamageBeforeIndirect = Math.round((attackForce / totalForce) * attackerAttack * DAMAGE_CONSTANT + ROUNDING_ERROR);
    const defenderDamage = isIndirect
        ? Math.floor(defenderDamageBeforeIndirect * INDIRECT_DAMAGE_COEFFICIENT)
        : defenderDamageBeforeIndirect;
    
    // Here it's important to use unitClass.defense instead of just defense.
    // Basically we need the original defense without any modifiers (defense bonus, wall bonus, poison). This is different from the attack, where we use the modified value for both force and damage.
    const attackerDamage = Math.round((defenseForce / totalForce) * defender.unitClass.defense * DAMAGE_CONSTANT + ROUNDING_ERROR);

    return { attackerDamage, defenderDamage };
}

const DAMAGE_CONSTANT = 4.5;
const INDIRECT_DAMAGE_COEFFICIENT = 0.5;
/**
 * This fixes some JS rounding errors.
 * E.g., when a full-HP swordsman attack to an 8-HP swordsman with defense bonus, it should deal 8 damage and kill it. However, normal JS math would let him deal only 7 damage.
 * This computation comes to 40.5 / 5.4, which is 7.5, but JS would say 7.499999... Therefore, it would be rounded down to 7, not upt to 8.
 */
const ROUNDING_ERROR = 1e-6;

// Fight conditions

/** If any of the followin options undefined, it isn't available for the fight. **/
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
