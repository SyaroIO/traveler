<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
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
const p = ref({ c: [innerWidth / 2, innerHeight / 2], z: 1 });
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
      renderMode: 'richText',
    },
    geo: {
      zoom: p.value.z,
      map: 'map',
      layoutCenter: p.value.c,
      layoutSize: Math.min(innerHeight, innerWidth),
      itemStyle: { borderColor: '#224d' },
      emphasis: {
        label: { show: false },
        itemStyle: { areaColor: '#ff0' }
      },
      regions,
      tooltip: {
        formatter: ({ name }: { name: number }) => geo.info(name)?.fullname
      },
    },
    series: [
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

watch(() => chart.value, chart => {
  if (!chart) return;
  const canvas = chart.getDom();

  let timeout = 0;
  const scale = (scale: number, cx: number, cy: number) => {
    const { c: [x, y], z } = p.value;
    const s = z * scale;
    p.value = {
      z: s,
      c: [
        x + (cx - x) * (1 - scale),
        y + (cy - y) * (1 - scale),
      ]
    }
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      centers.value = geo.centers(z)
      timeout = 0;
    }, 300)
  }
  let down: {
    c: number[],
    p: number[],
  } | null = null;
  interface Point {
    clientX: number,
    clientY: number,
  }
  const md = ({ clientX, clientY }: Point) => down = { c: p.value.c, p: [clientX, clientY] }
  const mm = ({ clientX, clientY }: Point) => {
    if (!down) return;
    const {
      p: [x, y],
      c: [ox, oy],
    } = down;
    p.value.c = [
      ox + clientX - x,
      oy + clientY - y,
    ]
  }
  const mu = () => down = null
  canvas.addEventListener('mousedown', md)
  canvas.addEventListener('mousemove', mm)
  canvas.addEventListener('mouseup', mu)
  canvas.addEventListener('mouseout', mu)
  canvas.addEventListener('wheel', ({ clientX, clientY, deltaY: wheelDelta }) => {
    scale(wheelDelta < 0 ? 1.2 : 1 / 1.2, clientX, clientY)
  })

  const t2 = ([
    { clientX: x1, clientY: y1 },
    { clientX: x2, clientY: y2 }
  ]: TouchList) => [(x1 + x2) / 2, (y1 + y2) / 2, Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)]

  let touch: { c: number[], p: number[], d: number, s: number, } | null = null;
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const { touches } = e;
    switch (touches.length) {
      case 1: md(touches[0]); return;
      case 2: break;
      default: return;
    }
    const [cx, cy, distance] = t2(touches);
    touch = {
      c: p.value.c,
      p: [cx, cy],
      d: distance,
      s: 1,
    }
    md({ clientX: cx, clientY: cy })
  });
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const { touches } = e;
    switch (touches.length) {
      case 1: mm(touches[0]); return;
      case 2: break;
      default: return;
    }
    const [cx, cy, distance] = t2(touches);
    mm({ clientX: cx, clientY: cy })
    if (!touch) return;
    const ns = distance / touch.d;
    const s = ns / touch.s;
    touch.s = ns;
    scale(s, cx, cy);
  });
  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const { touches } = e;
    switch (touches.length) {
      case 0: mu(); break;
      case 1: md(touches[0]); break;
      default: break;
    }
    touch = null;
  })
})

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
  />
</template>
