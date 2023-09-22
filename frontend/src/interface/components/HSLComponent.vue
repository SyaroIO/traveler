<script lang="ts" setup>
import { computed } from 'vue';

interface HSL {
  h: number,
  s: number,
  l: number,
}
const props = defineProps<{
  modelValue: HSL
}>();
const $emit = defineEmits(['update:modelValue']);

const hsl = (key: 'h' | 's' | 'l', value: number | string) => ({ ...props.modelValue, [key]: Number(value) } as HSL)
const emit = (key: Parameters<typeof hsl>[0], e: Event) => $emit('update:modelValue', hsl(key, (e.target as HTMLInputElement).value))
const bar = (key: 'h' | 's' | 'l', sp: number) => {
  const range = new Array(sp).fill(0).map((_, i) => {
    const { h, s, l } = hsl(key, i * 10)
    return `hsl(${h},${s}%,${l}%)`
  })
  console.log(key, range)
  return `background: linear-gradient(to right, ${range});`
}

const preview = computed(() => [1, 1, 0.8, 0.6, 0.4, 0.2]
  .map(v => `background: hsla(${props.modelValue.h},${props.modelValue.s}%,${props.modelValue.l}%,${v});`)
);

</script>

<template>
  <div class="hsl">
    <ul class="preview">
      <li
        v-for="(style, i) in preview"
        :key="i"
        :style="style"
      />
    </ul>
    <ul class="ranges">
      <li class="range h">
        <div :style="bar('h', 37)" />
        <input
          :value="modelValue.h"
          type="range"
          min="0"
          max="360"
          @input="e => emit('h', e)"
        >
      </li>
      <li class="range s">
        <div :style="bar('s', 11)" />
        <input
          :value="modelValue.s"
          type="range"
          min="0"
          max="100"
          @input="e => emit('s', e)"
        >
      </li>
      <li class="range l">
        <div :style="bar('l', 11)" />
        <input
          :value="modelValue.l"
          type="range"
          min="0"
          max="100"
          @input="e => emit('l', e)"
        >
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
div.hsl {
  display: grid;
  height: 60px;
  width: 300px;
  grid-template-columns: 60px auto;

  >.preview {
    display: grid;
    grid-template-columns: repeat(5, 20%);
    grid-template-rows: 80% 20%;
    gap: 0;
    position: relative;
    padding: 0;
    box-shadow: 0 0 4px #0004;

    >:first-child {
      grid-column: 1 / -1;
    }
  }

  >.ranges {
    margin-left: 10px;
    display: grid;
    grid-template-rows: repeat(3, 1fr);

    >.range {
      position: relative;
      display: flex;

      >div {
        width: 100%;
        margin: 6px 0;
        border-radius: 4px;
        box-shadow: 0 0 4px #0004;
      }

      >input {
        display: block;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        right: 0;
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
