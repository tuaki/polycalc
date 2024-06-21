import { type Wiki, getWikiPageDetailFromRoot, type WikiPage } from '@/types/core/Wiki';

export function getWikiPageDetail(path: string) {
    return getWikiPageDetailFromRoot(path, wikiPages);
}

const GITHUB_URL = import.meta.env.VITE_GITHUB_URL;

function Duel() {
    return (<>
        <h1>Duel mode</h1>
        <p>
            Work in progress ...
        </p>
    </>);
}

function Brawl() {
    return (<>
        <h1>Brawl mode</h1>
        <p>
            Work in progress ...
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

function Issues() {
    return (<>
        <h1>Known issues</h1>
        <h2>Incorrect splas damage</h2>
        <p>
            In some cases involving <b>splash damage</b>, the game doesn{'\''}t compute the damage correctly. This includes explicitly <b>splash damage</b> units (<i>Bomber, Dragon, and Juggernaut</i>), but also <b>exploding</b> units (<i>Raychi, Doomux, and Segment</i>), and <b>tentacle</b> units (<i>Yelly Belly</i>). In such cases, this calculator isn{'\''}t able to provide the same results as the game.
        </p>
        <p>
            <h3>Examples</h3>
            <ul>
                <li>
                    Rammer (<span className='pc-hp'>10 HP</span>) moves next to Yelly Belly. The Rammer goes to <span className='pc-hp'>7 HP</span> (as it should), but the game shows <span className='pc-hp'>4 damage</span> was dealt. You can see it in{' '}
                    <a href='https://www.youtube.com/watch?v=omXhGmJJgJo</span>t=188s' target='_blank' rel='noreferrer'>this video</a>.
                    This might seem like just a visual bug, however,{' '}
                    <a href='https://www.youtube.com/watch?v=omXhGmJJgJo</span>t=203s' target='_blank' rel='noreferrer'>a little later</a>,
                    a Yelly Belly (<span className='pc-hp'>5 HP</span>) moves next to a Rammer (<span className='pc-hp'>7 HP</span>). The game shows that the Rammer takes <span className='pc-hp'>2 damage</span> (which si correct), but it goes to <span className='pc-hp'>4 HP</span> instead of <span className='pc-hp'>5 HP</span>.
                </li>
                <li>
                    Fire dragon (<span className='pc-hp'>20 HP</span>) attacks (with splash) a Defender (<span className='pc-hp'>9 HP</span>, defense bonus). The game shows that <span className='pc-hp'>6 damage</span> was dealt (not correct), but the Defender ends up on <span className='pc-hp'>4 HP</span> (correct). However, such Defender can be then killed by a <span className='pc-hp'>4 HP</span> Fire dragon, which shouln{'\''}t be possible.
                </li>
            </ul>
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
        issues: {
            title: 'Issues',
            content: <Issues />,
        },
    },
} as const satisfies WikiPage;

export const wiki = {
    root: '/',
    duel: '/duel',
    brawl: '/brawl',
    about: '/about',
    issues: '/issues',
} as const satisfies Wiki<typeof wikiPages>;
