import { ModeSelect } from '@/components/preferences/ModeSelect';
import { TribesMenu } from '@/components/preferences/TribesMenu';
import { VersionSelect } from '@/components/preferences/VersionSelect';
import { Card, CardBody } from '@nextui-org/react';

export function Preferences() {
    return (
        <div className='flex flex-col gap-3'>
            <Card>
                <CardBody className='grid grid-cols-3 gap-3'>
                    <div className='col-span-2'>
                        <VersionSelect />
                    </div>
                    <div>
                        <ModeSelect />
                    </div>
                </CardBody>
            </Card>
            <div className='grid 2xl:grid-cols-2'>
                <TribesMenu />
                <div />
            </div>
        </div>
    );
}
