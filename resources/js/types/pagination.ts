interface Link {
    url: string | null;
    label: string;
    active: boolean;
}

// Laravel paginate() returns flat structure (not nested meta)
interface Pagination<T = unknown> {
    data: Array<T>;
    current_page: number;
    from: number;
    last_page: number;
    links: Array<Link>;
    path: string;
    per_page: number;
    to: number;
    total: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export type { Link, Pagination };
