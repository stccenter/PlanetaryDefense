import request from '@/utils/request'

export function requestData(params) {
  return request({
    // baseURL: 'http://localhost:5000',
    url: '/search',
    method: 'get',
    params
  })
}
