import initUser from '@/models/user'
import initMark from '@/models/mark'
import initRoom from '@/models/room'

export default async () => {
    await initUser()
    await initMark()
    await initRoom()
}
