import usePreferences, { PreferencesProvider } from './components/preferences/PreferencesProvider';
import { Preferences } from './components/preferences/Preferences';
import { ApplicationMode, ModeSelect } from './components/modes/Modes';
import clsx from 'clsx';
import { WikiProvider } from './components/wiki/WikiProvider';
import { WikiModal } from './components/wiki/WikiModal';

function App() {
    return (
        <PreferencesProvider>
            <WikiProvider>
                <InnerApp />
            </WikiProvider>
        </PreferencesProvider>
    );
}

function InnerApp() {
    const { theme, isCollapsed } = usePreferences().preferences;

    return (
        <div className={clsx('pc-layout text-foreground bg-background', isCollapsed && 'pc-preferences-collapsed', theme)}>
            <WikiModal />
            <div className='pc-preferences'>
                <Preferences />
            </div>
            <div className='pc-content p-2 max-md:pt-1 flex flex-col gap-3'>
                <div className='max-md:hidden pc-centered'>
                    <div className='flex justify-center'>
                        <ModeSelect />
                    </div>
                </div>
                <ApplicationMode />
            </div>
        </div>
    );
}

export default App;
