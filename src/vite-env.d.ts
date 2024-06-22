/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMetaEnv {
    readonly ENV_BASE_URL?: string;
    readonly VITE_GITHUB_URL: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
