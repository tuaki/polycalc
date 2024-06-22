import usePreferences from '@/components/preferences/PreferencesProvider';
import { ModeSelect } from '@/components/modes/Modes';
import { TribesMenu } from '@/components/preferences/TribesMenu';
import { VersionSelect } from '@/components/preferences/VersionSelect';
import { Button, Card, CardBody, Switch } from '@nextui-org/react';
import { BsWindowSidebar } from 'react-icons/bs';
import { wiki } from '@/components/wiki/wikiPages';
import { WikiInfo } from '../wiki/WikiModal';
import { ThemeToggle } from './ThemeToggle';
import { PolycalcLogoIcon } from '../Icons';

export function Preferences() {
    const { isCollapsed } = usePreferences().preferences;

    return (
        <div className='flex flex-col gap-3 p-2'>
            <div className='max-md:hidden flex flex-row items-center'>
                <div className='flex-grow flex-shrink overflow-hidden flex flex-row items-center gap-2 font-semibold'>
                    <PolycalcLogoIcon />
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
                    <PolycalcLogoIcon />
                    PolyCalc
                </div>
                <div className='flex justify-center'>
                    <ModeSelect />
                </div>
                <div className='flex justify-end gap-2'>
                    <ThemeToggle />
                    <CollapsePreferencesToggle />
                </div>
            </div>
            {!isCollapsed && (<>
                <VersionSelect />
                <TribesMenu />
                <HideIconsSwitch />
                <WikiInfo type={wiki.root} />
            </>)}
        </div>
    );
}

function CollapsePreferencesToggle() {
    const { preferences, setPreferences } = usePreferences();
    const { isCollapsed } = preferences;

    return (
        <Button
            isIconOnly
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setPreferences({ ...preferences, isCollapsed: !isCollapsed })}
            variant='faded'
        >
            <BsWindowSidebar size={22} />
        </Button>
    );
}

function HideIconsSwitch() {
    const { preferences, setPreferences } = usePreferences();

    return (
        <Card>
            <CardBody className='overflow-hidden'>
                <Switch
                    size='sm'
                    isSelected={preferences.isIconsHidden}
                    onValueChange={value => setPreferences({ ...preferences, isIconsHidden: value })}

                >
                    Hide icons
                </Switch>
            </CardBody>
        </Card>
    );
}
