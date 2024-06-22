type IconProps = Readonly<{
    className?: string;
}>;

export function PolycalcLogoIcon({ className }: IconProps) {
    return (
        <svg fill='currentColor' strokeWidth='0' viewBox='0 0 24 24' height='32' width='32' xmlns='http://www.w3.org/2000/svg' className={className}>
            <path d='M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5zm0 1.5 7.5 3.33V11c0 5.55-3.84 9.24-7.5 10.5-3.66-1.26-7.5-4.95-7.5-10.5V5.83zM17 13h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4h4a1 1 0 0 1 0 2'/>
        </svg>
    );
}
