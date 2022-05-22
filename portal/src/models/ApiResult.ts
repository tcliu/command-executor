import { Params } from './types'

export interface ApiResult {
  command ?: string
  axiosOptions ?: Params
  startTime ?: any
  endTime ?: any
  data ?: any
}
