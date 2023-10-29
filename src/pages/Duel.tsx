import { useState } from 'react';
import { UNITS, type UnitClass } from '../types/core/UnitClass';
import { Unit } from '../types/core/Unit';
import { createConditionMap } from '../types/core/Condition';
import { type FightResult, fight } from '../types/core/combat';

export function Duel() {
    const [ attackerClass, setAttackerClass ] = useState<UnitClass>(UNITS[0]);
    const [ defenderClass, setDefenderClass ] = useState<UnitClass>(UNITS[0]);
    const [ result, setResult ] = useState<FightResult>();

    function combat() {
        const attacker = new Unit(attackerClass, undefined, attackerClass.health ?? 0, createConditionMap([]));
        const defender = new Unit(defenderClass, undefined, defenderClass.health ?? 0, createConditionMap([]));
        setResult(fight(attacker, defender));
    }

    return (
        <div>
            <h1>Duel</h1>
            <p>
                <label>Attacker</label><br />
                <select
                    value={attackerClass.id}
                    onChange={e => setAttackerClass(findUnit(e.target.value))}
                >
                    {UNITS.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.label}</option>
                    ))}
                </select>
            </p>
            <p>
                <label>Defender</label><br />
                <select
                    value={defenderClass.id}
                    onChange={e => setDefenderClass(findUnit(e.target.value))}
                >
                    {UNITS.map(unit => (
                        <option key={unit.id} value={unit.id}>{unit.label}</option>
                    ))}
                </select>
            </p>
            <p>
                <button onClick={combat}>Go!</button>
            </p>
            {result && (<p>
                {result.attacker.health}
                <br />
                {result.defender.health}
            </p>)}
        </div>
    );
}

function findUnit(id: string): UnitClass {
    return UNITS.find(unit => unit.id === id)!;
}