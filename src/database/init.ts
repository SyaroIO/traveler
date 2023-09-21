import initUser from '@/models/user'
import initMark from '@/models/mark'
import initRoom from '@/models/room'
import initRandom from '@/models/random'

export default async () => {
    await initUser()
    await initMark()
    await initRoom()
    await initRandom()
}
