<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { join, mark } from '@/api/room'
import geojson from '@/assets/geojson/china.json'
import { View } from '@element-plus/icons-vue'

const props = defineProps<{
  id: string,
  password: string,
}>();

interface Row {
  province: string
  district: string
  index: number
  value: number
}
const tableData = ref<Row[]>([]);
const roomName = ref('');

let close: (() => void) | null = null;

onMounted(() => {
  close = join(props.id, props.password, ({ type, data }) => {
    switch (type) {
      case 'init': {
        if (!data.success)
          return
        const newData = geojson.map(({ province, district }, index) => ({
          province,
          district,
          index,
          value: 0
        }))
        const { data: { name, records } } = data;
        roomName.value = name;

        for (const record of records)
          for (const index in record.records)
            newData[index].value += record.records[index];

        tableData.value = newData
        break;
      }
      case 'update': {
        const [mark, before] = data;
        console.debug(mark, before);
        tableData.value[mark].value += 1;
        if (before != null)
          tableData.value[before].value -= 1;
        break;
      }
    }
    console.log(type, data);
  }, () => close = null);
})
onUnmounted(() => close?.());
</script>

<template>
  <el-row justify="center">
    {{ roomName }}
    <el-table
      :data="tableData"
      style="max-width: 1200px"
    >
      <el-table-column
        prop="index"
        label="Index"
        width="180"
      />
      <el-table-column
        prop="province"
        label="Province"
        width="180"
      />
      <el-table-column
        prop="district"
        label="District"
        width="180"
      />
      <el-table-column
        prop="value"
        label="Value"
        width="180"
      />
      <el-table-column
        widht="180"
        label="Mark"
        align="right"
      >
        <template #default="scoop">
          <el-button
            type="primary"
            size="small"
            :icon="View"
            @click="() => mark(props.id, props.password, scoop.$index)"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>
