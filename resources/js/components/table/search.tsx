import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function Search() {
    const currentUrl = new URL(window.location.href);
    const initialQuery = currentUrl.searchParams.get('s') ?? '';

    const [query, setQuery] = useState(initialQuery);

    const handleSearch = useCallback(() => {
        router.get(
            window.location.pathname,
            query ? { s: query } : {},
            { preserveState: true, preserveScroll: true },
        );
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className="relative w-full max-w-sm">
            <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
                type="text"
                placeholder="Cari..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9"
            />
        </div>
    );
}
