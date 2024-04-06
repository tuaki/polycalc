import { useState } from 'react';
import { type FightResult, fight } from '@/types/core/combat';
import { DefenderForm } from '@/components/units/DefenderForm';
import { Button, Card, CardBody } from '@nextui-org/react';
import { AttackerForm } from '@/components/units/AttackerForm';
import { createDefaultDefender } from '@/components/units/useDefender';
import usePreferences from '@/PreferencesProvider';
import { createDefaultAttacker } from '@/components/units/useAttacker';

export function Duel() {
    const { preferences } = usePreferences();
    const [ attacker, setAttacker ] = useState(createDefaultAttacker(preferences.version));
    const [ defender, setDefender ] = useState(createDefaultDefender(preferences.version));
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
                    <AttackerForm unit={attacker} onChange={setAttacker} />
                </CardBody>
            </Card>

            <Card>
                <CardBody>
                    <DefenderForm unit={defender} onChange={setDefender} />
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
