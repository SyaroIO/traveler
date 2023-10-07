<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { join, mark, type RoomInitMessage, type RoomUpdateMessage } from '@/api/room'
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
const tooltip = (index: number) => `<strong>${info(index)?.fullname}<br /><span style="color:#88F;">${values.value[index]}</span></strong> 人标记`

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

const clickMark = async () => {
  const { success, message } = await mark(props.id, props.password, dialog.value.index);
  if (!success) return ElMessage.error('标记失败: ' + message)
  ElMessage.success('标记成功');
  dialog.value.mine = dialog.value.index;
}

const wherei = () => {
  const index = dialog.value.mine
  ElMessage.success(index == -1 ? '您还没有标记位置' : `您标记了 [${info(index)?.fullname}]`);
}

const init = ({ success, data }: RoomInitMessage['data']) => {
  if (!success) return
  const { name, records } = data;
  roomName.value = name;
  for (const record of records) {
    if (record.me)
      dialog.value.mine = Number(Object.keys(record.records)[0] ?? -1)
    for (const index in record.records)
      values.value[Number(index)] += record.records[index];
  }
}
const update = ([mark, before]: RoomUpdateMessage['data']) => {
  values.value[Number(mark)] += 1;
  if (before != null)
    values.value[Number(before)] -= 1;
  if (dialog.value.display)
    dialog.value.value = values.value[dialog.value.index]
}
let close: (() => void) | null = null;
onMounted(() => {
  close = join(props.id, props.password, ({ type, data }) => {
    switch (type) {
      case 'init': return init(data)
      case 'update': return update(data)
    }
  }, () => close = null);
})
onUnmounted(() => close?.());
</script>

<template>
  <teleport to="#fabtl">
    <el-row>
      <el-tooltip
        content="我在哪"
        placement="right"
      >
        <el-button
          circle
          :type="dialog.mine == -1 ? 'primary' : 'success'"
          size="large"
          :icon="Location"
          @click="wherei"
        />
      </el-tooltip>
    </el-row>
  </teleport>
  <MapComponent
    :max="5"
    :values="values"
    :tooltip="tooltip"
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
      <el-col :span="6">
        <el-row
          justify="center"
          align="middle"
        >
          <el-tooltip
            v-if="dialog.index == dialog.mine"
            content="我也在这"
            placement="right"
          >
            <el-button
              circle
              type="success"
              size="large"
              :icon="Location"
            />
          </el-tooltip>
          <el-tooltip
            v-else
            content="标记位置"
            placement="right"
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
