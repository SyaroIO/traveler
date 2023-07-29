<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormRules } from 'element-plus'
import { checkEmail, authenticate } from '@/api/user'
import { asyncValidator } from '@/utils/el'
import { show } from '@/router';

const form = reactive({ email: '', password: '', })
const rules = reactive<FormRules<typeof form>>({
  email: {
    required: true,
    validator: asyncValidator(async (value: string) => {
      const result = await checkEmail(value)
      if (!result) throw new Error('错误的邮箱地址')
      const { success, data } = result
      if (!success) throw new Error('错误的邮箱地址')
      if (data) throw new Error('用户不存在')
    }),
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '密码不能为空',
    trigger: ['blur', 'change']
  },
})

const isSubmitting = ref(false)
const submit = async () => {
  isSubmitting.value = true
  const { email, password } = form
  console.debug({ email, password })
  const { success, code, message } = await authenticate({ email, password })
  isSubmitting.value = false
  if (success) return ElMessage.success('登录成功')
  ElMessage.error(`登录失败: [${code}] ${message}`)
  if (code === 3)
    show('verification')
}
</script>

<template>
  <el-form
    :model="form"
    label-position="top"
    :rules="rules"
    status-icon
  >
    <el-form-item
      label="Email"
      prop="email"
    >
      <el-input
        v-model="form.email"
        type="text"
        placeholder="请输入电子邮箱"
        autocomplete="username"
      />
    </el-form-item>
    <el-form-item
      label="密码"
      prop="password"
    >
      <el-input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        autocomplete="current-password"
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :loading="isSubmitting"
        @click="submit"
      >
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>
