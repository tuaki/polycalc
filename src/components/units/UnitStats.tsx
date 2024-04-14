import { decimalNumberToString, type Unit } from '@/types/core/Unit';
import { HiOutlineArrowRight } from 'react-icons/hi';

type UnitStatsProps = Readonly<{
    unit: Unit;
}>;

export function UnitStats({ unit }: UnitStatsProps) {
    const attackDiff = unit.attack - unit.baseAttack;
    const defenseDiff = unit.defense - unit.baseDefense;

    return (
        <div className='grid grid-cols-2 gap-1 text-small'>
            <div>
                Attack:
            </div>
            <div className='flex items-center gap-2'>
                {unit.baseAttack}
                {attackDiff !== 0 && (<>
                    <HiOutlineArrowRight />
                    <span className={attackDiff > 0 ? 'text-success' : 'text-danger'}>{decimalNumberToString(unit.attack)}</span>
                </>)}
            </div>
            <div>
                Defense:
            </div>
            <div className='flex items-center gap-2'>
                {unit.baseDefense}
                {defenseDiff !== 0 && (<>
                    <HiOutlineArrowRight />
                    <span className={defenseDiff > 0 ? 'text-success' : 'text-danger'}>{decimalNumberToString(unit.defense)}</span>
                </>)}
            </div>
        </div>
    );
}
