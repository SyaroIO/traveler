<script lang="ts" setup>
import { ref } from 'vue';
import { app } from '@/app';
import { geo, codes } from '@/geo';
import GComponent from './GComponent.vue';
import MenuComponent from './MenuComponent.vue';

defineProps({ hsl: { type: String, default: '' } });

const { abs, sqrt } = Math;
const { innerWidth, innerHeight } = window;
const width = ref(innerWidth);
const height = ref(innerHeight);
const scale = ref(1);
const areas = ref<number[]>([]);
const draw = () => areas.value = codes;
const x = ref(0);
const y = ref(0);
const phone = ref(false);


let down = false;
let downX = 0;
let downY = 0;
let lastX = 0;
let lastY = 0;
let isClick = true;

const reScale = (s: number, cx: number, cy: number) => {
    if (s > 200) s = 200;
    if (s < 0.1) s = 0.1;
    if (scale.value == s) return;
    [scale.value, s] = [s, s / scale.value];
    x.value = cx - (cx - x.value) * s;
    y.value = cy - (cy - y.value) * s;
    geo.scale(scale.value);
    draw();
}

const distance = () => sqrt(abs(lastX - x.value) ** 2 + abs(lastY - y.value) ** 2);

// 电脑
const mousedown = (e: MouseEvent) => {
    down = true;
    lastX = x.value;
    lastY = y.value;
    downX = e.clientX || 0;
    downY = e.clientY || 0;
};

const mousemove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    if (!down) return;
    x.value = clientX - downX + lastX || 0;
    y.value = clientY - downY + lastY || 0;
    if (distance() > 10) isClick = false;
};

const mouseup = () => down = false;

const wheel = ({ deltaY, clientX: x, clientY: y }: WheelEvent) => reScale(
    (deltaY > 0 ? 0.7 : 1.3) * scale.value, x, y
);

// 触屏
let touchS = false;
let touchD = 0;
let cx = 0;
let cy = 0;
let lastS = 1;

const touchstart = (e: TouchEvent) => {
    e.preventDefault();
    phone.value = true;
    if (e.touches.length > 1)
        return touchScale(e);
    down = true;
    lastX = x.value;
    lastY = y.value;
    downX = e.touches[0].clientX || 0;
    downY = e.touches[0].clientY || 0;
};

const touchmove = (e: TouchEvent) => {
    e.preventDefault();
    if (touchS) return touchScale(e);
    const { clientX, clientY } = e.touches[0];
    if (!down) return;
    x.value = clientX - downX + lastX || 0;
    y.value = clientY - downY + lastY || 0;
    if (distance() > 10) isClick = false;
};

const touchend = () => down = touchS = false;

const touchScale = ({ touches: [
    { clientX: x1, clientY: y1 }, { clientX: x2, clientY: y2 }
] }: TouchEvent) => {
    const d = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    if (!touchS) {
        touchS = true;
        touchD = d;
        cx = (x1 + x2) / 2;
        cy = (y1 + y2) / 2;
        lastS = scale.value;
        return;
    }
    reScale(d / touchD * lastS, cx, cy);
};
interface MenuData {
    ccode: number | undefined;
    code: number;
    name: string;
    select: number;
    x: number;
    y: number;
    display: string;
}
const menu = ref<MenuData>({ code: 0, name: '', select: 0, x: 0, y: 0, display: 'none', ccode: undefined });
const click = (ccode: number, [e, code, name]: [MouseEvent, number, string]) => {
    if (!isClick) {
        isClick = true;
        return;
    }
    e.stopPropagation();
    menu.value = {
        ccode, code, name,
        select: app.getLevel(code),
        x: e.clientX,
        y: e.clientY,
        display: 'block'
    };
};
const click2 = () => menu.value.display = 'none';
const select = ([code, value]: [string, number, number]) => {
    app.setLevel(code, value);
    menu.value.display = 'none';
};

document.onkeydown = e => {
    if (e.key === 'Escape') {
        scale.value = 1;
        x.value = 0;
        y.value = 0;
        draw();
    }
};

window.onresize = () => {
    const { innerWidth, innerHeight } = window;
    const w = width.value;
    const h = height.value;
    const dx = x.value - w / 2;
    const dy = y.value - h / 2;
    width.value = innerWidth;
    height.value = innerHeight;
    x.value = dx / w * innerWidth + innerWidth / 2;
    y.value = dy / h * innerHeight + innerHeight / 2;
    geo.resize(width.value, height.value);
    draw();
};
geo.resize(width.value, height.value);
draw();

</script>

<template>
  <div class="geo">
    <svg
      :viewBox="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      @mousedown="mousedown"
      @mousemove="mousemove"
      @mouseup="mouseup"
      @wheel="wheel"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
      @click="click2"
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
      <filter id="normal-shadow">
        <feFlood flood-color="#000" />
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
      <g :transform="`translate(${x},${y})`">
        <GComponent
          v-for="code of areas"
          :key="code + 'x' + scale"
          :code="code"
          :scale="scale"
          @area="d => click(code, d)"
          @hover="areas.sort((a, b) => a == code ? 1 : b == code ? -1 : 0)"
        />
        <GComponent
          v-for="code of areas"
          :key="code + 'x' + scale"
          :code="code"
          :scale="scale"
          :t="true"
        />
      </g>
    </svg>
    <MenuComponent
      class="menu"
      :ccode="menu.ccode"
      :code="menu.code"
      :name="menu.name"
      :select="menu.select"
      :style="`left: ${menu.x}px;top: ${menu.y}px;display: ${menu.display};`"
      @select="select"
    />
  </div>
</template>

<style lang="scss" scoped>
div.geo {
    margin: 0;
    display: flex;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;

    >svg {
        width: 100%;
        height: 100%;
    }

    >.menu {
        position: fixed;
    }
}
</style>
