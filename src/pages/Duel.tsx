import { useEffect, useState } from 'react';
import { type UnitClass } from '@/types/core/UnitClass';
import { Unit, type DefenderSettings } from '@/types/core/Unit';
import { type FightResult, fight } from '@/types/core/combat';
import { DefenderForm } from '@/components/units/unitForm';
import { Button, Card, CardBody } from '@nextui-org/react';
import usePreferences from '@/PreferencesProvider';
import { type Version } from '@/types/core/Version';
import AttackerForm from '@/components/units/AttackerForm';

export function Duel() {
    const { preferences } = usePreferences();
    const defaultClass = preferences.version.getDefaultClass();
    const [ defenderSettings, setDefenderSettings ] = useState(() => createNewDefender(defaultClass));

    useEffect(() => {
        setDefenderSettings(old => updateDefender(old, preferences.version));
    }, [ preferences.version ]);

    const [ attacker, setAttacker ] = useState<Unit>();
    const [ result, setResult ] = useState<FightResult>();


    function combat() {
        if (!attacker)
            return;

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
                    <AttackerForm onChange={setAttacker} />
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

function createNewDefender(unitClass: UnitClass): DefenderSettings {
    return {
        unitClass,
        health: unitClass.getDefaultHealth(),
        bonus: 'none',
    };
}

function updateDefender(unit: DefenderSettings, newVersion: Version): DefenderSettings {
    const newClass = newVersion.getClass(unit.unitClass.id);
    if (newClass === unit.unitClass)
        return unit;

    const unitClass = newClass ?? newVersion.getDefaultClass();
    return {
        unitClass,
        health: Math.min(unit.health, unitClass.getDefaultHealth()),
        bonus: unit.bonus,
    };
}
