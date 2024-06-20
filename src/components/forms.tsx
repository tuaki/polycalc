import { Radio, RadioGroup, Select, SelectItem, type SwitchProps, VisuallyHidden, useSwitch, Button } from '@nextui-org/react';
import { type UnitVariant, type UnitClass } from '@/types/core/UnitClass';
import usePreferences from '@/components/preferences/PreferencesProvider';
import { useEffect, useMemo } from 'react';
import { type UnitTag } from '@/types/core/units';
import { PiLinkBold, PiLinkBreakBold } from 'react-icons/pi';
import { RxChevronUp, RxChevronDown, RxChevronLeft, RxChevronRight } from 'react-icons/rx';   
import clsx from 'clsx';

type BonusType = 'none' | 'defense' | 'wall';

type BonusProps = Readonly<{
    value: BonusType;
    onChange: (value: BonusType) => void;
}>;

export function BonusSelect({ value, onChange }: BonusProps) {
    return (
        <RadioGroup
            label='Defense bonus'
            orientation='horizontal'
            size='sm'
            value={value}
            onChange={e => onChange(e.target.value as BonusType)}
        >
            <Radio value='none'>None</Radio>
            <Radio value='defense'>Basic (1.5)</Radio>
            <Radio value='wall'>Wall (4.0)</Radio>
        </RadioGroup>
    );
}

type UnitClassSelectProps = Readonly<{
    value: UnitClass;
    onChange: (value: UnitClass) => void;
    label: string;
}>;

export function UnitClassSelect({ value, onChange, label }: UnitClassSelectProps) {
    const { preferences } = usePreferences();
    const options = useMemo(() => filterUnitsByTags(preferences.version.getClasses(), preferences.filterTags), [ preferences ]);

    useEffect(() => {
        if (filterUnitsByTags([ value ], preferences.filterTags).length === 0)
            onChange(options[0]);
    }, [ options ]);

    const selectedKeys = useMemo(() => options.some(o => o.id === value.id) ? [ value.id ] : [], [ options, value ]);

    return (
        <Select
            size='sm'
            label={label}
            selectedKeys={selectedKeys}
            onChange={e => {
                const newClass = preferences.version.getClass(e.target.value);
                if (newClass)
                    onChange(newClass); 
            }}
        >
            {options.map(unit => (
                <SelectItem key={unit.id} value={unit.id}>{unit.label}</SelectItem>
            ))}
        </Select>
    );
}

function filterUnitsByTags(units: readonly UnitClass[], tags: UnitTag[]): readonly UnitClass[] {
    return tags.length === 0
        ? units
        : units.filter(unit => tags.some(tag => unit.tags.includes(tag)));
}

type UnitVariantSelectProps = Readonly<{
    unitClass: UnitClass;
    value?: UnitVariant;
    onChange: (value: UnitVariant) => void;
    label: string;
}>;

export function UnitVariantSelect({ unitClass, value, onChange, label }: UnitVariantSelectProps) {
    const options = unitClass.variants;
    const selectedKeys = useMemo(() => value && options?.some(o => o.id === value.id) ? [ value.id ] : [], [ options, value ]);

    if (!options || !value)
        return null;


    return (
        <Select
            size='sm'
            label={label}
            selectedKeys={selectedKeys}
            onChange={e => {
                const variant = options.find(v => v.id === e.target.value);
                if (variant)
                    onChange(variant);
            }}
        >
            {options.map(variant => (
                <SelectItem key={variant.id} value={variant.id}>{variant.label}</SelectItem>
            ))}
        </Select>
    );
}

export function LinkSwitch(props: Readonly<SwitchProps>) {
    const {
        Component,
        slots,
        isSelected,
        getBaseProps,
        getInputProps,
        getWrapperProps,
    } = useSwitch(props);
    
    return (
        <Component {...getBaseProps()}>
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <div
                {...getWrapperProps()}
                className={slots.wrapper({
                    class: [
                        'w-8 h-12 m-0',
                        'flex items-center justify-center',
                        'rounded-lg bg-default-100 hover:bg-default-200',
                    ],
                })}
            >
                {isSelected ? <PiLinkBold size={18} /> : <PiLinkBreakBold size={18} />}
            </div>
        </Component>
    );
}

type LeftRightButtonProps = Readonly<{
    variant: 'up' | 'down' | 'left' | 'right';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}>;

export function ArrowButton({ variant, onClick, disabled, className }: LeftRightButtonProps) {
    return (
        <Button
            size='sm'
            onClick={onClick}
            disabled={disabled}
            className={clsx('min-w-8 p-0 bg-default-100 hover:bg-default-200', (variant === 'up' || variant === 'down') ? 'w-8 h-5' : 'w-5 h-8', className)}
        >
            {variant === 'up' && <RxChevronUp size={16} />}
            {variant === 'down' && <RxChevronDown size={16} />}
            {variant === 'left' && <RxChevronLeft size={16} />}
            {variant === 'right' && <RxChevronRight size={16} />}
        </Button>
    );
}
