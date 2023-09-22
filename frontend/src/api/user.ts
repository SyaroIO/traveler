import { postApi } from '.'
import { isString } from '@/utils/valid'
import { MD5 } from 'crypto-js'

const idRule = /^[A-Za-z0-9_\-.]{1,16}$/
const emailRule =
  /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+)\.[A-Za-z0-9]+$/
const nameRule = /^.{1,50}$/

export const encryptPassword = (password: string) => MD5(password).toString()

export const isId = (id: string) => isString(id) && idRule.test(id)
export const isEmail = (email: string) =>
  isString(email) && emailRule.test(email)
export const isName = (name: string) => isString(name) && nameRule.test(name)

const encryptDocPassword = (doc: { password: string }) => ({
  ...doc,
  password: encryptPassword(doc.password)
})

export const register = async (doc: {
  id: string
  email: string
  name: string
  password: string
}) => postApi<boolean>('/user/register', encryptDocPassword(doc))
export const authenticate = async (doc: { email: string; password: string }) =>
  postApi<void>('/user/authenticate', encryptDocPassword(doc))
export const verification = async (doc: {
  email: string
  verification: string
}) => postApi<void>('/user/register/verification', doc)

export const checkId = async (id: string) =>
  isId(id) && postApi<boolean>('/user/check/id', { id })
export const checkEmail = async (email: string) =>
  isEmail(email) && postApi<boolean>('/user/check/email', { email })
