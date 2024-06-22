import { Tooltip as NextuiTooltip, type TooltipProps } from '@nextui-org/react';
import usePreferences from './preferences/PreferencesProvider';

const TOOLTIP_DELAY = 600;

export function Tooltip(props: Readonly<Omit<TooltipProps, 'delay' | 'isOpen'>>) {
    const { preferences: { isTooltipsHidden } } = usePreferences();

    return (
        <NextuiTooltip {...props} delay={TOOLTIP_DELAY} isOpen={isTooltipsHidden ? false : undefined} />
    );
}