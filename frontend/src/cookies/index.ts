import Cookies from 'js-cookie'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

export const getCookie = Cookies.get
export const setCookie = Cookies.set
export const removeCookie = Cookies.remove

export const fingerprint = async () => {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  setCookie('fingerprint', result.visitorId, { expires: 365 })
}
