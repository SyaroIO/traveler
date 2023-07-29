export const isString = (str: string | undefined) => typeof str === 'string'
export const isNumber = (num: number | undefined) => (typeof num === 'number' ? !isNaN(num) : false)
export const isBoolean = (bool: boolean | undefined) => typeof bool === 'boolean'
export const isArray = (array: [] | undefined) => Array.isArray(array)
