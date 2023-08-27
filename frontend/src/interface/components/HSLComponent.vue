<script lang="ts" setup>
import { ref, computed } from 'vue';
import { setColor } from '@/app';

const props = defineProps({
  h: { type: Number, require: true, default: 0 },
  s: { type: Number, require: true, default: 0 },
  l: { type: Number, require: true, default: 0 },
});

const $emit = defineEmits(['hsl']);

const hue = ref(props.h);
const saturation = ref(props.s);
const lightness = ref(props.l);

const hBar = computed(() => {
  const s = saturation.value;
  const l = lightness.value;
  const range = new Array(37).fill(0)
    .map((_, i) => `hsl(${i * 10},${s}%,${l}%)`)
    .join(',');
  return `background: linear-gradient(to right, ${range});`;
});

const sBar = computed(() => {
  const h = hue.value;
  const l = lightness.value;
  const range = new Array(11).fill(0)
    .map((_, i) => `hsl(${h},${i * 10}%,${l}%)`)
    .join(',');
  return `background: linear-gradient(to right, ${range});`;
});

const lBar = computed(() => {
  const h = hue.value;
  const s = saturation.value;
  const range = new Array(11).fill(0)
    .map((_, i) => `hsl(${h},${s}%,${i * 10}%)`)
    .join(',');
  return `background: linear-gradient(to right, ${range});`;
});

const preview = computed(() => {
  const h = hue.value;
  const s = saturation.value;
  const l = lightness.value;
  return [1, 1, 0.8, 0.6, 0.4, 0.2]
    .map(v => `background: hsla(${h},${s}%,${l}%,${v});`);
});

const submit = () => {
  setColor(hue.value, saturation.value, lightness.value);
  $emit('hsl', `${hue.value},${saturation.value}%,${lightness.value}%`);
}

</script>

<template>
  <div class="hsl">
    <div class="preview">
      <div :style="preview[0]" />
      <div :style="preview[1]" />
      <div :style="preview[2]" />
      <div :style="preview[3]" />
      <div :style="preview[4]" />
      <div :style="preview[5]" />
    </div>
    <ul class="ranges">
      <li class="range h">
        <div :style="hBar" />
        <input
          v-model="hue"
          type="range"
          min="0"
          max="360"
        >
      </li>
      <li class="range s">
        <div :style="sBar" />
        <input
          v-model="saturation"
          type="range"
          min="0"
          max="360"
        >
      </li>
      <li class="range l">
        <div :style="lBar" />
        <input
          v-model="lightness"
          type="range"
          min="0"
          max="360"
        >
      </li>
    </ul>
    <button
      class="submit"
      @click="submit"
    >
      OK
    </button>
  </div>
</template>

<style lang="scss" scoped>
div.hsl {
  display: flex;
  height: 60px;
  width: 300px;

  >.preview {
    position: relative;
    padding: 30px;
    box-shadow: 0 0 4px #0004;

    >* {
      position: absolute;
      top: 80%;
      height: 20%;
      width: 20%;

      &:nth-child(1) {
        top: 0;
        left: 0;
        height: 80%;
        width: 100%;
      }

      &:nth-child(2) {
        left: 0;
      }

      &:nth-child(3) {
        left: 20%;
      }

      &:nth-child(4) {
        left: 40%;
      }

      &:nth-child(5) {
        left: 60%;
      }

      &:nth-child(6) {
        left: 80%;
      }
    }
  }

  >.ranges {
    margin-left: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;

    >.range {
      position: relative;
      height: 100%;

      >div {
        position: absolute;
        top: 50%;
        width: 100%;
        transform: translateY(-50%);
        height: 8px;
        border-radius: 4px;
        box-shadow: 0 0 4px #0004;
      }

      >input[type=range] {
        display: block;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        right: 0;
        width: 100%;
        z-index: 1;
        appearance: none;
        background: transparent;

        &::-ms-thumb,
        &::-moz-range-thumb,
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 0;
          background: #ccc;
          cursor: pointer;
        }

        &::-ms-track,
        &::-ms-fill-lower,
        &::-ms-fill-upper,
        &::-moz-range-track,
        &::-webkit-slider-runnable-track {
          background: transparent;
        }
      }


    }
  }

  >.submit {
    margin: 15px;
    padding: 0 20px;
    margin-right: 0;
    border-radius: 4px;
    border: none;
    background: #0075ff;
    color: #fff;
    box-shadow: 0 0 6px #0008;
    transition: all 0.2s ease-in-out;

    &:hover {
      background: #0066e6;
      box-shadow: 4px 4px 16px #0004;
      transition: all 0.2s ease-in-out;
    }
  }
}
</style>
