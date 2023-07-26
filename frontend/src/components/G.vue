<script lang="ts" setup>
import { ref } from 'vue';
import { app } from '@/app';
import { geo as g } from '@/geo';

defineEmits(['area', 'hover']);

const { code, scale, t } = defineProps({
    code: { type: Number, require: true, default: 0 },
    scale: { type: Number, require: true, default: 1 },
    t: { type: Boolean, default: false },
});

const { features } = g.get(code) || {};
const z1 = g.z1(code);

interface CenterData {
    c: [number, number];
    t: string;
}
const centers = ref<CenterData[] | undefined>([]);
interface PathData {
    d: string;
    a: number;
    t: string;
    l: number;
}
const paths = ref<PathData[] | undefined>([]);
const border = ref<string | null>('');
const s = scale < 4;
if (t) {
    centers.value = z1 && s ? [{
        c: g.projection(z1.properties.center),
        t: z1.properties.name as string,
    }] : features?.filter(e => e.properties?.center).map(e => ({
        c: g.projection(e.properties?.center),
        t: e.properties?.name as string,
    }));
} else {
    paths.value = features?.map(e => ({
        d: g.path(e),
        a: e.properties?.code,
        t: e.properties?.name,
        l: app.getLevel(e.properties?.code),
    }));
    border.value = g.path(z1);
}
const isHover = ref(false);
const style = (l: number) => l ? `fill: ${app.getColor(l)};` : '';
</script>

<template lang="pug">
g.area(v-if='!t' :hover='isHover' :s='s')
    path(v-for='{ d, t, a, l } in paths' :d='d' :style='style(l)' @click='e => $emit("area", [e, a, t])' @mouseover='$emit("hover")' @mousemove='isHover = true' @mouseleave='isHover = false')
        title {{ t }}
g(v-if='t')
    g(v-for='{ t, c: [x, y] } in centers' :transform='`translate(${x},${y})`')
        circle(r='2')
        text(:y='-10')
            tspan {{ t }}
                tspan(x='0' y='-10') ​
            | {{ t }}

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
                fill: #fff8;
                stroke: #fff8;
                stroke-width: 2px;
                stroke-linejoin: round;
                transform: translateX(200px);
            }
        }
    }
}
</style>
