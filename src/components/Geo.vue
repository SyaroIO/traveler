<script setup>
import { ref } from 'vue';
import { geoMercator, geoPath } from "d3-geo";
const { innerWidth, innerHeight } = window;
const { abs, sqrt } = Math;

const width = ref(innerWidth);
const height = ref(innerHeight);
const paths = ref([]);
const centers = ref([]);
const x = ref(0);
const y = ref(0);
const scale = ref(1);
const phone = ref(false);

let down = false;
let downX = 0;
let downY = 0;
let lastX = 0;
let lastY = 0;
let isClick = true;
let lcode = 100000;

const draw = (code=lcode, pre=()=>{})=>{
    const data = $.app.get(code);
    if(!data) return;
    pre?.();
    lcode = code;
    const s = scale.value;
    const p = geoMercator().fitSize([width.value*s, height.value*s], data);
    const d = geoPath(p);
    const c = c=>c?p(c):null;
    paths.value = data.features.map(e=>({d: d(e),t: e.properties.name, c: e.properties.code}));
    centers.value = data.features.map(({properties:{center:ct,name:t}})=>({c:c(ct),t})).filter(e=>e.c);
}

const reScale = (s, cx, cy) => {
    if(s>200) s = 200;
    if(s<0.1) s = 0.1;
    if(scale.value==s) return;
    [scale.value, s] = [s, s / scale.value];
    x.value = cx - (cx - x.value) * s;
    y.value = cy - (cy - y.value) * s;
    draw();
}

const circles = ref([]);
let timeout = 0;
let idx = 0;
const circle = (x, y) => {
    const t = Date.now();
    const r = ()=>Math.random() * 10 + 5;
    const data = [
        {transform: `translate(${x+r()},${y+r()})`},
        `hsl(${Math.random()*360},100%,50%)`,
        idx++,
        t
    ];
    if(circles.value.length>100) circles.value.shift();

    circles.value.push(data);

    if(timeout) return;
    const to = ()=>{
        timeout = setTimeout(() => {
            const now = Date.now();
            circles.value = circles.value.filter(c=>now-c[3]<500);
            timeout = 0;
            if(circles.value.length) to();
        }, 500);
    }
    to();
};

const click = c => {
    if(isClick) return draw(c, ()=>{
        scale.value = 1;
        x.value = 0;
        y.value = 0;
    });
    isClick = true;
};

const distance = _ => sqrt(abs(lastX-x.value)**2+abs(lastY-y.value)**2);

// 电脑
const mousedown = e=>{
    down = true;
    lastX = x.value;
    lastY = y.value;
    downX = e.clientX || 0;
    downY = e.clientY || 0;
};

const mousemove = e=>{
    const { clientX, clientY } = e;
    circle(clientX, clientY);
    if(!down) return;
    x.value = clientX - downX + lastX || 0;
    y.value = clientY - downY + lastY || 0;
    if(distance()>10) isClick = false;
};

const mouseup = _=>down = false;

const wheel = ({deltaY, clientX: x, clientY: y})=>reScale(
    (deltaY>0?0.9:1.1)*scale.value, x, y
);

// 触屏
let touchS = false;
let touchD = 0;
let cx;
let cy;
let lastS = 1;

const touchstart = e=>{
    phone.value = true;
    e.returnValue = false;
    if(e.touches.length > 1)
        return touchScale(e);
    down = true;
    lastX = x.value;
    lastY = y.value;
    downX = e.touches[0].clientX || 0;
    downY = e.touches[0].clientY || 0;
};

const touchmove = e=>{
    e.returnValue = false;
    if(touchS) return touchScale(e);
    const { clientX, clientY } = e.touches[0];
    circle(clientX, clientY);
    if(!down) return;
    x.value = clientX - downX + lastX || 0;
    y.value = clientY - downY + lastY || 0;
    if(distance()>10) isClick = false;
};

const touchend = _=>down = touchS = false;

const touchScale = ({ touches: [
    { clientX:x1, clientY:y1 }, { clientX:x2, clientY:y2 }
]}) => {
    const d = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    if(!touchS) {
        touchS = true;
        touchD = d;
        cx = (x1 + x2) / 2;
        cy = (y1 + y2) / 2;
        lastS = scale.value;
        return;
    }
    reScale(d / touchD * lastS, cx, cy);
};

document.onkeydown = e=>{
    if(e.key === 'Escape') {
        scale.value = 1;
        x.value = 0;
        y.value = 0;
        draw(100000);
    }
};

window.onresize = _=>{
    const { innerWidth, innerHeight } = window;
    const w = width.value;
    const h = height.value;
    const dx = x.value - w / 2;
    const dy = y.value - h / 2;
    width.value = innerWidth;
    height.value = innerHeight;
    draw(lcode, ()=>{
        x.value = dx / w * innerWidth + innerWidth / 2;
        y.value = dy / h * innerHeight + innerHeight / 2;
    });
};

draw();
</script>

<template>
    <div>
        <svg :viewBox="`0 0 ${width} ${height}`" :width="width" :height="height" :phone="phone"
            @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup" @wheel="wheel"
            @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
            <g :transform="`translate(${x},${y})`">
                <g class="area">
                    <path v-for="{d, t, c} in paths" :d="d" @click="click(c)">
                        <title>{{t}}</title>
                    </path>
                </g>
                <g class="center">
                    <g v-for="{t, c:[x,y]} in centers" :transform="`translate(${x},${y})`">
                        <circle r="2" />
                        <text :y="-10">
                            <tspan>{{t}}<tspan x="0" y="-10">&ZeroWidthSpace;</tspan></tspan>{{t}}
                        </text>
                    </g>
                </g>
            </g>
            <g class="c" v-for="[b,c,k] in circles" v-bind="b" :key="k" >
                <circle :stroke="c" r="20" />
            </g>

            <circle r="4" fill="blue"/>
            <circle r="4" fill="blue" :cy="height" />
            <circle r="4" fill="blue" :cx="width" />
            <circle r="4" fill="blue" :cx="width" :cy="height" />
            <circle r="4" fill="blue" :cx="width/2" :cy="height/2" />
        </svg>
    </div>
</template>

<style lang="scss" scoped>
div {
    margin: 0;
    display: flex;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    > svg {
        width: 100%;
        height: 100%;

        > .c > circle {
            user-select:none;
            pointer-events: none;
            fill: #fff0;
            opacity: 0;
        }

        > g {
            > g.area {
                fill: #eee;
                stroke: #333;
                stroke-width: .5;
                cursor: pointer;
                > path {
                    transition: fill .2s;
                    &:hover {
                        fill: #ccc;
                    }
                }
            }
            > g.center {
                circle {
                    fill: red;
                }
                text {
                    user-select:none;
                    pointer-events: none;
                    text-anchor: middle;
                    font-size: 11px;
                    fill: #000;
                    color: #000;
                    stroke-width: 0;
                    font-weight: bold;
                    > tspan {
                        fill: #fff;
                        stroke: #fff;
                        stroke-width: 2px;
                        stroke-linejoin: round;
                        transform: translateX(200px);
                    }
                }
            }
        }

        &[phone="false"] {
            @keyframes c1 {
                0% {
                    r: 4;
                    opacity: .1;
                }
                100% {
                    r: 20;
                    cy: -80;
                    opacity: 0;
                }
            }
            > .c > circle {
                animation: c1 .5s;
            }
        }

        &[phone="true"] {
            @keyframes c2 {
                0% {
                    cy: -20;
                    opacity: .4;
                    transform: scale(0.2);
                }
                100% {
                    cy: -100;
                    opacity: 0;
                    transform: scale(1);
                }
            }
            > .c > circle {
                animation: c2 0.5s;
            }
        }

    }
}
</style>
