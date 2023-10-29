import { useState } from 'react';
import { UNITS } from '../types/core/UnitClass';
import { type AttackerSettings, Unit, type DefenderSettings } from '../types/core/Unit';
import { type FightResult, fight } from '../types/core/combat';
import { AttackerForm, DefenderForm } from '../components/unitForm';
import { Button, Card, CardBody } from '@nextui-org/react';

export function Duel() {
    const [ attackerSettings, setAttackerSettings ] = useState(defaultAttacker);
    const [ defenderSettings, setDefenderSettings ] = useState(defaultDefender);

    const [ result, setResult ] = useState<FightResult>();

    function combat() {
        const attacker = Unit.createAttacker(attackerSettings);
        const defender = Unit.createDefender(defenderSettings);
        setResult(fight(attacker, defender));
    }

    return (
        <div className='flex flex-col gap-3'>
            <Card>
                <CardBody>
                    <h1>Duel</h1>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <AttackerForm input={attackerSettings} onChange={setAttackerSettings} />
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <DefenderForm input={defenderSettings} onChange={setDefenderSettings} />
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