import { onMounted } from 'vue'
import { get } from '@/api/random'
import { mine, values } from './FootprintRandom.vue'

onMounted(async () => {
  const { success, data } = await get()
  if (!success) return
  console.log(data)

  for (const { me, records } of data) {
    if (me) mine.value = { m: true, v: Number(Object.keys(records)[0]) }
    for (const index in records) values.value[Number(index)] += records[index]
  }
})
