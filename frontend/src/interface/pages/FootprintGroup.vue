<script lang="ts" setup>
import { ref } from 'vue'
import * as room from '@/api/room'
import { Delete, Edit, Share, View } from '@element-plus/icons-vue'
import { route } from ':/routers'
const jRoom = ref('')
const jPswd = ref('')
const cName = ref('')
const cPswd = ref('')
const rooms = ref<{
  id: string
  pswd: string,
  name: string,
}[]>([])

const create = async () => {
  const name = cName.value;
  const pswd = cPswd.value;
  const { success, data: id } = await room.create(name, pswd)
  if (!success) return;
  rooms.value.push({ id, pswd, name })
}

const del = async (id: string) => {
  const { success } = await room.del(id);
  if (!success) return;
  rooms.value = rooms.value.filter(room => room.id != id)
}

const join = async (id: string, password: string) => {
  route('footprint/room', { id, password })
}

const get = async () => {
  const { success, data } = await room.get();
  if (!success) return;
  rooms.value = data.map(([id, pswd, name]) => ({ id, pswd, name }));
}

get();

</script>

<template>
  <el-row justify="center">
    <el-space wrap>
      <el-card
        style="width: 280px;"
        :body-style="{ padding: '10px' }"
      >
        <el-row
          :gutter="10"
          align="middle"
        >
          <el-col :span="18">
            <el-space wrap>
              <el-input
                v-model="cName"
                width="100"
                placeholder="房间名"
              />
              <el-input
                v-model="cPswd"
                placeholder="密码"
              />
            </el-space>
          </el-col>
          <el-col
            :span="6"
            align="center"
          >
            <el-button
              circle
              type="primary"
              size="large"
              @click="create"
            >
              创建
            </el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card
        style="width: 280px;"
        :body-style="{ padding: '10px' }"
      >
        <el-row
          :gutter="10"
          align="middle"
        >
          <el-col :span="18">
            <el-space wrap>
              <el-input
                v-model="jRoom"
                placeholder="房间号"
              />
              <el-input
                v-model="jPswd"
                placeholder="密码"
              />
            </el-space>
          </el-col>
          <el-col
            :span="6"
            align="center"
          >
            <el-button
              circle
              type="primary"
              size="large"
              @click="() => join(jRoom, jPswd)"
            >
              加入
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-space>
  </el-row>
  <el-row
    class="room-row"
    justify="center"
  >
    <el-card :body-style="{ padding: '10px', 'min-width': '800px' }">
      <template #header>
        <el-span>我创建的房间</el-span>
      </template>
      <el-table
        :data="rooms"
      >
        <el-table-column
          prop="id"
          label="房间号"
          width="210"
        />
        <el-table-column
          prop="name"
          label="房间名"
        />
        <el-table-column
          prop="pswd"
          label="密码"
          width="130"
        />
        <el-table-column
          label="操作"
          align="right"
          width="200"
        >
          <template #default="scoop">
            <el-button-group size="small">
              <el-tooltip content="进入">
                <el-button
                  type="primary"
                  :icon="View"
                  @click="() => join(scoop.row.id, scoop.row.pswd)"
                />
              </el-tooltip>
              <el-tooltip content="分享">
                <el-button
                  type="success"
                  :icon="Share"
                />
              </el-tooltip>
              <el-tooltip content="修改">
                <el-button
                  type="warning"
                  :icon="Edit"
                />
              </el-tooltip>
              <el-tooltip content="删除">
                <el-button
                  type="danger"
                  :icon="Delete"
                  @click="() => del(scoop.row.id)"
                />
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-row>
</template>

<style scoped>
.room-row {
  margin-top: 10px;
}
</style>