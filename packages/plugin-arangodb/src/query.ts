import { Collection, QueryBuilder, QueryWhereOperator } from "vormik"
import { Database as Connector } from "arangojs"
import _ from "lodash"

interface Sort {
    field: string
    direction: "asc" | "desc"
}

interface Limit {
    count: number
    offset?: number
}

export class ArangoQueryBuilder implements QueryBuilder {
    protected filters: Set<string>
    protected sorts: Set<Sort>
    protected limit?: Limit
    protected fields: Set<string>

    constructor(
        protected readonly connector: Connector,
        protected readonly from: Collection | string
    ) {
        this.sorts = new Set()
        this.filters = new Set()
        this.fields = new Set()
    }

    protected buildQuery() {
        let query = ""

        if (this.sorts.size > 0) {
            const sorts: Array<string> = []

            for (const filter of this.filters) {
                sorts.push(`doc.${filter}`)
            }

            query += `SORT ${sorts.join(", ")}\n`
        }

        if (this.filters.size > 0) {
            const conditions: Array<string> = []

            for (const filter of this.filters) {
                conditions.push(`doc.${filter}`)
            }

            query += `FILTER ${conditions.join(" AND ")}\n`
        }

        if (this.limit) {
            query += this.limit.offset
                ? `LIMIT ${this.limit.offset}, ${this.limit.count}\n`
                : `LIMIT ${this.limit.count}\n`
        }

        return query
    }

    protected buildSelect(base = "doc") {
        if (this.fields.size > 0) {
            const fields = Array.from(this.fields)
                .map(field => `${field}: ${base}.${field}`)
                .join(", ")

            return `RETURN { ${fields} }`
        }

        return `RETURN ${base}`
    }

    orderBy(field: string, direction: "asc" | "desc") {
        this.filters.add(`${field} ${direction}`)
        return this
    }

    limitBy(count: number, offset?: number) {
        this.limit = { count, offset }
        return this
    }

    select(...fields: string[]) {
        for (const field of fields) {
            this.fields.add(field as string)
        }

        return this
    }

    where(field: string, operator: QueryWhereOperator, value: unknown) {
        const payload = JSON.stringify(value)
        const query = `${field} ${operator} ${payload}`

        this.filters.add(query)

        return this
    }

    async count(): Promise<number> {
        const statement = this.buildQuery()

        const query = `
            FOR doc IN ${this.from}\n
                ${statement}
                RETURN COUNT(doc)
        `

        const result = await this.connector.query(query, {}, { count: true })
        return result.count ?? 0
    }

    async single<Data>(): Promise<Data | undefined> {
        const statement = this.buildQuery()
        const select = this.buildSelect()

        const query = `
            FOR doc IN ${this.from}\n
                ${statement}
                ${select}
        `

        const result = await this.connector.query(query)
        return await result.next()
    }

    async list<Data>(): Promise<Data[]> {
        const statement = this.buildQuery()
        const select = this.buildSelect()

        const query = `
            FOR doc IN ${this.from}\n
                ${statement}
                ${select}
        `

        const result = await this.connector.query(query)
        return await result.all()
    }

    async insert<Data>(data: Data): Promise<Data> {
        const query = `
            INSERT ${JSON.stringify(data)} INTO ${this.from} RETURN NEW
        `

        const result = await this.connector.query(query)
        return await result.next()
    }

    async update<Data>(data: Partial<Data>): Promise<Data[]> {
        const statement = this.buildQuery()
        const select = this.buildSelect("NEW")
        const payload = JSON.stringify(data)

        const query = `
            FOR doc IN ${this.from}\n
                ${statement}
                UPDATE doc WITH ${payload} IN ${this.from}
                ${select}
        `

        const result = await this.connector.query(query)
        return await result.all()
    }

    async delete<Data>(): Promise<Data[]> {
        const statement = this.buildQuery()
        const select = this.buildSelect()

        const query = `
            FOR doc IN ${this.from}\n
                ${statement}
                REMOVE doc IN ${this.from}
                ${select}
        `

        const result = await this.connector.query(query)
        return await result.all()
    }
}
