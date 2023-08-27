import type { BMapProxyConfig } from './bmap'

export interface ProxiesConfig {
    bmap: BMapProxyConfig
}

import { proxies as config } from 'config'
export default config
export const { bmap } = config
