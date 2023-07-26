import Log4js from 'log4js';

Log4js.configure({
    appenders: {
        console: { type: 'console' },
        console_requests: {
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '%[[%d{yyyy-MM-ddThh:mm:ss.SSS}] [%p] %c -%] %m',
            }
        },
        file: { type: 'file', filename: 'log/default.log', level: 'info' },
        file_requests: { type: 'file', filename: 'log/requests.log', level: 'info' },
    },
    categories: {
        default: { appenders: ['console', 'file'], level: 'debug' },
        request: { appenders: ['console_requests', 'file_requests'], level: 'debug' },
    },
});

export const getLogger = (name: string) => Log4js.getLogger(name);
export default getLogger('default');