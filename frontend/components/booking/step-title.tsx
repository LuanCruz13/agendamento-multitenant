type StepTitleProps = {
    number: number;
    id: string;
    children: React.ReactNode;
};

export function StepTitle({ number, id, children}: StepTitleProps){
    return (
        <h2
            id={id}
            className="flex items-center gap-2.5 whitespace-nowrap font-serif text-xl font-semibold tracking-tight"
        >
            <span className="flex size-6 items-center justify-center rounded-full bg-primary font-sans text-xs font-semibold text-primary-foreground">
                {number}
            </span>
            {children}
        </h2>       
    )
}