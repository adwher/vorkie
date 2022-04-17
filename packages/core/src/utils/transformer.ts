/** Transform an array into a {@link Map} using a `key`. */
export function mapper<T, K extends keyof T>(data: T[], key: K): Map<T[K], T> {
    const map = new Map()

    for (const item of data) map.set(item[key], item)
    return map
}
