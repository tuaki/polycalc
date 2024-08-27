import { type FightConditions, fight } from '@/types/core/combat';
import { Card, CardBody } from '@nextui-org/react';
import { UnitIcon } from '../units/UnitIcon';
import { UnitsCache } from '@/types/core/Version';
import clsx from 'clsx';
import { VERSIONS } from '@/types/core/UnitClass';

export function Tests() {
    const units = new UnitsCache(VERSIONS['aquarion-rework'], []);

    return (
        <Card className='pc-fit-min-800 mx-auto'>
            <CardBody className='gap-1'>
                {fights.map((fight, index) => (
                    <TestFight key={index} data={fight} units={units} />
                ))}
            </CardBody>
        </Card>
    );
}

type TestFightProps = Readonly<{
    data: TestFightData;
    units: UnitsCache;
}>;

function TestFight({ data, units }: TestFightProps) {
    const attacker = units.tryParse(data.input.attacker);
    const defender = units.tryParse(data.input.defender);
    if (!attacker || !defender)
        throw new Error(`Can't parse units. Attacker: '${data.input.attacker}', defender: '${data.input.defender}'.`);

    const result = fight(attacker, defender, data.conditions);

    const attackerDamage = attacker.health - result.attacker.health;
    const defenderDamage = defender.health - result.defender.health;
    const isAttackerCorrect = attackerDamage === data.damage.attacker;
    const isDefenderCorrect = defenderDamage === data.damage.defender;

    return (
        <div className='flex'>
            <div className='w-1/3 flex items-center gap-8'>
                <UnitIcon unit={attacker} />
                <UnitIcon unit={defender} />
            </div>
            <div className='w-1/3 flex items-center'>
                expected:
                <span className='w-8 text-end'>{data.damage.attacker}</span>
                <span className='w-8 text-end'>{data.damage.defender}</span>
            </div>
            <div className='w-1/3 flex items-center'>
                actual:
                <span className={clsx('w-8 text-end', isAttackerCorrect ? 'text-success' : 'text-danger')}>{attackerDamage}</span>
                <span className={clsx('w-8 text-end', isDefenderCorrect ? 'text-success' : 'text-danger')}>{defenderDamage}</span>
            </div>
        </div>
    );
}

type TestFightData = {
    input: {
        attacker: string;
        defender: string;
    };
    conditions: FightConditions;
    damage: {
        attacker: number;
        defender: number;
    };
};

const fights: TestFightData[] = [
    'je15, je15, 5, 5',
    'je10, je10, 5, 5',
    'je5, je5, 5, 5',

    'je20, je20d, 5, 4',
    'je15, je16d, 5, 3',
    'je10, je13d, 5, 3',
    'je5, je10d, 6, 2',

    'je20d, je20, 4, 5',
    'je16d, je15, 3, 5',
    'je13d, je10, 3, 5',
    'je10d, je5, 2, 6',

    'wr10, je20, 5, 3',
    'wr10, je17, 4, 4',
    'wr10, je13, 4, 4',
    'wr10, je9, 3, 5',
    'wr10, je4, 2, 7',

    'wr10d, je20, 4, 3',
    'wr10d, je17, 3, 4',
    'wr10d, je13, 3, 5',
    'wr10d, je8, 2, 6',
    'wr10d, je2, 1, 8',

    'wr10, je20d, 5, 2',
    'wr10, je18d, 4, 3',
    'wr10, je15d, 4, 3',
    'wr10, je12d, 3, 4',
    'wr10, je8d, 3, 5',
    'wr10, je3d, 1, 7',

    'rd10, je20, 6, 3',
    'rd10, je17, 6, 3',
    'rd10, je14, 5, 4',
    'rd10, je10, 5, 5',
    'rd10, je5, 3, 7',

    'rd10d, je20, 5, 3',
    'rd10d, je17, 5, 3',
    'rd10d, je14, 4, 4',
    'rd10d, je10, 4, 5',
    'rd10d, je5, 2, 7',

    'rd10, je20d, 6, 2',
    'rd10, je18d, 6, 2',
    'rd10, je16d, 6, 2',
    'rd10, je14d, 5, 3',
    'rd10, je11d, 5, 3',
    'rd10, je8d, 4, 5',
    'rd10, je3d, 2, 7',
].map(unitTest);

function unitTest(input: string): TestFightData {
    const split = input.split(',');

    return {
        input: { attacker: split[0], defender: split[1] },
        conditions: { isBasic: true, isTentacles: true },
        damage: { attacker: Number.parseInt(split[2]), defender: Number.parseInt(split[3]) },
    };
}
