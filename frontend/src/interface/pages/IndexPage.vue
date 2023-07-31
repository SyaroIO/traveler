<template>
  <el-skeleton animated>
    <template #template>
      <el-skeleton-item
        variant="image"
        style="width: 100%; height: 240px"
      />
      <div
        style="margin-top:20px; padding: 30px;"
      >
        <el-row :gutter="20">
          <el-skeleton-item
            variant="h1"
            style="width: 70%"
          />
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 100px"
            />
          </el-col>
          <el-col :span="20">
            <el-skeleton
              :rows="2"
              style="width: 100%"
            />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-skeleton :rows="5" />
        </el-row>
        <el-row :gutter="20">
          <el-skeleton :rows="3" />
        </el-row>
      </div>
    </template>
  </el-skeleton>
</template>

<style lang="scss">
.el-row {
  margin-bottom: 30px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>