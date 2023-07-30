<script lang="ts" setup>
import { ref } from 'vue'
import { route } from ':/routers'
import moment from 'moment'

const value = ref(moment())
setInterval(() => value.value = moment(), 1000)
const back = () => route('index')
</script>

<template>
  <el-row justify="center">
    <el-col>
      <el-result
        icon="warning"
        title="404 Not Found"
        sub-title="您好像走丢了"
      >
        <template #extra>
          <h1>{{ value.format('H:mm:ss') }}</h1>
          <p>{{ value.format('YYYY/M/D') }}</p>
          <p>{{ value.format('dddd') }}</p>
          <br>
          <el-button
            color="#4354b0"
            dark
            plain
            size="large"
            should-add-space
            @click="back"
          >
            回首页
          </el-button>
        </template>
      </el-result>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-col {
  text-align: center;
}

.countdown-footer {
  margin-top: 8px;
}
</style>
