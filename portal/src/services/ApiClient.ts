import axios from 'axios'
import { TaskView } from 'src/components/models'
import { Args } from '../models/types'

export class ApiClient {
  async sendCommands({ command }: Args) : Promise<TaskView> {
    return axios.request({
      method: 'POST',
      url: 'http://localhost:3000/api/commands',
      headers: {
        'Content-Type': 'text/plain'
      },
      data: command
    }).then(res => res.data)
  }
  async getOrders() {
    return axios.request({
      method: 'GET',
      url: 'http://localhost:3000/api/get-orders',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.data)
  }

}
