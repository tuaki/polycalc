import { type Wiki, getWikiPageDetailFromRoot, type WikiPage } from '@/types/core/Wiki';
import { About, Brawl, Changelog, Duel, Issues, Root, Settings } from './wikiPages';

export function getWikiPageDetail(path: string) {
    return getWikiPageDetailFromRoot(path, wikiPages);
}

const wikiPages = {
    title: 'Home',
    content: Root,
    children: {
        duel: {
            title: 'Duel',
            content: Duel,
        },
        brawl: {
            title: 'Brawl',
            content: Brawl,
        },
        settings: {
            title: 'Settings',
            content: Settings,
        },
        issues: {
            title: 'Issues',
            content: Issues,
        },
        about: {
            title: 'About',
            content: About,
        },
        changelog: {
            title: 'Changelog',
            content: Changelog,
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
