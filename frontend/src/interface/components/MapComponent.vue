<script lang="ts" setup>
import { ref } from 'vue';
import * as geo from '@/utils/geo'
import HSLComponent from './HSLComponent.vue';

const props = defineProps<{
  values: number[],
  max: number,
}>()

const $emit = defineEmits(['district-click'])

const { abs, sqrt } = Math
const { innerWidth, innerHeight } = window
const p = ref({ s: 1, x: 0, y: 0, w: innerWidth, h: innerHeight, ss: 1 })
const paths = ref<string[]>([])
const provinces = ref(Array.from(geo.provinces.values()))
const hsl = ref({
  h: 180,
  s: 100,
  l: 50
})
const draw = () => paths.value = geo.indexs.map(geo.path)

let delayScale = 0;
const reScale = (s: number, cx: number, cy: number) => {
  if (s > 200) s = 200;
  if (s < 0.1) s = 0.1;
  if (p.value.s * p.value.ss == s) return;
  [p.value.ss, s] = [s / p.value.s, s / p.value.s / p.value.ss]
  p.value.x = cx - (cx - p.value.x) * s;
  p.value.y = cy - (cy - p.value.y) * s;
  if (delayScale) clearTimeout(delayScale);
  delayScale = setTimeout(() => {
    p.value.s *= p.value.ss;
    delayScale = 0;
    geo.scale(p.value.s);
    draw();
    p.value.ss = 1
  }, 100);
}

let isClick = true;
const click = (index: number) => isClick && $emit('district-click', index)

let last = [0, 0]
const distance = () => sqrt(abs(last[0] - p.value.x) ** 2 + abs(last[1] - p.value.y) ** 2);

let down: number[] | null = null;
const mousedown = (e: MouseEvent) => {
  down = [e.clientX ?? 0, e.clientY ?? 0]
  last = [p.value.x, p.value.y];
};

const mousemove = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  if (!down) return;
  p.value.x = clientX - down[0] + last[0] || 0;
  p.value.y = clientY - down[1] + last[1] || 0;
  if (distance() > 10) isClick = false;
};

const mouseup = () => down = null;

const wheel = ({ deltaY, clientX: x, clientY: y }: WheelEvent) => reScale(
  (deltaY > 0 ? 0.7 : 1.3) * p.value.s * p.value.ss, x, y
);

const fill = (index: number) => {
  const value = props.values[index];
  const max = props.max;
  const { h, s, l } = hsl.value;
  return `hsla(${h}, ${s}%, ${l}%, ${value / max})`
}

window.onresize = () => {
  const { innerWidth, innerHeight } = window;
  const w = p.value.w;
  const h = p.value.h;
  const dx = p.value.x - w / 2;
  const dy = p.value.y - h / 2;
  p.value.w = innerWidth;
  p.value.h = innerHeight;
  p.value.x = dx / w * innerWidth + innerWidth / 2;
  p.value.y = dy / h * innerHeight + innerHeight / 2;
  geo.resize(p.value.w, p.value.h);
  draw();
};
geo.resize(innerWidth, innerHeight);
draw()
</script>

<template>
  <div class="fix-screen">
    <svg
      class="map"
      :viewBox="`0 0 ${p.w} ${p.h}`"
      :width="p.w"
      :height="p.h"
      @mousedown="mousedown"
      @mousemove="mousemove"
      @mouseup="mouseup"
      @wheel="wheel"
    >
      <filter id="hover-shadow">
        <feFlood flood-color="#000" />
        <feComposite
          in2="SourceGraphic"
          operator="out"
        />
        <feGaussianBlur
          stdDeviation="5"
          result="blur"
        />
        <feComposite
          operator="atop"
          in2="SourceGraphic"
        />
      </filter>
      <filter id="province-shadow">
        <feFlood flood-color="#224" />
        <feComposite
          in2="SourceGraphic"
          operator="out"
        />
        <feGaussianBlur
          stdDeviation="1"
          result="blur"
        />
        <feComposite
          operator="atop"
          in2="SourceGraphic"
        />
      </filter>
      <g
        class="country"
        :transform="`translate(${p.x},${p.y}) scale(${p.ss})`"
      >
        <g
          v-for="({ districts, province }, i) in provinces"
          :key="i"
          class="province"
          filter="url(#province-shadow)"
        >
          <g
            v-for="({ index, district }) in districts"
            :key="index"
            class="district"
            :value="values[index]"
          >
            <path
              :d="paths[index]"
              :fill="fill(index)"
              @click="click(index)"
            >
              <title>{{ province }}{{ district }}</title>
            </path>
          </g>
        </g>
      </g>
    </svg>
    <div class="toolbar">
      <HSLComponent v-model="hsl" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fix-screen {
  margin: 0;
  padding: 0;
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.toolbar {
  position: fixed;
  left: 0;
  bottom: 0;
}

svg.map {
  width: 100%;
  height: 100%;
}

g.province {
  stroke: #224;
  stroke-width: 0.1;
  fill: #000;

  path:hover {
    stroke-width: 1;
    stroke: #5d00ff;
    fill: #fbf300
  }
}
</style>
