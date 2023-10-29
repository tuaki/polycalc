import { useState } from 'react';
import { UNITS } from '../types/core/UnitClass';
import { type AttackerSettings, Unit, type DefenderSettings } from '../types/core/Unit';
import { createConditionMap } from '../types/core/Condition';
import { type FightResult, fight } from '../types/core/combat';
import { AttackerForm, DefenderForm } from '../components/unitForm';
import { Button, Card, CardBody } from '@nextui-org/react';

export function Duel() {
    const [ attacker, setAttacker ] = useState(defaultAttacker);
    const [ defender, setDefender ] = useState(defaultDefender);

    const [ result, setResult ] = useState<FightResult>();

    function combat() {
        const attackerUnit = new Unit(attacker.unitClass, undefined, attacker.health, createConditionMap([]));
        const defenderUnit = new Unit(defender.unitClass, undefined, defender.health ?? 0, createConditionMap([]));
        setResult(fight(attackerUnit, defenderUnit));
    }

    return (
        <div className='content flex flex-col gap-3'>
            <h1>Duel</h1>
            <Card>
                <CardBody>
                    <AttackerForm input={attacker} onChange={setAttacker} />
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <DefenderForm input={defender} onChange={setDefender} />
                </CardBody>
            </Card>
            <div className='flex justify-center'>
                <Button onClick={combat}>
                    Go!
                </Button>
            </div>
            {result && (
                <Card>
                    <CardBody>
                        Attacking unit: {result.attacker.health}
                        <br />
                        Defending unit: {result.defender.health}
                    </CardBody>
                </Card>
            )}
        </div>
    );
}

function createNewAttacker(): AttackerSettings {
    const unitClass = UNITS[0];

    return {
        unitClass,
        health: unitClass.health ?? 0,
        isBoosted: false,
    };
}

const defaultAttacker = createNewAttacker();

function createNewDefender(): DefenderSettings {
    const unitClass = UNITS[0];

    return {
        unitClass,
        health: unitClass.health ?? 0,
        bonus: 'none',
    };
}

const defaultDefender = createNewDefender();