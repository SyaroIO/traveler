<script lang="ts" setup>
import { ref } from 'vue'
import { subscribe as ss, mark } from '@/api/room';
interface Message {
  message: string
}

const messages = ref<Message[]>([])
let close: (() => void) | null = null
const subscribe = () => {
  if (close) {
    close()
    close = null
    return
  }
  close = ss<Message>('test', '123', message => {
    console.debug('message', message)
    messages.value.push(message)
  }, () => close = null);
}
const sseInput = ref('')
const send = () => {
  if (!sseInput.value) return
  mark('test', {
    message: sseInput.value
  })
}
</script>

<template>
  <el-space wrap>
    <el-card>
      <template #header>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-text>测试SSE</el-text>
          </el-col>
          <el-col :span="12">
            <el-button @click="subscribe">
              Start
            </el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input v-model="sseInput" />
          </el-col>
          <el-col :span="12">
            <el-button @click="send">
              发送
            </el-button>
          </el-col>
        </el-row>
      </template>
      <el-row
        v-for="[i, { message }] of messages.entries()"
        :key="i"
      >
        <el-text>
          {{ i }}: {{ message }}
        </el-text>
      </el-row>
    </el-card>
  </el-space>
</template>