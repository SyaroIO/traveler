<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import type { Component } from 'vue'
defineProps<{
  component: () => Promise<Component>
}>()
</script>

<template>
  <template v-if = "component">
    <Suspense>
      <component :is="defineAsyncComponent(component)" />
      <template #fallback>
      <el-skeleton
        :rows="10"
        animated
      />
      </template>
    </Suspense>
  </template>
</template>