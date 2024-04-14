import usePreferences, { PreferencesProvider } from './PreferencesProvider';
import { Duel } from './pages/Duel';
import { Brawl } from './pages/Brawl';
import { Preferences } from './pages/Preferences';
import { ModeSelect } from './components/preferences/ModeSelect';

function App() {
    return (
        <PreferencesProvider>
            <div className='p-4 gap-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-6'>
                <div>
                    <Preferences />
                </div>
                <div className='md:col-start-2 2xl:col-span-5 flex flex-col gap-3'>
                    <ModeSelect />
                    <ApplicationMode />
                </div>
            </div>
        </PreferencesProvider>
    );
}

function ApplicationMode() {
    const { preferences } = usePreferences();

    return preferences.modeId === 'duel' ? <Duel /> : <Brawl />;
}

export default App;
