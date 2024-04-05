import { ConditionType } from './Condition';
import { type Unit } from './Unit';

const DAMAGE_CONSTANT = 4.5;
const SPLASH_DAMAGE_COEFFICIENT = 0.5;
const ROUNDING_ERROR = 1e-6;

export type FightResult = {
    attacker: Unit;
    defender: Unit;
};

export function fight(attacker: Unit, defender: Unit): FightResult {
    const attackForce = attacker.attack * (attacker.health / attacker.maxHealth);
    const defenseForce = defender.defense * (defender.health / defender.maxHealth);
    const totalForce = attackForce + defenseForce;

    const attackerDamageBeforeSplash = Math.round((attackForce / totalForce) * attacker.attack * DAMAGE_CONSTANT + ROUNDING_ERROR);
    const attackerDamage = attacker.conditions.indirectAttack
        ? Math.floor(attackerDamageBeforeSplash * SPLASH_DAMAGE_COEFFICIENT)
        : attackerDamageBeforeSplash;
        
    const defenderDamage = Math.round((defenseForce / totalForce) * defender.defense * DAMAGE_CONSTANT + ROUNDING_ERROR);

    const newDefenderConditions = {
        ...defender.conditions,
        [ConditionType.Boosted]: false,
        [ConditionType.Freezed]: attacker.unitClass.skills.freeze,
        [ConditionType.Poisoned]: attacker.unitClass.skills.poison,
        [ConditionType.Converted]: attacker.unitClass.skills.convert,
    };

    const newDefender = defender.update(defender.health - attackerDamage, newDefenderConditions);
    const noRetaliation =
        newDefender.isDead ||
        newDefender.conditions.freezed ||
        newDefender.conditions.converted ||
        newDefender.unitClass.skills.stiff ||
        attacker.unitClass.skills.surprise ||
        attacker.conditions.noRetaliation ||
        attacker.conditions.indirectAttack;

    const newAttackerHealth = noRetaliation ? attacker.health : attacker.health - defenderDamage;
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
