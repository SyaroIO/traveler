import { defineStore } from 'pinia'
import { ref, shallowRef, defineAsyncComponent } from 'vue'

export enum Dialogs {
  Empty,
  AuthenticateDialog,
  RegisterDialog,
  VerificationDialog,
  Test
}

const visible = ref(false)
const name = ref(Dialogs.Empty)
const component = shallowRef(null)
const title = ref('')
export function show(dialog: Dialogs) {
  if (dialog === Dialogs.Empty) {
    visible.value = false
    return
  }
  visible.value = true
  if (dialog === name.value) return
  name.value = dialog
  const current = getDialog(dialog)
  component.value = current.component
  title.value = current.title
}
show.Dialogs = Dialogs
export const close = () => show(Dialogs.Empty)
export const dialogs = new Map()
export const getDialog = (name: Dialogs) => dialogs.get(name)
export const useDialogStore = defineStore('dialog', () => ({ visible, name, component, title, show }))
const dialogList = [
  { key: Dialogs.AuthenticateDialog, title: '登录', component: () => import('./AuthenticateDialog.vue') },
  { key: Dialogs.RegisterDialog, title: '注册', component: () => import('./RegisterDialog.vue') },
  { key: Dialogs.VerificationDialog, title: '验证', component: () => import('./VerificationDialog.vue') },
  {
    key: Dialogs.Test,
    title: 'Test',
    component: async () => {
      const component = await import('./RegisterDialog.vue')
      await new Promise((reslove) => setTimeout(reslove, 1000))
      return component
    }
  }
]
dialogList.forEach(({ key, title, component }) =>
  dialogs.set(key, { title, component: defineAsyncComponent(component) })
)
