import TribesMenu from '@/components/preferences/TribesMenu';
import VersionSelect from '@/components/preferences/VersionSelect';

export function Preferences() {
    return (
        <div className='flex flex-col gap-3'>
            <VersionSelect />
            <div className='grid 2xl:grid-cols-2'>
                <TribesMenu />
                <div />
            </div>
        </div>
    );
}
