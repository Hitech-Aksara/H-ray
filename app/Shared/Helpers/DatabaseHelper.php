<?php

declare(strict_types=1);

use Illuminate\Support\Facades\DB;

/*
 * dbExtractMonth
 * This function is used to get month extraction query compatible with different databases
 * @param string $column
 * @return string
 */
if (! function_exists('dbExtractMonth')) {
    function dbExtractMonth(string $column): string
    {
        $driver = DB::getDriverName();

        return match ($driver) {
            'pgsql' => "EXTRACT(MONTH FROM {$column})",
            'mysql' => "MONTH({$column})",
            'sqlite' => "strftime('%m', {$column})",
            default => "EXTRACT(MONTH FROM {$column})"
        };
    }
}

/*
 * dbExtractYear
 * This function is used to get year extraction query compatible with different databases
 * @param string $column
 * @return string
 */
if (! function_exists('dbExtractYear')) {
    function dbExtractYear(string $column): string
    {
        $driver = DB::getDriverName();

        return match ($driver) {
            'pgsql' => "EXTRACT(YEAR FROM {$column})",
            'mysql' => "YEAR({$column})",
            'sqlite' => "strftime('%Y', {$column})",
            default => "EXTRACT(YEAR FROM {$column})"
        };
    }
}

/*
 * dbGetLock
 * This function is used to acquire a lock compatible with different databases
 * @param string $lockName
 * @param int $timeout
 * @return string
 */
if (! function_exists('dbGetLock')) {
    function dbGetLock(string $lockName, int $timeout = 10): string
    {
        $driver = DB::getDriverName();

        return match ($driver) {
            'pgsql' => "SELECT pg_try_advisory_lock(hashtext('{$lockName}')) as l",
            'mysql' => "SELECT GET_LOCK('{$lockName}', {$timeout}) as l",
            'sqlite' => 'SELECT 1 as l', // SQLite doesn't support locks, return success
            default => 'SELECT 1 as l' // Default to success for unsupported drivers
        };
    }
}

/*
 * dbReleaseLock
 * This function is used to release a lock compatible with different databases
 * @param string $lockName
 * @return string
 */
if (! function_exists('dbReleaseLock')) {
    function dbReleaseLock(string $lockName): string
    {
        $driver = DB::getDriverName();

        return match ($driver) {
            'pgsql' => "SELECT pg_advisory_unlock(hashtext('{$lockName}')) as unlock_result",
            'mysql' => "SELECT RELEASE_LOCK('{$lockName}') as rl",
            'sqlite' => 'SELECT 1 as unlock_result', // SQLite doesn't support locks, return success
            default => 'SELECT 1 as unlock_result' // Default to success for unsupported drivers
        };
    }
}

/*
 * dbCheckLockAcquired
 * This function checks if the lock was acquired based on the database driver
 * @param mixed $result
 * @return bool
 */
if (! function_exists('dbCheckLockAcquired')) {
    function dbCheckLockAcquired($result): bool
    {
        $driver = DB::getDriverName();

        if (empty($result)) {
            return false;
        }

        return match ($driver) {
            'pgsql' => $result[0]->l == 1,
            'mysql' => $result[0]->l == 1,
            'sqlite' => true, // SQLite doesn't support locks, assume success
            default => ($result[0]->l ?? 1) == 1
        };
    }
}

/*
 * dbExtractDate
 * This function is used to get date part extraction query compatible with different databases
 * Supported parts: 'month', 'year', 'day', 'hour', 'minute', 'second'
 * @param string $part
 * @param string $column
 * @return string
 */
if (! function_exists('dbExtractDate')) {
    function dbExtractDate(string $part, string $column): string
    {
        $driver = DB::getDriverName();
        $part = strtolower($part);

        return match ([$driver, $part]) {
            ['pgsql', 'month'] => "EXTRACT(MONTH FROM {$column})",
            ['pgsql', 'year'] => "EXTRACT(YEAR FROM {$column})",
            ['pgsql', 'day'] => "EXTRACT(DAY FROM {$column})",
            ['pgsql', 'hour'] => "EXTRACT(HOUR FROM {$column})",
            ['pgsql', 'minute'] => "EXTRACT(MINUTE FROM {$column})",
            ['pgsql', 'second'] => "EXTRACT(SECOND FROM {$column})",

            ['mysql', 'month'] => "MONTH({$column})",
            ['mysql', 'year'] => "YEAR({$column})",
            ['mysql', 'day'] => "DAY({$column})",
            ['mysql', 'hour'] => "HOUR({$column})",
            ['mysql', 'minute'] => "MINUTE({$column})",
            ['mysql', 'second'] => "SECOND({$column})",

            ['sqlite', 'month'] => "strftime('%m', {$column})",
            ['sqlite', 'year'] => "strftime('%Y', {$column})",
            ['sqlite', 'day'] => "strftime('%d', {$column})",
            ['sqlite', 'hour'] => "strftime('%H', {$column})",
            ['sqlite', 'minute'] => "strftime('%M', {$column})",
            ['sqlite', 'second'] => "strftime('%S', {$column})",

            default => "EXTRACT({$part} FROM {$column})"
        };
    }
}

/*
 * dbLikeOperator
 * This function is used to get like operator
 * @return string
 */
if (! function_exists('dbLikeOperator')) {
    function dbLikeOperator(): string
    {
        $driver = DB::getDriverName();

        return $driver === 'pgsql' ? 'ILIKE' : 'LIKE';
    }
}

/*
 * dbWhereYear
 * This function is used to add year condition compatible with different databases
 * @param \Illuminate\Database\Query\Builder $query
 * @param string $column
 * @param int $year
 * @return \Illuminate\Database\Query\Builder
 */
if (! function_exists('dbWhereYear')) {
    function dbWhereYear($query, string $column, int $year)
    {
        $driver = DB::getDriverName();

        return match ($driver) {
            'pgsql' => $query->whereRaw("EXTRACT(YEAR FROM {$column}) = ?", [$year]),
            'mysql' => $query->whereYear($column, $year),
            'sqlite' => $query->whereRaw("strftime('%Y', {$column}) = ?", [$year]),
            default => $query->whereRaw("EXTRACT(YEAR FROM {$column}) = ?", [$year])
        };
    }
}

/*
 * call_store
 * This function is used to call stored procedure compatible with different databases
 * @param string $statment
 * @param array $var
 * @return mixed
 */
if (! function_exists('call_store')) {
    function call_store(string $statment, array $var = []): mixed
    {
        // MYSQL
        // return DB::connection('second_db')->select("CALL $statment");

        // PGSQL
        return DB::connection('pgsql2')->select("SELECT * FROM {$statment}", $var);
    }
}
