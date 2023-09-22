<script lang="ts" setup>
import { TrendCharts, Bicycle, MapLocation, User, Link } from '@element-plus/icons-vue'
import { route } from ':/routers'
import { Dialogs, useDialogStore } from ':/dialogs';
const dialog = useDialogStore()
</script>

<template>
  <el-row justify="center">
    <el-col style="max-width: 850px;">
      <el-row>
        <el-text size="large">
          <h1>欢迎，旅行者。</h1>
        </el-text>
      </el-row>
      <el-row>
        <el-text>
          {{ '\u3000\u3000' }}今天，想看看您的
          <el-button
            link
            size="large"
            :icon="Bicycle"
            @click="() => route('footprint/personal')"
          >
            个人足迹
          </el-button>吗？

          还是说...想看看
          <el-button
            link
            size="large"
            :icon="TrendCharts"
            @click="() => route('footprint/group')"
          >
            群体足迹
          </el-button>呢？

          没什么想干的事的话，不妨来这里随便
          <el-button
            link
            size="large"
            :icon="MapLocation"
            @click="() => route('footprint/random')"
          >
            踩一下
          </el-button>。
        </el-text>
        <el-text>
          {{ '\u3000\u3000' }}哦，对了。记得要
          <el-button
            link
            size="large"
            :icon="User"
            @click="() => dialog.show(Dialogs.AuthenticateDialog)"
          >
            登录
          </el-button>哦，不然很多事都做不了呢。

          要是没有账号的话，可以到这边来登记
          <el-button
            link
            size="large"
            :icon="Link"
            @click="() => dialog.show(Dialogs.RegisterDialog)"
          >
            注册
          </el-button>哦。
        </el-text>
      </el-row>
    </el-col>
  </el-row>
</template>

<style type="scss" scoped>
.el-row {
  margin-top: 15px;
}

.el-button {
  padding: 0;
  margin: 0;
}
</style>