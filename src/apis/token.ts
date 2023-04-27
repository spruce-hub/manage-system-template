import Cookies from 'js-cookie'

const TokenKey = 'token'
export function getToken() {
  return Cookies.get(TokenKey) || ''
}
export function saveToken(str: string, options?: any) {
  Cookies.set(TokenKey, str, options)
}
export function clearToken() {
  Cookies.remove(TokenKey)
}
