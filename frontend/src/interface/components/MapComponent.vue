<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { bindMap } from ':/bmapgl'

const chartRef = ref<HTMLElement>();

onMounted(async () => {
    if (!chartRef.value) return
    const map = bindMap(chartRef.value)
    const size = map.getDistrictSize();
    for (let code = 0; code < size; code++)
        map.overlayDistrict(code)
})
</script>

<template>
  <div
    ref="chartRef"
    class="map"
  />
</template>

<style lang="scss">
.map {
    position: relative;
    width: 100vw;
    height: 100vh;

    .BMap_cpyCtrl {
        display: none;
    }

    .anchorBL {
        display: none;
    }
}
</style>@/interface/bmapgl