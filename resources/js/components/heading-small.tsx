interface HeadingSmallProps {
    title: string;
    description?: string;
}

export default function HeadingSmall({ title, description }: HeadingSmallProps) {
    return (
        <header>
            <h3 className="text-lg font-medium">{title}</h3>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </header>
    );
}
