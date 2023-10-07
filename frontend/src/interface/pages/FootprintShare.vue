<script lang="ts" setup>
import { ref } from 'vue'
import { getShare } from '@/api/mark'
import { size, info } from '@/utils/geo'
import MapComponent from ':/components/MapComponent.vue'

const props = defineProps<{
  id: string,
}>();

const values = ref<number[]>(new Array(size).fill(0))
getShare(props.id).then(({ success, data }) => {
  if (!success) return;
  for (const [index, value] of data)
    values.value[index] = value
})
const tooltipValues = [
  '还未标记过',
  '想去',
  '路过',
  '去过',
  '住过',
  '家乡'
]
const tooltip = (index: number) => `<strong>${info(index)?.fullname}</strong><br />${tooltipValues[values.value[index]]}`
</script>

<template>
  <MapComponent
    :max="5"
    :values="values"
    :tooltip="tooltip"
  />
</template>
