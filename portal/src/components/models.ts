import moment from 'moment'
import { CommandExecution } from '../../../core/src/models'

export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface TaskView {
  id: number
  name ?: string,
  startTime ?: any
  endTime ?: any
  executions: CommandExecution[]
}
