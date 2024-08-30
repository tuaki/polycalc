import usePreferences from '@/components/preferences/PreferencesProvider';
import { ModeSelect } from '@/components/modes/Modes';
import { TribesMenu } from '@/components/preferences/TribesMenu';
import { VersionSelect } from '@/components/preferences/VersionSelect';
import { Button, Card, CardBody, Switch } from '@nextui-org/react';
import { BsWindowSidebar } from 'react-icons/bs';
import { wiki } from '@/components/wiki/wiki';
import { WikiInfo } from '../wiki/WikiModal';
import { ThemeToggle } from './ThemeToggle';
import { PolycalcLogoIcon } from '../Icons';
import { Tooltip } from '../common';

export function Preferences() {
    const { isCollapsed } = usePreferences().preferences;

    return (
        <div className='flex flex-col gap-3 p-2'>
            <div className='max-md:hidden flex flex-row items-center'>
                <div className='flex-grow shrink overflow-hidden flex flex-row items-center gap-2 font-semibold'>
                    <PolycalcLogoIcon className='shrink-0' />
                    PolyCalc
                    <div className='flex-grow' />
                    <div className='pe-2'>
                        <ThemeToggle />
                    </div>
                </div>
                <CollapsePreferencesToggle />
            </div>
            <div className='md:hidden grid grid-cols-3'>
                <div className='flex flex-row items-center gap-2 font-semibold'>
                    <PolycalcLogoIcon className='shrink-0' />
                    PolyCalc
                </div>
                <div className='flex justify-center'>
                    <div className='max-[450px]:hidden'>
                        <ModeSelect />
                    </div>
                </div>
                <div className='flex justify-end gap-2'>
                    <ThemeToggle />
                    <CollapsePreferencesToggle />
                </div>
                <div className='min-[450px]:hidden col-span-3 flex justify-center pt-3'>
                    <ModeSelect />
                </div>
            </div>
            {!isCollapsed && (<>
                <WikiInfo type={wiki.root} label='Help' />
                <VersionSelect />
                <TribesMenu />
                <MoreSettings />
            </>)}
        </div>
    );
}

function CollapsePreferencesToggle() {
    const { preferences, setPreferences } = usePreferences();
    const { isCollapsed } = preferences;
    const label = isCollapsed ? 'Expand sidebar' : 'Collapse sidebar';

    return (
        <Tooltip content={label}>
            <Button
                isIconOnly
                aria-label={label}
                onPress={() => setPreferences({ ...preferences, isCollapsed: !isCollapsed })}
                variant='faded'
            >
                <BsWindowSidebar size={22} />
            </Button>
        </Tooltip>
    );
}

function MoreSettings() {
    const { preferences, setPreferences } = usePreferences();

    return (
        <Card>
            <CardBody className='overflow-hidden gap-2'>
                <Switch
                    size='sm'
                    isSelected={preferences.isIconsHidden}
                    onValueChange={value => setPreferences({ ...preferences, isIconsHidden: value })}
                >
                    Hide icons
                </Switch>
                <Switch
                    size='sm'
                    isSelected={preferences.isTooltipsHidden}
                    onValueChange={value => setPreferences({ ...preferences, isTooltipsHidden: value })}
                >
                    Hide tooltips
                </Switch>
            </CardBody>
        </Card>
    );
}
