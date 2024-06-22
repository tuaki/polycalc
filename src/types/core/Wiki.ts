import { type ReactNode } from 'react';

export type WikiPage = {
    title: string;
    content: ReactNode;
    children?: Record<string, WikiPage>;
};

type NestedPath<K extends string, TChild> = TChild extends WikiPage
    ? `${K}` | `${K}/${Path<TChild>}`
    : never;

type Path<TPage extends WikiPage> = {
    [K in keyof TPage['children']]-?: NestedPath<K & string, TPage['children'][K]>;
}[keyof TPage['children']];

type WikiPath<TWiki extends WikiPage> = `/${Path<TWiki> | ''}`

export type Wiki<TWiki extends WikiPage> = WikiPath<TWiki> | { [key: string]: Wiki<TWiki> };

type WikiPageDetail = {
    page: WikiPage;
    /** This path is definitely correct. */
    path: string;
    /** If the array would be empty, it's undefined instead. */
    parents: { parent: WikiPage, path: string }[] | undefined;
    children: { child: WikiPage, path: string }[] | undefined;
};

export function getWikiPageDetailFromRoot(rawPath: string, root: WikiPage): WikiPageDetail  {
    const pages = findPagesFromRoot(rawPath, root);
    const page = pages[pages.length - 1];
    // The page is not root only if the rawPath is correct.
    const path = page === root ? '/' : rawPath;
    const children = getChildren(page, path);
    const parents = getParents(pages, path);

    return { page, path, children, parents };
}

function findPagesFromRoot(path: string, root: WikiPage): WikiPage[] {
    let current: WikiPage = root;
    const output: WikiPage[] = [ current ];

    for (const part of path.substring(1).split('/')) {
        if (!current.children?.[part])
            return [ root ];

        current = current.children[part];
        output.push(current);
    }

    return output;
}

function getChildren(page: WikiPage, path: string): { child: WikiPage, path: string }[] | undefined {
    const prefix = path + (path === '/' ? '' : '/');
    const children = Object
        .entries(page.children ?? {})
        .map(([ key, child ]) => ({ child, path: prefix + key }));

    return children.length ? children : undefined;
}

function getParents(pages: WikiPage[], path: string): { parent: WikiPage, path: string }[] | undefined {
    if (pages.length === 1)
        return undefined;

    let current = '/';
    const output = [ { parent: pages[0], path: current } ];
    const pathKeys = path.substring(1).split('/');

    for (let i = 1; i < pages.length - 1; i++) {
        current += (current === '/' ? '' : '/') + pathKeys[i - 1];
        output.push({ parent: pages[i], path: current });
    }

    return output;
}
