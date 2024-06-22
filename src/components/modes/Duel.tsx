import { useMemo, useState } from 'react';
import { type FightResult, fight, type FightConditions, createFightConditions, updateFightConditions } from '@/types/core/combat';
import { DefenderForm } from '@/components/units/DefenderForm';
import { Card, CardBody } from '@nextui-org/react';
import { AttackerForm } from '@/components/units/AttackerForm';
import { createDefaultDefender } from '@/components/units/useDefender';
import usePreferences from '@/components/preferences/PreferencesProvider';
import { createDefaultAttacker } from '@/components/units/useAttacker';
import { UnitIcon } from '@/components/units/UnitIcon';
import { type Unit } from '@/types/core/Unit';
import { TextFightForm } from './FightForm';

type DuelState = {
    attacker: Unit;
    defender: Unit;
    conditions: FightConditions;
};

export function Duel() {
    const { units } = usePreferences();
    const [ state, setState ] = useState<DuelState>(() => {
        const attacker = createDefaultAttacker(units);
        const defender = createDefaultDefender(units);
        return { attacker, defender, conditions: createFightConditions(attacker, defender) };
    });

    const set = useMemo(() => ({
        attacker: (attacker: Unit) => {
            setState(state => ({ ...state, attacker, conditions: createFightConditions(attacker, state.defender, state.conditions) }));
        },
        defender: (defender: Unit) => {
            setState(state => ({ ...state, defender, conditions: createFightConditions(state.attacker, defender, state.conditions) }));
        },
        conditions: (toggle: keyof FightConditions) => {
            setState(state => ({ ...state, conditions: updateFightConditions(state.conditions, toggle) }));
        },
    }), []);

    const result: FightResult = useMemo(() => fight(state.attacker, state.defender, state.conditions), [ state ]);

    return (
        <div className='flex flex-col gap-3 max-w-screen-md'>
            <Card>
                <CardBody>
                    <AttackerForm unit={state.attacker} onChange={set.attacker} />
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <DefenderForm unit={state.defender} onChange={set.defender} />
                </CardBody>
            </Card>
            <Card>
                <CardBody className='grid grid-cols-4 gap-3'>
                    <div>
                        <span>Attacker:</span>
                        <UnitIcon unit={result.attacker} />
                    </div>
                    <div>
                        <span>Defender:</span>
                        <UnitIcon unit={result.defender} />
                    </div>
                    <div className='col-span-2'>
                        <TextFightForm value={state.conditions} onChange={set.conditions} attacker={state.attacker} />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
