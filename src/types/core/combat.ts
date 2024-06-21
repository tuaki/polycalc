import { ConditionType } from './Condition';
import { type Unit } from './Unit';

const DAMAGE_CONSTANT = 4.5;
const INDIRECT_DAMAGE_COEFFICIENT = 0.5;
/**
 * This fixes some JS rounding errors.
 * E.g., when a full-HP swordsman attack to an 8-HP swordsman with defense bonus, it should deal 8 damage and kill it. However, normal JS math would let him deal only 7 damage.
 * This computation comes to 40.5 / 5.4, which is 7.5, but JS would say 7.499999... Therefore, it would be rounded down to 7, not upt to 8.
 */
const ROUNDING_ERROR = 1e-6;

export type FightResult = {
    attacker: Unit;
    defender: Unit;
};

export function fight(attacker: Unit, defender: Unit): FightResult {
    let output = { attacker, defender };
    if (defender.conditions.converted)
        return output;

    output = tryDefenderTentacles(output);

    return basicFight(output);
}


// The tentacle combat works like this:
//  - The defender attackes the attacker first.
//      - The tentacle unit always uses its defense value instead of its attack value.
//      - The attacker doesn't retaliate.
//      - Otherwise, everything works as usual.
//  - Then the attacker attacks the defender. Now everything works as usual.
function tryDefenderTentacles(input: FightResult): FightResult {
    const { attacker, defender } = input;
    const noTentacles =
        !defender.unitClass.skills.tentacles
        || defender.conditions.freezed
        || attacker.conditions.noRetaliation;

    if (noTentacles)
        return input;

    const reverse = basicFight({ attacker: defender, defender: attacker });

    return { attacker: reverse.defender, defender: reverse.attacker };
}

function basicFight({ attacker, defender }: FightResult): FightResult {
    // Indirect attack causes less damage but can't be retaliated.
    const isIndirect = attacker.conditions.indirectAttack
        // An attack with tentacles is always indirect.
        || attacker.unitClass.skills.tentacles;

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
        attacker.conditions.noRetaliation ||
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
