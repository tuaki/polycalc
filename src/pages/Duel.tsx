import { useState } from 'react';
import { type Unit } from '@/types/core/Unit';
import { type FightResult, fight } from '@/types/core/combat';
import { DefenderForm } from '@/components/units/DefenderForm';
import { Button, Card, CardBody } from '@nextui-org/react';
import { AttackerForm } from '@/components/units/AttackerForm';

export function Duel() {
    const [ attacker, setAttacker ] = useState<Unit>();
    const [ defender, setDefender ] = useState<Unit>();
    const [ result, setResult ] = useState<FightResult>();


    function combat() {
        if (!attacker || !defender)
            return;

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
                    <AttackerForm onChange={setAttacker} />
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <DefenderForm onChange={setDefender} />
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
