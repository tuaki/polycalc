import { useMemo, useState } from 'react';
import { type FightResult, fight, type FightConditions } from '@/types/core/combat';
import { DefenderForm } from '@/components/units/DefenderForm';
import { Card, CardBody } from '@nextui-org/react';
import { AttackerForm } from '@/components/units/AttackerForm';
import { createDefaultDefender } from '@/components/units/useDefender';
import usePreferences from '@/components/preferences/PreferencesProvider';
import { createDefaultAttacker } from '@/components/units/useAttacker';
import { UnitIcon } from '@/components/units/UnitIcon';

export function Duel() {
    const { units } = usePreferences();
    const [ attacker, setAttacker ] = useState(createDefaultAttacker(units));
    const [ defender, setDefender ] = useState(createDefaultDefender(units));

    const result: FightResult = useMemo(() => {
        const conditions: FightConditions = {
            isBasic: true,
            // isIndirect: attacker.conditions.indirectAttack,
            // isRanged: attacker.conditions.noRetaliation,
            // TODO
        };

        return fight(attacker, defender, conditions);
    }, [ attacker, defender ]);

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
