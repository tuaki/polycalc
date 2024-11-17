import { useCallback } from 'react';
import { Button, Divider, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import useWiki from './WikiProvider';
import { useCached } from '@/types/utils/useCached';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs';
import { TfiHelpAlt } from 'react-icons/tfi';
import { getWikiPageDetail } from './wiki';

export function WikiModal() {
    const { path, setPath } = useWiki();
    const cachedPath = useCached(path);
    const closeWiki = useCallback(() => setPath(undefined), [ setPath ]);
    const detail = cachedPath === undefined ? undefined : getWikiPageDetail(cachedPath);

    return (
        <Modal isOpen={!!path} onClose={closeWiki} size='3xl' classNames={{ base: 'max-h-[calc(100%-2*theme(spacing.1))] sm:max-h-[calc(100%-2*theme(spacing.16))]' }}>
            {detail && (
                <ModalContent>
                    <ModalHeader className='flex-row items-center gap-3'>
                        <Breadcrumbs separator='/'>
                            {detail.parents?.map(({ parent, path }) => (
                                <BreadcrumbItem key={path} onPress={() => setPath(path)}>
                                    {parent.title}
                                </BreadcrumbItem>
                            ))}
                            <BreadcrumbItem>{detail.page.title}</BreadcrumbItem>
                        </Breadcrumbs>
                    </ModalHeader>
                    <ModalBody className='flex-row overflow-hidden'>
                        {detail.children && (<>
                            <Listbox className='pc-listbox-reset' itemClasses={{ title: 'text-base font-semibold' }} aria-label='Nested pages'>
                                {detail.children.map(({ child, path }) => (
                                    <ListboxItem key={path} onPress={() => setPath(path)} className='px-1 py-0' textValue={'/' + child.title}>
                                        <span data-slot='separator' aria-hidden='true' className='pe-1 text-foreground/50'>/</span>
                                        <span className='cursor-pointer tap-highlight-transparent text-foreground/50 text-small hover:opacity-80 active:opacity-disabled transition-opacity text-nowrap'>{child.title}</span>
                                    </ListboxItem>
                                ))}
                            </Listbox>
                            <Divider orientation='vertical' className='h-auto' />
                        </>)}
                        <div className='flex-grow pc-wiki overflow-y-auto'>
                            {detail.page.content()}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={closeWiki}>
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
    label: string;
}>;

export function WikiInfo({ type, label }: WikiInfoProps) {
    const { setPath } = useWiki();

    return (
        <Button onPress={() => setPath(type)}>
            <TfiHelpAlt size={18} className='flex-shrink-0' />{label}
        </Button>
    );
}

type WikiLinkProps = Readonly<{
    type: string;
}>;

export function WikiLink({ type }: WikiLinkProps) {
    const { setPath } = useWiki();
    const { page } = getWikiPageDetail(type);

    return (
        <button onClick={() => setPath(type)} className='pc-wiki-link'>
            {page.title}
        </button>
    );
}
