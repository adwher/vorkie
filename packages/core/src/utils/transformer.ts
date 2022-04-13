/** Transform an array into a {@link Map} using a `key`. */
export function mapper<T>(data: T[], key: keyof T): Map<string, T> {
    const map = new Map()

    for (const item of data) map.set(item[key], item)
    return map
}
