import { type ConditionType, type ConditionMap } from './Condition';
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

    update(health: number, conditions: ConditionMap): Unit {
        return new Unit(this.unitClass, this.variant, health, conditions);
    }

    copy(): Unit {
        return new Unit(this.unitClass, this.variant, this.health, { ...this.conditions });
    }

    get isDead(): boolean {
        return this.health <= 0;
    }

    get maxHealth(): number {
        if (this.variant)
            return this.variant.health;

        return this.unitClass.health! + (this.conditions.veteran ? VETERAN_HEALTH_BONUS : 0);
    }

    get baseAttack(): number {
        return this.unitClass.attack;
    }

    get attack(): number {
        return this.unitClass.attack + (this.conditions.boosted ? BOOST_ADDITION : 0);
    }

    get baseDefense(): number {
        return this.unitClass.defense;
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

    get activeConditions(): ConditionType[] {
        return Object.entries(this.conditions).filter(([ , value ]) => value).map(([ key ]) => key as ConditionType);
    }

    toString(): string {
        const variantString = this.variant ? ` (${this.variant.label})` : '';
        return `${this.unitClass.label}${variantString} ${this.health}/${this.maxHealth}`;
    }

    toStringShort(): string {
        return `${this.unitClass.idShort} ${this.health}/${this.maxHealth}`;
    }
}

/** It's expected that the number has at most one valid decimal place. */
export function decimalNumberToString(number: number): string {
    return (Math.round(number * 10) / 10).toString();
}