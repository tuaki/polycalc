type IconProps = Readonly<{
    className?: string;
}>;

export function PolycalcLogoIcon({ className }: IconProps) {
    return (
        <svg fill='currentColor' strokeWidth='0' viewBox='0 0 24 24' height='32' width='32' xmlns='http://www.w3.org/2000/svg' className={className}>
            <path d='M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5zm0 1.5 7.5 3.3V11c0 5.5-3.8 9.2-7.5 10.5-3.7-1.3-7.5-5-7.5-10.5V5.8zm2.1 13L12 13.4l-2.1 2.1a1 1 45 0 1-1.4-1.4l2.1-2.1-2.1-2.1a1 1 45 0 1 1.4-1.4l2.1 2.1 2.1-2.1a1 1 45 0 1 1.4 1.4L13.4 12l2.1 2.1a1 1 45 0 1-1.4 1.4'/>
        </svg>
    );
}

export function PolycalcFullIcon({ className }: IconProps) {
    return (
        <svg fill='currentColor' strokeWidth='0' viewBox='0 0 24 24' height='32' width='32' xmlns='http://www.w3.org/2000/svg' className={className}>
            <path d='M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5zm0 1.5 7.5 3.3V11c0 5.5-3.8 9.2-7.5 10.5zM10 9H8.5v1.5a.5.5 0 0 1-1 0V9H6a.5.5 0 0 1 0-1h1.5V6.5a.5.5 0 0 1 1 0V8H10a.5.5 0 0 1 0 1m.1 6.9a.5.5 0 0 1-.7.7L8 15.2l-1.4 1.4a.5.5 0 0 1-.7-.7l1.4-1.4-1.4-1.4a.5.5 0 0 1 .7-.7L8 13.8l1.4-1.4a.5.5 0 0 1 .7.7l-1.4 1.4ZM14 9a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1Zm0 6a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1Zm2 .5a.5.5 0 0 1 0 1 .5.5 0 0 1 0-1m0-3a.5.5 0 0 1 0 1 .5.5 0 0 1 0-1'/>
        </svg>
    );
}
