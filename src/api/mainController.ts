// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** test GET /api/test */
export async function testUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/api/test', {
    method: 'GET',
    ...(options || {}),
  })
}
