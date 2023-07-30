<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormRules } from 'element-plus'
import { checkEmail, verification } from '@/api/user'
import { asyncValidator } from '@/utils/el'
import { close } from ':/dialogs'

const form = reactive({ email: '', vcode: '', })
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
  vcode: {
    required: true,
    message: '验证码不能为空',
    trigger: ['blur', 'change']
  },
})

const isSubmitting = ref(false)
const submit = async () => {
  isSubmitting.value = true
  const { email, vcode } = form
  console.debug({ email, vcode })
  const { success, code, message } = await verification({ email, verification: vcode })
  isSubmitting.value = false
  if (!success)
    return ElMessage.error(`验证失败: [${code}] ${message}`)
  close()
  return ElMessage.success('验证成功')
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
      label="验证码"
      prop="password"
    >
      <el-input
        v-model="form.vcode"
        type="text"
        placeholder="请输入验证码"
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :loading="isSubmitting"
        @click="submit"
      >
        验证
      </el-button>
    </el-form-item>
  </el-form>
</template>
