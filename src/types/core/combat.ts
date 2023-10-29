import { ConditionType } from './Condition';
import { type Unit } from './Unit';

const DAMAGE_CONSTANT = 4.5;

export type FightResult = {
    attacker: Unit;
    defender: Unit;
};

export function fight(attacker: Unit, defender: Unit): FightResult {
    const attackForce = attacker.attack * (attacker.health / attacker.maxHealth);
    const defenseForce = defender.defense * (defender.health / defender.maxHealth);
    const totalForce = attackForce + defenseForce;

    const attackerDamage = Math.round((attackForce / totalForce) * attacker.attack * DAMAGE_CONSTANT);
    const defenderDamage = Math.round((defenseForce / totalForce) * defender.defense * DAMAGE_CONSTANT);

    const newDefenderConditions = {
        ...defender.conditions,
        [ConditionType.Boosted]: false,
        [ConditionType.Freezed]: attacker.unitClass.skills.freeze,
        [ConditionType.Poisoned]: attacker.unitClass.skills.poison,
    };

    const newDefender = defender.update(defender.health - attackerDamage, newDefenderConditions);

    const noRetaliation = defender.isDead || defender.conditions.freezed || attacker.unitClass.skills.surprise || attacker.conditions.noRetaliation;
    const newAttackerConditions = {
        ...attacker.conditions,
        [ConditionType.Boosted]: false,
    };
    if (!noRetaliation)
        newAttackerConditions[ConditionType.Poisoned] = defender.unitClass.skills.poison;

    const newAttacker = attacker.update(attacker.health - defenderDamage, newAttackerConditions);

    return {
        attacker: newAttacker,
        defender: newDefender,
    };
}
