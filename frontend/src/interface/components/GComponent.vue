<script lang="ts" setup>
import { ref } from 'vue';
import { app } from '@/app';
import { geo } from '@/geo';
defineEmits(['area', 'hover']);

const props = defineProps({
  code: { type: Number, require: true, default: 0 },
  scale: { type: Number, require: true, default: 1 },
  t: { type: Boolean, default: false },
});

const { features } = geo.get(props.code) ?? {};
const z1 = geo.z1(props.code);

interface CenterData {
  center: [number, number];
  name: string;
}
const centers = ref<CenterData[] | undefined>([]);
interface PathData {
  d: string;
  code: number;
  name: string;
  level: number;
}
const paths = ref<PathData[] | undefined>([]);
const border = ref<string | null>('');
const s = props.scale < 4;
if (props.t) {
  centers.value = z1 && s ? [{
    center: geo.projection(z1.properties.center),
    name: z1.properties.name as string,
  }] : features?.filter(e => e.properties?.center).map(e => ({
    center: geo.projection(e.properties?.center),
    name: e.properties?.name as string,
  }));
} else {
  paths.value = features?.map(e => ({
    d: geo.path(e),
    code: e.properties?.code,
    name: e.properties?.name,
    level: app.getLevel(e.properties?.code),
  }));
  border.value = geo.path(z1);
}
const isHover = ref(false);
const style = (l: number) => l ? `fill: ${app.getColor(l)};` : '';
</script>

<template>
  <g
    v-if="!t"
    class="area"
    :hover="isHover"
    :s="s"
  >
    <path
      v-for="{ d, name, code: c, level } in paths"
      :key="name"
      :d="d"
      :style="style(level)"
      @click="e => $emit('area', [e, c, name])"
      @mouseover="$emit('hover')"
      @mousemove="isHover = true"
      @mouseleave="isHover = false"
    >
      <title>{{ t }}</title>
    </path>
  </g>
  <g v-if="t">
    <g
      v-for="{ name, center: [x, y] } in centers"
      :key="name"
      :transform="`translate(${x},${y})`"
    >
      <circle r="2" />
      <text :y="-10">
        <tspan>
          {{ name }}
        </tspan>
      </text>
    </g>
  </g>
</template>

<style lang="scss" scoped>
g {
  &.area {
    filter: url(#normal-shadow);

    &[hover="true"] {
      filter: url(#hover-shadow);

      >path {
        stroke: #669;
      }
    }

  }

  >path {
    fill: #fff;
    stroke: #aaa;
    stroke-width: .5;
    cursor: pointer;
    transition: fill .2s;

    &:hover {
      fill: #eee;
    }

    &.border {
      fill: #fff0;
      stroke: #336;
      stroke-width: 1;
      user-select: none;
      pointer-events: none;
    }
  }

  >g {
    >circle {
      fill: #88f;
    }

    >text {
      user-select: none;
      pointer-events: none;
      text-anchor: middle;
      font-size: 11px;
      fill: #000b;
      color: #000b;
      stroke-width: 0;
      font-weight: bold;

      >tspan {
        fill: #000000;
        stroke: #88888888;
        stroke-width: 0.6px;
        stroke-linejoin: round;
        transform: translateX(200px);
      }
    }
  }
}
</style>
