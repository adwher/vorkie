import { Collection } from "$/collection"

export type RawData = Record<string, unknown>

export interface Database {
    /**
     * Allows to query the database.
     * @param name A {@link Collection} name to query.
     * @throws {@link Error} if the collection is not defined.
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

    /**
     * Executes the query and fetch the count of items.
     * @throws {@link Error} Internal database connector error
     */
    count(): Promise<number>

    /**
     * Fetchs the first element in the query result.
     * @throws {@link Error} Internal database connector error
     */
    single(): Promise<RawData | undefined>

    /**
     * Fetchs all results into the query.
     * @throws {@link Error} Internal database connector error
     */
    list(): Promise<RawData[]>

    /**
     * Inserts data into collection and return inserted field
     * @throws {@link Error} Data is invalid
     * @throws {@link Error} Internal database connector error
     */
    insert(data: Partial<RawData>): Promise<RawData>

    /**
     * Updates partial data using the query.
     * @throws {@link Error} Data is invalid
     * @throws {@link Error} Internal database connector error
     */
    update(data: Partial<RawData>): Promise<RawData[]>

    /**
     * Deletes data based on query clauses and return affected data.
     * @throws {@link Error} Internal database connector error
     */
    remove(): Promise<RawData[]>
}
