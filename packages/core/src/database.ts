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
    raw(query: string): Promise<unknown>

    /** Executes all migrations needed based on {@link Collection collections}. */
    migrate(collections: Set<Collection>): Promise<void>
}

type QueryOperator = "==" | "!=" | ">" | "<" | ">=" | "<="

export interface DatabaseQuery {
    /** Adds a where clause to the query. */
    where(field: string, operator: QueryOperator, value: unknown): DatabaseQuery

    /** Adds a order-by clause to the query. */
    orderBy(field: string, direction: "asc" | "desc"): DatabaseQuery

    /** Sets the limit of items. */
    limit(count: number, offset?: number): DatabaseQuery

    /** Executes the query and fetch the count of items. */
    count(): Promise<number>

    /** Fetchs the first element in the query result. */
    first<Data>(): Promise<Data | undefined>

    /** Fetchs all results into the query. */
    fetch<Data>(): Promise<Data[]>

    /** Inserts new data using the clauses. */
    insert<Data>(data: Data): Promise<Data>

    /** Updates partial data using the query. */
    update<Data>(data: Partial<Data>): Promise<Data>

    /** Deletes data based on query clauses. */
    delete(): Promise<void>
}
