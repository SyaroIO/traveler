<template>
  <el-space
    style="width: 100%"
    direction="vertical"
    alignment="flex-start"
  >
    <el-skeleton animated>
      <template #template>
        <el-skeleton-item
          variant="image"
          style="width: 99vw; height: 240px"
        />
        <div
          style="margin-top:20px; padding: 30px;"
        >
          <el-skeleton-item
            variant="h1"
            style="width: 70%"
          />
          <el-skeleton
            :rows="2"
            style="margin-top: 30px;"
          />
          <el-skeleton
            :rows="5"
            style="margin-top: 30px;"
          />
          <el-skeleton
            :rows="3"
            style="margin-top: 30px;"
          />
        </div>
      </template>
    </el-skeleton>
  </el-space>
</template>