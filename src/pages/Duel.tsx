import { useEffect, useState } from 'react';
import { type UnitClass } from '@/types/core/UnitClass';
import { type AttackerSettings, Unit, type DefenderSettings } from '@/types/core/Unit';
import { type FightResult, fight } from '@/types/core/combat';
import { AttackerForm, DefenderForm } from '@/components/unitForm';
import { Button, Card, CardBody } from '@nextui-org/react';
import usePreferences from '@/PreferencesProvider';
import { type Version } from '@/types/core/Version';

export function Duel() {
    const { preferences } = usePreferences();
    const defaultClass = preferences.version.getDefaultClass();
    const [ attackerSettings, setAttackerSettings ] = useState(() => createNewAttacker(defaultClass));
    const [ defenderSettings, setDefenderSettings ] = useState(() => createNewDefender(defaultClass));

    useEffect(() => {
        setAttackerSettings(old => updateAttacker(old, preferences.version));
        setDefenderSettings(old => updateDefender(old, preferences.version));
    }, [ preferences.version ]);

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

function createNewAttacker(unitClass: UnitClass): AttackerSettings {
    return {
        unitClass,
        health: unitClass.getDefaultHealth(),
        isBoosted: false,
    };
}

function createNewDefender(unitClass: UnitClass): DefenderSettings {
    return {
        unitClass,
        health: unitClass.getDefaultHealth(),
        bonus: 'none',
    };
}

function updateAttacker(unit: AttackerSettings, newVersion: Version): AttackerSettings {
    const newClass = newVersion.getClass(unit.unitClass.id);
    if (newClass === unit.unitClass)
        return unit;

    const unitClass = newClass ?? newVersion.getDefaultClass();
    return {
        unitClass,
        health: Math.min(unit.health, unitClass.getDefaultHealth()),
        isBoosted: unit.isBoosted,
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
