import { Link } from '@inertiajs/react';
import type { Pagination } from '@/types/pagination';

interface PaginateProps {
    pagination: Pagination;
}

export default function Paginate({ pagination }: PaginateProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="text-muted-foreground hidden text-sm sm:inline">
                Showing <span className="font-bold">{pagination.from}</span> to <span className="font-bold">{pagination.to}</span> of{' '}
                <span className="font-bold">{pagination.total}</span> results
            </div>
            <div>
                {pagination.links &&
                    pagination.links.map((page, key) => (
                        <Link
                            key={key}
                            as="button"
                            disabled={page.url === null}
                            className={`bg-primary text-primary-foreground mr-1 cursor-pointer rounded-md px-2 py-1 text-sm ${page.url === null ? 'text-gray-700' : ''} ${page.active ? 'bg-secondary text-secondary-foreground border-primary border' : ''}`}
                            href={`${page.url}`}
                            dangerouslySetInnerHTML={{ __html: page.label }}
                            preserveState
                            preserveScroll
                        />
                    ))}
            </div>
        </div>
    );
}
