<script setup>
import { ref } from 'vue';
import G from './G.vue';
import Menu from './Menu.vue';
const { abs, sqrt } = Math;
const { innerWidth, innerHeight } = window;
const width = ref(innerWidth);
const height = ref(innerHeight);
const scale = ref(1);
const areas = ref([]);
const draw = ()=>areas.value = $.app.geomap.main.features.map(e=>e.properties.code).filter(v=>v);
const codes = ref({});
const x = ref(0);
const y = ref(0);
const phone = ref(false);

const { geo } = defineProps({geo: {type: String, default: ''}});

let down = false;
let downX = 0;
let downY = 0;
let lastX = 0;
let lastY = 0;
let isClick = true;

const reScale = (s, cx, cy) => {
    if(s>200) s = 200;
    if(s<0.1) s = 0.1;
    if(scale.value==s) return;
    [scale.value, s] = [s, s / scale.value];
    x.value = cx - (cx - x.value) * s;
    y.value = cy - (cy - y.value) * s;
    $.app.geomap.scale(scale.value);
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
    (deltaY>0?0.7:1.3)*scale.value, x, y
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

const menu = ref({code: 0, name: '', select: 0, x: 0, y: 0, display: 'none'});
const click = (ccode, [e, code, name]) => {
    if(!isClick) {
        isClick = true;
        return;
    }
    e.stopPropagation();
    menu.value = {
        ccode, code, name,
        select: $.app.getLevel(code),
        x: e.clientX,
        y: e.clientY,
        display: 'block'
    };
};
const click2 = ()=>menu.value.display='none';
const select = ([ccode, code, value])=>{
    $.app.setLevel(code, value);
    codes.value[ccode] = Date.now();
    menu.value.display='none';
};

document.onkeydown = e=>{
    if(e.key === 'Escape') {
        scale.value = 1;
        x.value = 0;
        y.value = 0;
        draw();
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
    x.value = dx / w * innerWidth + innerWidth / 2;
    y.value = dy / h * innerHeight + innerHeight / 2;
    $.app.geomap.resize(width.value, height.value);
    draw();
};
$.app.geomap.resize(width.value, height.value);
draw();

</script>

<template>
    <div class="geo" :key="geo">
        <svg :viewBox="`0 0 ${width} ${height}`" :width="width" :height="height"
            @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup" @wheel="wheel"
            @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" @click="click2">
            <filter id="hover-shadow">

                <!-- <feMorphology operator="dilate" radius="0" in="SourceAlpha" result="thicken" />
                <feGaussianBlur in="thicken" stdDeviation="5" result="blurred" />
                <feFlood flood-color="#000" result="glowColor" />
                <feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />
                <feMerge>
                    <feMergeNode in="softGlow_colored"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge> -->

                <feFlood flood-color="#000" />
                <feComposite in2="SourceGraphic" operator="out" />
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite operator="atop" in2="SourceGraphic"/>
            </filter>
            <filter id="normal-shadow">
                <feFlood flood-color="#000" />
                <feComposite in2="SourceGraphic" operator="out" />
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite operator="atop" in2="SourceGraphic"/>
            </filter>
            <g :transform="`translate(${x},${y})`">
                <G v-for="code of areas" :key="`p${scale}_${code}_${codes[code]}`"
                    :code="code" :scale="scale" @area="d=>click(code, d)"
                    @hover="areas.sort((a,b)=>a==code?1:b==code?-1:0)"
                />
                <G v-for="code of areas" :key="`t${scale}_${code}`"
                    :code="code" :scale="scale" :t="true"
                />
            </g>
        </svg>
        <Menu class="menu"
            :ccode="menu.ccode"
            :code="menu.code"
            :name="menu.name"
            :select="menu.select"
            @select="select"
            :style="`
                left: ${menu.x}px;
                top: ${menu.y}px;
                display: ${menu.display};
            `"
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
    > svg {
        width: 100%;
        height: 100%;
    }
    > .menu {
        position: fixed;
    }
}
</style>
