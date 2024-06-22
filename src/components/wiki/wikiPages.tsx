import { type Wiki, getWikiPageDetailFromRoot, type WikiPage } from '@/types/core/Wiki';
import { WikiLink } from './WikiModal';

export function getWikiPageDetail(path: string) {
    return getWikiPageDetailFromRoot(path, wikiPages);
}

const GITHUB_URL = import.meta.env.VITE_GITHUB_URL;

function Root() {
    return (<>
        <h1>PolyCalc</h1>
        <p>
            This is an <i>unofficial</i> calculator for the game <a href='https://play.google.com/store/apps/details?id=air.com.midjiwan.polytopia' target='_blank' rel='noreferrer'>The Battle of Polytopia</a>. Because of this, some calculations might not be 100% accurate (see <WikiLink type={wiki.issues} />).
        </p>
        <p>
            As of now, there are two modes available: <WikiLink type={wiki.duel} /> for simple one-on-one calculations, and <WikiLink type={wiki.brawl} /> for more complex scenarios. You can also change the <WikiLink type={wiki.settings} /> to customize your experience.
        </p>
    </>);
}

function Duel() {
    return (<>
        <h1>Duel mode</h1>
        <p>
            A simple combat between two units according to the standard <a href='https://polytopia.fandom.com/wiki/Combat#Damage_Formula' target='_blank' rel='noreferrer'>damage formula</a>.
        </p>
        <h2>Unit form</h2>
        <p>
            First, select the unit class (and variant if it{'\''}s a ship). If the chain icon is on, the health will automatically change to the maximum possible value. Next, select the various conditions that might affect the combat. Some conditions are only available for certain units. Some are mutually exclusive. Conditions with no impact on the combat aren{'\''}t included. On the right, you can see the unit{'\''}s stats (before and after the conditions were applied).
        </p>
        <h2>Results</h2>
        <p>
            The units after the fight are shown below. They might have new conditions symbolized by colored letters. Hover over them to see what they mean. On the right, you can specify some some additional parameters of the fight, e.g., whether to use splash or normal damage for the Fire dragon.
        </p>
        <p>
            Need to simulate a fight with more units? Try the <WikiLink type={wiki.brawl} /> mode!
        </p>
    </>);
}

function Brawl() {
    return (<>
        <h1>Brawl mode</h1>
        <p>
            Each column represents an attacker, and each row represents a defender. Above the grids are the attackers before the combat (you can edit them by clicking on them, and you can swap them with the arrow buttons), while under the grid are the attackers after the combat. The same applies to the defenders.
        </p>
        <p>
            Each cell represents a fight between the attacker and the defender. The number here is the defender{'\''}s health after the fight. There are also several toggle buttons. The most important one decides whether the fight actually takes place. The others are for additional parameters of the fight (same as in the <WikiLink type={wiki.duel} /> mode). They will show up once there are units with special skills. If one or both of the units are dead, you will se only a skull icon, indicating that the fight is impossible.
        </p>
        <h2>Fight resolution</h2>
        <p>
            A defender can participate in multiple fights, which are applied from the left to the right. You can easily reorder the attackers to see which configurations works the best. On the contrary, an attacker can fight only once. There are, however, some exceptions:
            <ul>
                <li>Splash damage can be dealt to multiple defenders (but only one of them can take the full basic damage).</li>
                <li>Exploding units work similarly as units with splash damage, except that they can{'\''}t do both the splash and basic damage.</li>
                <li>An attacker can take damage from a unit with tentacles while fighting another unit.</li>
            </ul>
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
            As the game is updated, new units are added and old units are changed. Make sure you always have the correct version selected so that the calculations are accurate. Versions that don{'\''}t change the units (e.g., bug fixes, new skins, ...) aren{'\''}t included. In those cases, simply use the latest previous version.
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
            If you don{'\''}t like the units{'\''} icons, you can replace them with their abbreviated names instead.
        </p>
        <h2>Hide tooltips</h2>
        <p>
            Don{'\''}t like the tooltips getting in your way? You can hide them with this option.
        </p>
    </>);
}

function About() {
    return (<>
        <h1>About</h1>
        <p>
            This application was made with React and NextUI. You can star it on <a href={GITHUB_URL} target='_blank' rel='noreferrer'>GitHub</a>! If you have any feedback or suggestions, feel free to open an issue or a pull request.
        </p>
        <p>
            Also, join the <a href='https://discord.gg/polytopia' target='_blank' rel='noreferrer'>official Discord server</a> (if you haven{'\''}t already) to discuss the game, ask questions, or just hang out with other players.
        </p>
        <p>
            <i>
                This application is not official, and it is not affiliated with Midjiwan AB in any way. All rights to the game assets used by this application (e.g., the unit icons), as well as the game itself, belong to Midjiwan AB.
            </i>
        </p>
    </>);
}

function Issues() {
    return (<>
        <h1>Known issues</h1>
        <h2>Incorrect splash damage</h2>
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
    content: <Root />,
    children: {
        duel: {
            title: 'Duel',
            content: <Duel />,
        },
        brawl: {
            title: 'Brawl',
            content: <Brawl />,
        },
        settings: {
            title: 'Settings',
            content: <Settings />,
        },
        issues: {
            title: 'Issues',
            content: <Issues />,
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
    settings: '/settings',
    issues: '/issues',
    about: '/about',
} as const satisfies Wiki<typeof wikiPages>;
