<script lang="ts" setup>
import { ref } from 'vue'
import { app } from '@/app'
import Geo from '@/components/Geo.vue'
import HSL from '@/components/HSL.vue'

const [h, s, l] = app.hsl();
const hsl = { h, s, l };
const geo = ref('');
</script>

<template lang="pug">
div#li
    Geo(:geo='geo')
    div.hsl-box
        HSL(v-bind='hsl' @hsl='hsl=>geo=hsl')
</template>

<style lang="scss" scoped>
div#ui {
    >.hsl-box {
        display: block;
        position: fixed;
        bottom: 5px;
        left: 5px;
        padding: 10px;
        background: #ffffff44;
        backdrop-filter: blur(2px);
        box-shadow: 0 0 4px #0004;
    }
}
</style>
