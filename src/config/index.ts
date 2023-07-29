import { config as cfg } from 'typed-dotenv'

const { env } = cfg({
    unknownVariables: 'remove',
    assignToProcessEnv: false,
    includeProcessEnv: false,
    rename: {
        enabled: true,
        caseStyle: 'camelCase',
        nestingDelimiter: '.'
    }
})

export const config = env ?? {}
export default config
