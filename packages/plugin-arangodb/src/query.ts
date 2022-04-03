import { Collection, RawData, QueryBuilder, QueryWhereOperator } from "vormik"
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
    protected readonly from: string

    protected filters: Set<string>
    protected sorts: Set<Sort>
    protected limit?: Limit
    protected fields: Set<string>

    constructor(
        protected readonly connector: Connector,
        protected readonly collection: Collection
    ) {
        this.from = collection.name

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
            FOR doc IN ${this.from}
                ${statement}
                COLLECT WITH COUNT INTO length
                RETURN length
        `

        const result = await this.connector.query(query)
        const count = await result.next()

        return Number(count)
    }

    async single(): Promise<RawData | undefined> {
        const statement = this.buildQuery()
        const select = this.buildSelect()

        const query = `
            FOR doc IN ${this.from}
                ${statement}
                ${select}
        `

        const result = await this.connector.query(query)
        return await result.next()
    }

    async list(): Promise<RawData[]> {
        const statement = this.buildQuery()
        const select = this.buildSelect()

        const query = `
            FOR doc IN ${this.from}
                ${statement}
                ${select}
        `

        const result = await this.connector.query(query)
        return await result.all()
    }

    async insert(data: Partial<RawData>): Promise<RawData> {
        const payload = this.collection.beforeCreate(data)

        const query = `
            INSERT ${JSON.stringify(payload)} INTO ${this.from}
            RETURN NEW
        `

        const result = await this.connector.query(query)
        return await result.next()
    }

    async update(data: Partial<RawData>): Promise<RawData[]> {
        const statement = this.buildQuery()
        const select = this.buildSelect("NEW")
        const payload = this.collection.beforeUpdate(data)

        const query = `
            FOR doc IN ${this.from}
                ${statement}
                UPDATE doc WITH ${JSON.stringify(payload)} IN ${this.from}
                ${select}
        `

        const result = await this.connector.query(query)
        return await result.all()
    }

    async remove(): Promise<RawData[]> {
        const statement = this.buildQuery()
        const select = this.buildSelect()

        const query = `
            FOR doc IN ${this.from}
                ${statement}
                REMOVE doc IN ${this.from}
                ${select}
        `

        const result = await this.connector.query(query)
        return await result.all()
    }
}
