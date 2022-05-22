
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import os from 'os'
import isDocker from 'is-docker'
import moment from 'moment'

console.log(moment())

import { Args, Params, Context } from '../../core/src/types'
import { CommandExecutionTask, CommandExecutionTaskConfig, CommandRunnable } from '../../core/src/models'
import { commandRunnables } from './services/CommandRunnables'
import { apiSpecs } from './services/ApiSpecs'

const app = express()
const api = express.Router()
const port = 3000

let orderId = 0
const orders : Object[] = []
const tasks : CommandExecutionTask[] = []

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.text({ type: 'text/plain' }))
app.use('/api', api)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

api.get('/hello', (req, res, next) => {
  res.set('content-type', 'text/plain')
  res.send('Hello World!')
})

api.post('/create-order', (req, res, next) => {
  console.log('create-order', req.query, req.body)
  if (!req.headers['account-uuid']) {
    res.status(400)
    res.json({
      reason: 'MISSING_ACCOUNT_ID',
    })
  } else if (!req.headers['user-uuid']) {
    res.status(400)
    res.json({
      reason: 'MISSING_USER_ID',
    })
  } else if (!req.body.instrument_name) {
    res.status(400)
    res.json({
      reason: 'MISSING_INSTRUMENT_NAME',
    })
  } else if (!req.body.quantity) {
    res.status(400)
    res.json({
      reason: 'MISSING_QUANTITY',
    })
  } else {
    const order = {
      id: ++orderId,
      account_uuid: req.headers['account-uuid'],
      user_uuid: req.headers['user-uuid'],
      instrument_name: req.body.instrument_name,
      quantity: req.body.quantity,
      hourly_rate: req.body.hourly_rate,
      side: req.body.side,
      status: 'ACTIVE',
      created_time: new Date().getTime(),
      updated_time: new Date().getTime(),
    }
    orders.push(order)
    res.json({
      data: order,
    })
  }
})

api.get('/get-instruments', (req, res, next) => {
  console.log('get-instruments', req.query, req.body)
  if (req.query.symbol === 'xxx') {
    res.status(400)
    res.json({
      reason: 'INVALID_SYMBOL',
    })
  } else {
    const ids = Array.from(Array(10).keys())
    const insts = ids.map((id) => ({
      id,
      name: 'Instrument' + id,
    }))
    res.json({
      data: insts,
    })
  }
})

api.get('/get-orders', (req, res, next) => {
  console.log('get-orders', req.query, req.body)
  res.json(orders)
})

api.get('/get-orders/:id', (req, res, next) => {
  console.log('get-orders/' + req.params.id, req.query, req.body)
  const order = orders[Number(req.params.id) - 1]
  if (order) {
    res.json({ data: order })
  } else {
    res.status(400)
    res.json({
      reason: 'ORDER_NOT_FOUND',
    })
  }
})

api.post('/commands', (req, res, next) => {
  const taskConfig : CommandExecutionTaskConfig = {
    command: req.body.trim(),
    commandRunnableFn: op => commandRunnables[op] ?? apiSpecs[op]?.toCommandRunnable()
  }
  const task = CommandExecutionTask.build(taskConfig)
  task.run().then(v => {
    tasks.push(task)
    res.json(getJson(task))
  })

})

api.get('/tasks', (req, res, next) => {
  const jsons = tasks.map(getJson)
  res.json(jsons)
})

function getJson(task: CommandExecutionTask) {
  return {
    id: task.id,
    startTime: task.startTime,
    endTime: task.endTime,
    context: task.ctx,
    executions: task.getExecutions()
  }
}