<script lang="ts" setup>
import { ref, computed } from 'vue'
import * as geo from '@/utils/geo'
import VChart from 'vue-echarts'
import type { ECBasicOption } from 'echarts/types/dist/shared'
import type { ECharts } from 'echarts'
import { rgb, hex, merge } from '@/utils/common'
import { View, Hide, Download } from '@element-plus/icons-vue'

const props = defineProps<{
  values: number[],
  max: number,
}>()
const $emit = defineEmits(['district-click'])
const chart = ref<ECharts | null>(null)
const show = ref(true)
const color = ref("#0ff")
const zoom = ref(1)
const centers = ref(geo.centers(1))
const option = computed(() => {
  const provinces = show.value ? centers.value.filter(({ p }) => p) : []
  const districts = show.value ? centers.value.filter(({ p }) => !p) : []
  const rgbColor = rgb(color.value)
  const regions = props.values.map((value, index) => ({
    name: '' + index,
    itemStyle: { areaColor: hex(rgbColor, value / props.max) }
  }))

  const scatter = (data: { name: string | number, value: [number, number] }[], update = {}) => merge({
    type: 'scatter',
    coordinateSystem: 'geo',
    data,
    roam: true,
    silent: true,
    animation: false,
    geoIndex: 0,
    symbolSize: 5,
    encode: { value: 2 },
    tooltip: { show: false },
    itemStyle: { color: '#fffd' },
    label: {
      show: true,
      position: 'top',
      fontSize: 10,
      color: '#fff',
      textBorderColor: '#224d',
      textBorderWidth: 3,
      formatter: '{b}'
    },
  }, update)
  return {
    tooltip: {
      trigger: 'item',
      formatter: ({ name }: { name: number }) => geo.info(name)?.fullname
    },
    geo: {
      zoom: zoom.value,
      map: 'map',
      roam: true,
      itemStyle: { borderColor: '#224d' },
      emphasis: {
        label: { show: false },
        itemStyle: { areaColor: '#ff0' }
      },
      regions,
    },
    series: [
      {
        type: 'map',
        geoIndex: 0,
        select: { disabled: true },
      },
      scatter(provinces, {
        itemStyle: { color: '#fa0d' },
        label: {
          color: '#224',
          fontSize: 12,
          textBorderColor: '#fa0d',
          textBorderWidth: 2,
        },
      }),
      scatter(districts)
    ]
  } as ECBasicOption;
});


let timeout = 0;
const scale = (scale: number | undefined) => {
  if (!scale) return;
  zoom.value *= scale;
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    centers.value = geo.centers(zoom.value)
    timeout = 0;
  }, 300)
}
const roam = (e: { dx?: number, dy?: number, zoom?: number }) => {
  scale(e.zoom);
}

const download = () => {
  const url = chart.value?.getDataURL({
    type: 'png',
    pixelRatio: 1.5,
    backgroundColor: '#121212'
  });
  if (!url) return;
  const elink = document.createElement('a');
  elink.download = "map";
  elink.style.display = 'none';
  elink.href = url;
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href);
  document.body.removeChild(elink)
}
</script>

<template>
  <teleport to="#fabtl">
    <el-row>
      <el-tooltip
        v-if="show"
        content="隐藏地名"
        placement="right"
      >
        <el-button
          circle
          type="primary"
          size="large"
          :icon="Hide"
          @click="show = false"
        />
      </el-tooltip>
      <el-tooltip
        v-else
        content="显示地名"
        placement="right"
      >
        <el-button
          circle
          type="primary"
          size="large"
          :icon="View"
          @click="show = true"
        />
      </el-tooltip>
    </el-row>


    <el-row>
      <el-tooltip
        content="保存图片"
        placement="right"
      >
        <el-button
          circle
          type="primary"
          size="large"
          :icon="Download"
          @click="download"
        />
      </el-tooltip>
    </el-row>
    <el-row>
      <el-color-picker
        v-model="color"
        size="large"
      />
    </el-row>
  </teleport>
  <v-chart
    ref="chart"
    autoresize
    :option="option"
    :update-options="{ lazyUpdate: true }"
    @click="({ name }) => $emit('district-click', name)"
    @georoam="roam"
  />
</template>
