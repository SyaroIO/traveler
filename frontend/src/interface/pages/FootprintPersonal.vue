<script lang="ts" setup>
import { ref } from 'vue'
import geojson from '@/assets/geojson/china.json'
import { get, set } from '@/api/mark'
import type { MarkData } from '@/api/mark'

interface Row {
  province: string
  district: string
  index: number
  value: number
}
const tableData = ref<Row[]>([]);

let values: Map<number, number> | null = null
get().then(({ success, data }) => {
  if (!success) return;
  values = new Map(data);
  geojson.forEach(({ province, district }, index) => tableData.value.push({
    province,
    district,
    index,
    value: values?.get(index) ?? 0
  }))
})

const tableRowClassName = ({ row: { value } }: { row: Row }) => 'l' + value
const lv = (index: number, value: number) => {
  tableData.value[index].value = value
}
const level = [
  { value: 0, button: '清除', state: '无' },
  { value: 1, button: '想去', state: '想去' },
  { value: 2, button: '路过', state: '路过' },
  { value: 3, button: '去过', state: '去过' },
  { value: 4, button: '住过', state: '住过' },
  { value: 5, button: '家乡', state: '家乡' }
];

const submit = async () => {
  const data: MarkData = [];
  for (const { index, value } of tableData.value) {
    if (value === 0) continue;
    data.push([index, value]);
  }
  if (data.length === 0) return;
  const filtered = data.filter(([index]) => !values?.has(index))
  if (filtered.length === 0) return;
  await set(data)
}

</script>

<template>
  <el-row justify="center">
    <el-table
      :data="tableData"
      style="max-width: 550px"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        prop="index"
        label="Index"
      />
      <el-table-column
        prop="province"
        label="Province"
      />
      <el-table-column
        prop="district"
        label="District"
      />
      <el-table-column
        label="Value"
      >
        <template #default="scoop">
          {{ level[scoop.row.value].state }}
        </template>
      </el-table-column>
      <el-table-column
        widht="180"
        align="right"
      >
        <template #header>
          <el-button
            type="success"
            @click="submit"
          >
            Submit
          </el-button>
        </template>
        <template #default="scoop">
          <el-popover
            placement="left"
            trigger="hover"
          >
            <template #reference>
              <el-button
                type="primary"
                size="small"
              >
                Operations
              </el-button>
            </template>
            <el-col
              v-for="{ button, value } of level"
              :key="button"
              :row="24"
            >
              <el-button
                text
                size="small"
                style="width:100%"
                @click="lv(scoop.$index, value)"
              >
                {{ button }}
              </el-button>
            </el-col>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>

<style lang="scss">
.el-table .l0 {
  --el-table-tr-bg-color: hsla(220, 100%, 50%, 0);
}

.el-table .l1 {
  --el-table-tr-bg-color: hsla(220, 100%, 50%, 0.2);
}

.el-table .l2 {
  --el-table-tr-bg-color: hsla(220, 100%, 50%, 0.4);
}

.el-table .l3 {
  --el-table-tr-bg-color: hsla(220, 100%, 50%, 0.6);
}

.el-table .l4 {
  --el-table-tr-bg-color: hsla(220, 100%, 50%, 0.8);
}

.el-table .l5 {
  --el-table-tr-bg-color: hsla(220, 100%, 50%, 1);
}
</style>
