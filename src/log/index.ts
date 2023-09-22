import Log4js from 'log4js'
import { logger as config } from 'config'

export interface LoggerConfig {
    /** @default 'info' */
    level?: string
    /** @default 'log' */
    path?: string
}
const level = config?.level ?? 'info'
const path = config?.path ?? 'log'
Log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: {
            type: 'dateFile',
            filename: `${path}/default.log`,
            level: 'info',
            compress: true
        },
        file_requests: {
            type: 'dateFile',
            filename: `${path}/requests.log`,
            level: 'info',
            compress: true
        }
    },
    categories: {
        default: { appenders: ['console', 'file'], level },
        request: { appenders: ['console', 'file_requests'], level }
    }
})

export const getLogger = (name: string) => Log4js.getLogger(name)
export default getLogger('default')
