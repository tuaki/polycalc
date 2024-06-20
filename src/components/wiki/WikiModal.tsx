import { useCallback } from 'react';
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import useWiki from './WikiProvider';
import { useCached } from '@/types/utils/useCached';
import { getWikiPageDetail } from './wikiPages';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs';

export function WikiModal() {
    const { path, setPath } = useWiki();
    const cachedPath = useCached(path);
    const closeWiki = useCallback(() => setPath(undefined), [ setPath ]);
    const detail = cachedPath === undefined ? undefined : getWikiPageDetail(cachedPath);

    return (
        <Modal isOpen={!!path} onClose={closeWiki} size='3xl'>
            {detail && (
                <ModalContent>
                    <ModalHeader className='flex-row items-center gap-3'>
                        <Breadcrumbs separator='/'>
                            {detail.parents?.map(({ parent, path }) => (
                                <BreadcrumbItem key={path} onClick={() => setPath(path)}>
                                    {parent.title}
                                </BreadcrumbItem>
                            ))}
                            <BreadcrumbItem>{detail.page.title}</BreadcrumbItem>
                        </Breadcrumbs>
                    </ModalHeader>
                    <ModalBody className='flex-row'>
                        {detail.children && (<>
                            <div>
                                <ul className='font-semibold list-inside'>
                                    {detail.children.map(({ child, path }) => (
                                        <li key={path} onClick={() => setPath(path)}>
                                            <span data-slot='separator' aria-hidden='true' className='px-1 text-foreground/50'>/</span>
                                            <span className='cursor-pointer tap-highlight-transparent text-foreground/50 text-small hover:opacity-80 active:opacity-disabled transition-opacity'>{child.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Divider orientation='vertical' className='h-auto' />
                        </>)}
                        <div className='flex-grow pc-wiki'>
                            {detail.page.content}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={closeWiki}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            )}
        </Modal>
    );
}

type WikiInfoProps = Readonly<{
    type: string;
}>;

export function WikiInfo({ type }: WikiInfoProps) {
    const { setPath: setWiki } = useWiki();

    return (
        <Button onClick={() => setWiki(type)}>
            Wiki
        </Button>
    );
}
