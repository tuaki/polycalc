import { TribesMenu } from '@/components/preferences/TribesMenu';
import { VersionSelect } from '@/components/preferences/VersionSelect';

export function Preferences() {
    return (
        <div className='flex flex-col gap-3'>
            <VersionSelect />
            <TribesMenu />
        </div>
    );
}
