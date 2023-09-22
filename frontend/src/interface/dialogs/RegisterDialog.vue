<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { checkId, checkEmail, isName, register } from '@/api/user'
import { asyncValidator } from '@/utils/el'
import { show } from ':/dialogs'

const formRef = ref<FormInstance>()
const form = reactive({
  id: '',
  name: '',
  email: '',
  password: '',
  repeat: ''
})

const timeout = (timeout: number) => {
  let cancle: (() => void) | null = null;
  return {
    cancle: () => cancle?.(),
    promise: new Promise((reslove, reject) => {
      const h = setTimeout(reslove, timeout);
      cancle = () => {
        clearTimeout(h);
        reject(new Error('user cancle'));
      }
    })
  };
}

let last_id: (() => void) | null = null;
let last_email: (() => void) | null = null;
const rules = reactive<FormRules<typeof form>>({
  id: {
    required: true,
    validator: asyncValidator(async (value) => {
      last_id?.()
      const { promise, cancle } = timeout(800);
      last_id = cancle;
      await promise;
      const result = await checkId(value)
      if (!result) throw new Error('ID 只允许包含字母、数字、下划线、短横线、点号，且长度为 1-16 位')
      const { success, message, data } = result
      if (!success) throw message
      if (!data) throw new Error('ID被占用')
    }),
    trigger: ['change', 'blur']
  },
  name: {
    required: true,
    validator: (_, value) => isName(value),
    message: '昵称允许长度在50个字符以内的任意字符',
    trigger: ['change', 'blur']
  },
  email: {
    required: true,
    validator: asyncValidator(async (value: string) => {
      last_email?.()
      const { promise, cancle } = timeout(800);
      last_email = cancle;
      await promise;
      const result = await checkEmail(value)
      if (!result) throw new Error('错误的邮箱地址')
      const { success, message, data } = result
      if (!success) throw message
      if (!data) throw new Error('邮箱地址已被占用')
    }),
    trigger: ['change', 'blur']
  },
  password: {
    required: true,
    validator: (_, value) => {
      if (value === '') return new Error('密码不能为空')
      if (form.repeat !== '' && !!formRef.value) formRef.value.validateField('repeat', () => null)
      return true
    },
    trigger: ['blur', 'change']
  },
  repeat: {
    required: true,
    validator: (_, value) => {
      if (value === '') return new Error('密码不能为空')
      if (value !== form.password) return new Error("与上面输入的密码不一致")
      return true
    },
    trigger: ['blur', 'change']
  }
})

const isSubmitting = ref(false)
const submit = async () => {
  if (!formRef.value) return
  isSubmitting.value = true
  if (!(await formRef.value.validate())) {
    isSubmitting.value = false
    return
  }
  const { id, name, email, password } = form
  console.debug({ id, name, email, password })
  const { success, code, message } = await register({ id, name, email, password })
  isSubmitting.value = false
  if (!success)
    ElMessage.error(`注册失败: [${code}] ${message}`)
  ElMessage.success('注册成功')
  show(show.Dialogs.VerificationDialog)
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    label-position="top"
    :rules="rules"
    status-icon
  >
    <el-form-item
      label="ID"
      prop="id"
    >
      <el-input
        v-model="form.id"
        type="text"
        placeholder="请输入ID"
        autocomplete="username"
      />
    </el-form-item>
    <el-form-item
      label="昵称"
      prop="name"
    >
      <el-input
        v-model="form.name"
        type="text"
        placeholder="请输入昵称"
        autocomplete="nickname"
      />
    </el-form-item>
    <el-form-item
      label="Email"
      prop="email"
    >
      <el-input
        v-model="form.email"
        type="email"
        placeholder="请输入邮箱地址"
        autocomplete="email"
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
        autocomplete="new-password"
        clearable
      />
    </el-form-item>
    <el-form-item
      label="密码校验"
      prop="repeat"
    >
      <el-input
        v-model="form.repeat"
        type="password"
        placeholder="请输入和上面相同的密码"
        autocomplete="new-password"
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :loading="isSubmitting"
        @click="submit"
      >
        注册
      </el-button>
    </el-form-item>
  </el-form>
</template>
