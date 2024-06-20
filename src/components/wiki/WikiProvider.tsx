import { createContext, useContext, useState } from 'react';

type WikiContext = {
    path: string | undefined;
    setPath: (path: string | undefined) => void;
}

export const WikiContext = createContext<WikiContext | undefined>(undefined);

export function WikiProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [ path, setPath ] = useState<string>();

    return (
        <WikiContext.Provider value={{ path, setPath }}>
            {children}
        </WikiContext.Provider>
    );
}

export default function useWiki(): WikiContext {
    const context = useContext(WikiContext);
    if (context === undefined)
        throw new Error('useWiki must be used within an WikiProvider');

    return context;
}
