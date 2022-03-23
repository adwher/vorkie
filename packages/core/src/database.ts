import { Collection } from "$/collection"

export interface Database {
    /**
     * Allows to query the database.
     * @param collection A {@link Collection} to query.
     * */
    from(collection: Collection): DatabaseQuery

    /**
     * Allows to query the database.
     * @param name A {@link Collection} name to query.
     * */
    from(name: string): DatabaseQuery

    /** A unsafe way to executes a raw query into database. */
    raw(query: string, params: Record<string, unknown>): Promise<unknown>

    /** Executes all migrations needed based on {@link Collection collections}. */
    migrate(collections: Set<Collection>): Promise<void>
}

export interface DatabaseQuery {
    /** Adds a order-by clause to the query. */
    orderBy(field: string, direction: "asc" | "desc"): DatabaseQuery

    /** Sets the limit of items. */
    limitBy(count: number, offset?: number): DatabaseQuery

    /** Executes the query and fetch the count of items. */
    count(): Promise<number>

    /** Fetchs the first element in the query result. */
    single<Data>(): Promise<Data | undefined>

    /** Fetchs all results into the query. */
    list<Data>(): Promise<Data[]>

    /** Updates partial data using the query. */
    update<Data>(data: Partial<Data>): Promise<Data[]>

    /** Deletes data based on query clauses an return affected data. */
    delete<Data>(): Promise<Data[]>
}
