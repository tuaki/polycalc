import { useMemo, useState } from 'react';
import { type FightResult, fight } from '@/types/core/combat';
import { DefenderForm } from '@/components/units/DefenderForm';
import { Card, CardBody } from '@nextui-org/react';
import { AttackerForm } from '@/components/units/AttackerForm';
import { createDefaultDefender } from '@/components/units/useDefender';
import usePreferences from '@/components/preferences/PreferencesProvider';
import { createDefaultAttacker } from '@/components/units/useAttacker';
import { UnitIcon } from '@/components/units/UnitIcon';

export function Duel() {
    const { preferences } = usePreferences();
    const [ attacker, setAttacker ] = useState(createDefaultAttacker(preferences.version));
    const [ defender, setDefender ] = useState(createDefaultDefender(preferences.version));

    const result: FightResult = useMemo(() => fight(attacker, defender), [ attacker, defender ]);

    return (
        <div className='flex flex-col gap-3 max-w-screen-md'>
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
            <Card>
                <CardBody className='flex gap-3'>
                    <div>
                        <span>Attacker:</span>
                        <UnitIcon unit={result.attacker} />
                    </div>
                    <div>
                        <span>Defender:</span>
                        <UnitIcon unit={result.defender} />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
