import { EventEmitter } from 'node:events'

export const emitter = new EventEmitter()
export default emitter

export const asyncEmit = async (...args: Parameters<typeof emitter.emit>) => {
    await Promise.resolve()
    emitter.emit(...args)
}
