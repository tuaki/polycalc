import { createConditionMap, type ConditionMap, ConditionType } from './Condition';
import { type UnitVariant, type UnitClass } from './UnitClass';

export const VETERAN_HEALTH_BONUS = 5;
export const DEFENSE_BONUS_MULTIPLIER = 1.5;
export const WALL_BONUS_MULTIPLIER = 4;
export const POISON_MULTIPLIER = 0.7;
export const BOOST_ADDITION = 0.5;

export class Unit {
    constructor(
        readonly unitClass: UnitClass,
        readonly variant: UnitVariant | undefined,
        readonly health: number,
        readonly conditions: ConditionMap,
    ) {}

    static createDefender(init: DefenderSettings) {
        return new Unit(init.unitClass, undefined, init.health, createConditionMap({
            [ConditionType.DefenseBonus]: init.bonus === 'defense',
            [ConditionType.WallBonus]: init.bonus === 'wall',
        }));
    }

    update(health: number, conditions: ConditionMap): Unit {
        return new Unit(this.unitClass, this.variant, health, conditions);
    }

    get isDead(): boolean {
        return this.health <= 0;
    }

    get maxHealth(): number {
        if (this.variant)
            return this.variant.health;

        return this.unitClass.health! + (this.conditions.veteran ? VETERAN_HEALTH_BONUS : 0);
    }

    get attack(): number {
        return this.unitClass.attack + (this.conditions.boosted ? BOOST_ADDITION : 0);
    }

    get defense(): number {
        if (this.conditions.poisoned)
            return this.unitClass.defense * POISON_MULTIPLIER;

        if (this.conditions.wallBonus)
            return this.unitClass.defense * WALL_BONUS_MULTIPLIER;

        if (this.conditions.defenseBonus)
            return this.unitClass.defense * DEFENSE_BONUS_MULTIPLIER;

        return this.unitClass.defense;
    }
}

type CommonSettings = {
    unitClass: UnitClass;
    health: number;
}

export type BonusType = 'none' | 'defense' | 'wall';
export type DefenderSettings = CommonSettings & {
    bonus: BonusType;
}