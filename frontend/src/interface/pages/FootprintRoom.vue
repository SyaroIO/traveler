<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { join, mark } from '@/api/room'
import { size, info } from '@/utils/geo'
import { Location } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import MapComponent from ':/components/MapComponent.vue'

const props = defineProps<{
  id: string,
  password: string,
}>();

const roomName = ref('');
const values = ref<number[]>(new Array(size).fill(0))

const dialog = ref<{
  display: boolean,
  province: string,
  district: string,
  index: number,
  mine: number,
  value: number,
}>({ display: false, province: '', district: '', index: -1, mine: -1, value: 0 })
const click = (index: number) => {
  const districtData = info(index)
  if (!districtData) return;
  dialog.value.index = index
  dialog.value.province = districtData.province
  dialog.value.district = districtData.name
  dialog.value.value = values.value[index]
  dialog.value.display = true
}

let close: (() => void) | null = null;
const clickMark = async () => {
  const { success, message } = await mark(props.id, props.password, dialog.value.index);
  if (success) ElMessage.success('标记成功')
  else ElMessage.error('标记失败: ' + message)
}

onMounted(() => {
  close = join(props.id, props.password, ({ type, data }) => {
    switch (type) {
      case 'init': {
        if (!data.success)
          return
        const { data: { name, records } } = data;
        roomName.value = name;

        for (const record of records) {
          if (record.me)
            dialog.value.mine = Number(Object.keys(record.records)[0] ?? -1)
          for (const index in record.records)
            values.value[Number(index)] += record.records[index];
        }

        break;
      }
      case 'update': {
        const [mark, before] = data;
        values.value[Number(mark)] += 1;
        if (before != null)
          values.value[Number(before)] -= 1;
        break;
      }
    }
  }, () => close = null);
})
onUnmounted(() => close?.());
</script>

<template>
  <MapComponent
    :max="5"
    :values="values"
    @district-click="click"
  />
  <el-dialog
    v-model="dialog.display"
    :title="`${dialog.province}${dialog.district}`"
    width="192"
  >
    <el-row
      justify="center"
      align="middle"
    >
      <el-col :span="18">
        <el-text>
          标记人数: {{ dialog.value }}
        </el-text>
      </el-col>
      <el-col :span="6" >
        <el-row
          justify="center"
          align="middle"
        >
          <el-tooltip
            content="我也在这"
            placement="right"
            v-if="dialog.index == dialog.mine"
            >
            <el-button
            circle
            type="success"
            size="large"
            :icon="Location"
          />
          </el-tooltip>
          <el-tooltip
            content="标记位置"
            placement="right"
            v-else
          >
            <el-button
              circle
              type="primary"
              size="large"
              :icon="Location"
              @click="clickMark"
            />
          </el-tooltip>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>
