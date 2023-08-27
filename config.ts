export interface Config {
    socket?: import('@/.').Socket
    database?: import('@/database').DatabaseConfig
    logger?: import('@/log').LoggerConfig
    mail: import('@/mail').MailConfig
    token: import('@/token').TokenConfig
    proxies: import('@/proxies').ProxiesConfig
}

import config from 'config.prod'
export default config as Config

export const { socket, database, logger, mail, token, proxies } = config
