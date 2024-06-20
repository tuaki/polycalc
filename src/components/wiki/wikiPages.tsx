import { type Wiki, getWikiPageDetailFromRoot, type WikiPage } from '../../types/core/Wiki';

export function getWikiPageDetail(path: string) {
    return getWikiPageDetailFromRoot(path, wikiPages);
}

const GITHUB_URL = import.meta.env.VITE_GITHUB_URL;

function Duel() {
    return (<>
        <h1>Duel mode</h1>
        <p>
            TODO
        </p>
    </>);
}

function Brawl() {
    return (<>
        <h1>Brawl mode</h1>
        <p>
            TODO
        </p>
    </>);
}

function Settings() {
    return (<>
        <h1>Settings</h1>
        <p>
            All settings are stored in your browser and will be remembered the next time you visit the site.
        </p>
        <h2>Version</h2>
        <p>
            As the game is updated, new units are added and old units are changed. Make sure you always have the correct version selected so that the calculations are accurate.
        </p>
        <p>
            Whenever this option change, all currently selected units are replaced with their equivalent in the new version. If a unit doesn{'\''}t exist in the new version, it will be replaced by a default one instead.
        </p>
        <h2>Tribes</h2>
        <p>
            This option allows you to limit the amount of units in the select boxes so you can find the units you want faster. If none tribes are selected, all units in the game will be shown.
        </p>
        <h2>Hide icons</h2>
        <p>
            If you don{'\''}t like the units{'\''} icons, you can hide them with this option.
        </p>
    </>);
}

function About() {
    return (<>
        <h1>About</h1>
        <p>
            Star the app on <a href={GITHUB_URL} target='_blank' rel='noreferrer'>GitHub</a>! If you have any feedback or suggestions, feel free to open an issue or a pull request.
        </p>
    </>);
}

const wikiPages = {
    title: 'Home',
    content: 'PolyCalc wiki',
    children: {
        settings: {
            title: 'Settings',
            content: <Settings />,
        },
        duel: {
            title: 'Duel',
            content: <Duel />,
        },
        brawl: {
            title: 'Brawl',
            content: <Brawl />,
        },
        about: {
            title: 'About',
            content: <About />,
        },
    },
} as const satisfies WikiPage;

export const wiki = {
    root: '/',
    duel: '/duel',
    brawl: '/brawl',
    about: '/about',
} as const satisfies Wiki<typeof wikiPages>;
