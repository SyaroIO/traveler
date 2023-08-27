import Log4js from 'log4js'
import { logger as config } from 'config'

export interface LoggerConfig {
    /** @default 'info' */
    level?: string
}
const level = config?.level ?? 'info'

Log4js.configure({
    appenders: {
        console: { type: 'console' },
        file: { type: 'file', filename: 'log/default.log', level: 'info' },
        file_requests: { type: 'file', filename: 'log/requests.log', level: 'info' }
    },
    categories: {
        default: { appenders: ['console', 'file'], level },
        request: { appenders: ['console', 'file_requests'], level }
    }
})

export const getLogger = (name: string) => Log4js.getLogger(name)
export default getLogger('default')
