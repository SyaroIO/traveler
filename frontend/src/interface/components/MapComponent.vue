<script lang="ts" setup>
import { ref } from 'vue';
import * as geo from '@/utils/geo'
import HSLComponent from './HSLComponent.vue';
import { RefreshLeft, View, Hide } from '@element-plus/icons-vue'

const props = defineProps<{
  values: number[],
  max: number,
}>()

const $emit = defineEmits(['district-click'])

const { abs, sqrt } = Math
const { innerWidth, innerHeight } = window
const p = ref({ s: 1, x: 0, y: 0, w: innerWidth, h: innerHeight, ss: 1, t: true })
const paths = ref<ReturnType<typeof geo.paths>>([])
const texts = ref<ReturnType<typeof geo.centers>>([])
const hoverTips = ref<ReturnType<typeof geo.center>>(null)
const hsl = ref({
  h: 180,
  s: 100,
  l: 50
})
const draw = async () => {
  await Promise.resolve(0)
  paths.value = geo.paths()
  texts.value = geo.centers()
  if (hoverTips.value?.index)
    hoverTips.value = geo.center(hoverTips.value.index)
}

let delayScale = 0;
const reScale = (s: number, cx: number, cy: number) => {
  if (s > 200) s = 200;
  if (s < 0.1) s = 0.1;
  if (p.value.s * p.value.ss == s) return;
  [p.value.ss, s] = [s / p.value.s, s / p.value.s / p.value.ss]
  p.value.x = cx - (cx - p.value.x) * s;
  p.value.y = cy - (cy - p.value.y) * s;
  if (delayScale) clearTimeout(delayScale);
  delayScale = setTimeout(async () => await Promise.resolve(0).then(() => {
    p.value.s *= p.value.ss;
    delayScale = 0;
    geo.scale(p.value.s);
    draw();
    p.value.ss = 1
  }), 100);
}

let isClick = true;
const click = (index: number) => isClick && $emit('district-click', index)

let last = [0, 0]
const distance = () => sqrt(abs(last[0] - p.value.x) ** 2 + abs(last[1] - p.value.y) ** 2);

let down: number[] | null = null;
const mousedown = (e: MouseEvent) => {
  isClick = true;
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
  return `hsl(${h}, ${s}%, ${l * value / max}%)`
}

const hover = (index: number) => {
  if (index == -1) {
    hoverTips.value = null;
    return;
  }
  if (index == hoverTips.value?.index) return;
  hoverTips.value = geo.center(index);
}

const reset = () => {
  p.value.x = 0
  p.value.y = 0
  p.value.s = 1
  p.value.ss = 1
  geo.scale(1);
  draw()
}

window.onresize = async () => {
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
        :transform="`translate(${p.x},${p.y}) scale(${p.ss})`"
      >
        <g
          class="polygons"
          filter="url(#province-shadow)"
        >
          <g
            v-for="({ districts, name: province }, i) in geo.provinces"
            :key="i"
            class="province"
            filter="url(#province-shadow)"
          >
            <g
              v-for="index in districts"
              :key="index"
              class="district"
              :value="values[index]"
            >
              <path
                :d="paths[index]"
                :fill="fill(index)"
                @click="click(index)"
                @mousemove="hover(index)"
                @mouseout="hover(-1)"
              >
                <title>{{ province }}{{ geo.districts[index].name }}</title>
              </path>
            </g>
          </g>
        </g>
        <g
          class="texts"
          v-show="p.t"
        >
          <g
            v-for="({ text, position: [x, y], province }, i) in texts"
            :class="{ p: province }"
            :key="i"
            :transform="`translate(${x},${y})`"
          >
            <circle r="2" />
            <text class="back" :y="-5">
              {{ text }}
            </text>
            <text class="front" :y="-5">
              {{ text }}
            </text>
          </g>
        </g>
      </g>
    </svg>
    <div
      class="hover-tips"
      v-show="hoverTips"
      :style="`left: ${p.x + (hoverTips?.x ?? 0)}px; top: ${p.y + (hoverTips?.y ?? 0)}px;`"
    >
      {{ hoverTips?.name }}
    </div>
    <div class="toolbar">
      <el-row class="btn">
        <el-tooltip
          content="复原位置"
          placement="right"
        >
          <el-button
            circle
            type="primary"
            size="large"
            :icon="RefreshLeft"
            @click="reset"
          />
        </el-tooltip>
      </el-row>
      <el-row class="btn">
        <el-tooltip
          content="隐藏地名"
          placement="right"
          v-if="p.t"
        >
          <el-button
            circle
            type="primary"
            size="large"
            :icon="Hide"
            @click="p.t = false"
          />
        </el-tooltip>
        <el-tooltip
          content="显示地名"
          placement="right"
          v-else
        >
          <el-button
            circle
            type="primary"
            size="large"
            :icon="View"
            @click="p.t = true"
          />
        </el-tooltip>
      </el-row>
      <el-row>
        <HSLComponent v-model="hsl" />
      </el-row>
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

  .btn {
    margin: 10px;
  }

}

svg.map {
  width: 100%;
  height: 100%;

  text {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
}

g.province {
  stroke: #224;
  stroke-width: 0.3;
  fill: #000;

  path:hover {
    stroke-width: 1;
    stroke: #5d00ff;
    fill: #fbf300
  }
}

g.texts {

  .p {

    circle,
    text {
      fill: #ff08;
    }
  }

  circle,
  text {
    fill: #fff8;
  }

  text {
    font-size: 10px;
    text-anchor: middle;
  }

  text.back {
    stroke: #2248;
    stroke-width: 3px;
  }
}

.hover-tips {
  position: fixed;
  display: flex;
  padding: 3px 8px;
  justify-content: center;
  border-radius: 4px;
  background: linear-gradient(72deg, #110c4d56, #0d3e67);
  border: 1px solid #0d3e67;
  backdrop-filter: blur(10px);
  transform: translate(-50%, calc(-100% - 8px));
  pointer-events: none;

  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;

  &::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    border: 8px solid transparent;
    border-top: 8px solid #0d3e67;
    width: 0;
    transform: translateX(-50%);
  }

}
</style>
