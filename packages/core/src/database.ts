import { Collection } from "$/collection"

export interface Database {
    /**
     * Allows to query the database.
     * @param name A {@link Collection} name to query.
     * */
    from(name: string): QueryBuilder

    /** A unsafe way to executes a raw query into database. */
    raw(query: string, params: Record<string, unknown>): Promise<unknown>

    /** Executes all migrations needed based on a {@link Collection collection}. */
    migrate(collection: Collection): Promise<void>
}

export type QueryWhereOperator = "==" | "!=" | ">=" | "<=" | ">" | "<"

export interface QueryBuilder {
    /** Adds a order-by clause to the query. */
    orderBy(field: string, direction: "asc" | "desc"): QueryBuilder

    /** Sets the limit of items. */
    limitBy(count: number, offset?: number): QueryBuilder

    /** Adds fields to select */
    select(...fields: string[]): QueryBuilder

    /** Adds filters to query */
    where(
        field: string,
        operator: QueryWhereOperator,
        value: unknown
    ): QueryBuilder

    /** Executes the query and fetch the count of items. */
    count(): Promise<number>

    /** Fetchs the first element in the query result. */
    single<D>(): Promise<D | undefined>

    /** Fetchs all results into the query. */
    list<D>(): Promise<D[]>

    /** Inserts data into collection and return inserted field */
    insert<D>(data: D): Promise<D>

    /** Updates partial data using the query. */
    update<D>(data: Partial<D>): Promise<D[]>

    /** Deletes data based on query clauses and return affected data. */
    delete<D>(): Promise<D[]>
}
