import { clearToken, getToken } from './token'
// TODO 补充ofetch请求器
export const http = {} as any

export function setHttpToken(str?: string) {
  const token = str || getToken()
}
