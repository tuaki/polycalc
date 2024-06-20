/// <reference types='vite/client' />

interface ImportMetaEnv {
    readonly ENV_BASE_URL?: string;
    readonly VITE_GITHUB_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
