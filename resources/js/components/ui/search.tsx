import { router } from '@inertiajs/react';
import { Search as SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

function usePrevious<T>(value: T): T | undefined {
    const [prev, setPrev] = useState<T | undefined>(undefined);
    const [current, setCurrent] = useState<T>(value);

    if (value !== current) {
        setPrev(current);
        setCurrent(value);
    }

    return prev;
}
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SearchProps {
    defaultLimit?: number;
    placeholder?: string;
    showLimit?: boolean;
    className?: string;
}

export default function Search({
    defaultLimit = 10,
    placeholder = 'Cari...',
    showLimit = true,
    className = '',
}: SearchProps) {
    const params = new URLSearchParams(window.location.search);
    const initialLimit = Number(params.get('limit') ?? defaultLimit);
    const initialSearch = params.get('s') ?? '';

    const [query, setQuery] = useState({
        s: initialSearch,
        limit: Number.isFinite(initialLimit) ? initialLimit : defaultLimit,
    });
    const prev = usePrevious(query);

    useEffect(() => {
        if (!prev) return;

        if (prev.s === query.s && prev.limit === query.limit) return;

        const currentParams = new URLSearchParams(window.location.search);
        const dataPayload: Record<string, string | number> = {
            s: query.s,
            limit: query.limit,
        };

        currentParams.forEach((value, key) => {
            if (!['s', 'limit', 'page'].includes(key)) {
                dataPayload[key] = value;
            }
        });

        router.get(window.location.pathname, dataPayload, {
            replace: true,
            preserveState: true,
            preserveScroll: true,
        });
    }, [prev, query]);

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {showLimit && (
                <Select
                    value={String(query.limit)}
                    onValueChange={(v) => setQuery({ ...query, limit: parseInt(v) })}
                >
                    <SelectTrigger className="w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="250">250</SelectItem>
                    </SelectContent>
                </Select>
            )}
            <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    onChange={(e) => setQuery({ ...query, s: e.target.value })}
                    value={query.s}
                    type="text"
                    className="pl-10"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}
