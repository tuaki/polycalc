import { PreferencesProvider } from './PreferencesProvider';
import { Duel } from './pages/Duel';
import { Preferences } from './pages/Preferences';

function App() {
    return (
        <PreferencesProvider>
            <div className='p-4 gap-4 grid md:grid-cols-2 2xl:grid-cols-3'>
                <div>
                    <Preferences />
                </div>
                <div className='md:col-start-2'>
                    <Duel />
                </div>
            </div>
        </PreferencesProvider>
    );
}

export default App;
