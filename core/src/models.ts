import { Args, Params, Context, ExecutionStatus } from './types'
import { readCommands, parseCommand, resolvePlaceholders } from './utils'
import moment from 'moment'

export type CommandRunnable = (args: Args, ctx: Context) => Promise<Params | void>

export interface Account {
  name: string,
  accountUuid: string,
  userUuid: string
}

export interface Env {
  name: string,
  urlPrefix: string
}

export interface CommandExecution {
  id: number,
  command: string,
  args: Args,
  operation ?: string,
  runnable ?: CommandRunnable,
  result ?: Params
  errorMessage ?: string
  status: ExecutionStatus
  startTime ?: any
  endTime ?: any
  elapsedTime ?: number
  run(ctx: Context) : Promise<Params | void>
}

export interface CommandExecutionTaskConfig {
  name ?: string
  command: string
  ctx ?: Context,
  commandRunnableFn: (op: string) => CommandRunnable | undefined
}

export class CommandExecutionTask {
  static lastTaskId: number = 0
  static lastExecutionId: number = 0
  id: number
  name ?: string
  ctx: Context
  startTime ?: moment.Moment
  endTime ?: moment.Moment
  private groups: Record<string, CommandExecution[]> = {}
  constructor(cfg: CommandExecutionTaskConfig) {
    this.id = ++CommandExecutionTask.lastTaskId
    this.name = cfg.name
    this.ctx = cfg.ctx ?? {}
  }
  getExecutions() {
    const executions = Object.values(this.groups)
      .flatMap(arr => arr)
    executions.sort((a, b) => a.id - b.id)
    return executions
  }
  async run() {
    console.log(`Executing task ${this.id}`)
    this.startTime = moment()
    const promises : Promise<void>[] = []
    // TODO: handle group dependencies
    const runGroups = Object.assign({}, this.groups)
    const setupGroup = runGroups.setup
    if (setupGroup) {
      await this.runGroup('setup', this.ctx)
      delete runGroups.setup
    }
    for (let groupId in runGroups) {
      promises.push(this.runGroup(groupId, this.ctx))
    }
    for (const promise of promises) {
      await promise
    }
    this.endTime = moment()
  }
  private async runGroup(group: string, ctx: Context) {
    const executions = this.groups[group]
    console.log(`Executing group [${group}] - operation count: ${executions.length}`)
    let skipped = false
    for (const ex of executions) {
      const op = ex.operation
      ex.args = this.getResolvedArgs(ex.command, ctx)
      if (ex.runnable) {
        if (!skipped) {
          ex.startTime = moment()
          ex.status = ExecutionStatus.Running
          try {
            console.log(`Executing operation [${op}]`, ex.args)
            const result = await ex.run(ctx) ?? {}
            this.updateExecutionFromResult(ex, result)
          } catch (e) {
            this.updateExecutionFromError(ex, e)
            console.error(`Failed to execute operation [${op}]`, e)
            skipped = true
          } finally {
            ex.endTime = moment()
            ex.elapsedTime = ex.endTime.diff(ex.startTime)
          }
        } else {
          console.log(`Skipped operation [${op}]`)
          ex.status = ExecutionStatus.Skipped
        }
      } else {
        console.error(`Invalid operation [${op}]`)
        ex.status = ExecutionStatus.Invalid
      }
    }
  }
  addExecution(groupId: string, execution: CommandExecution) {
    if (!this.groups[groupId]) {
      this.groups[groupId] = []
    }
    this.groups[groupId].push(execution)
    return execution
  }
  static build(cfg: CommandExecutionTaskConfig) : CommandExecutionTask {
    const commands = readCommands(cfg.command)
    const executionTask = new CommandExecutionTask(cfg)
    for (const command of commands) {
      const args = parseCommand(command)
      const operation = args.op
      const groupId = args.group ?? 'main'
      const runnable : CommandRunnable | undefined = cfg.commandRunnableFn(operation)
      const execution : CommandExecution = {
        id: ++this.lastExecutionId,
        command,
        args,
        operation: args.op,
        status: ExecutionStatus.New,
        runnable,
        run(ctx: Context) : Promise<Params | void> {
          if (runnable) {
            return runnable(this.args, ctx)
          } else {
            return Promise.reject('No bound runnable')
          }
        }
      }
      executionTask.addExecution(groupId, execution)
      delete args.group
      delete args.op
    }
    return executionTask
  }
  private getResolvedArgs(command: string, ctx: Context) {
    const args = parseCommand(command)
    const resolvedArgs : Args = Object.assign({}, ctx.defaultArgs, args)
    for (const k in resolvedArgs) {
      resolvedArgs[k] = resolvePlaceholders(resolvedArgs[k], ctx.placeholders)
    }
    delete resolvedArgs.op
    delete resolvedArgs.group
    return resolvedArgs
  }
  private updateExecutionFromResult(ex: CommandExecution, result: Params) {
    ex.result = result
    if ('errorMessage' in result) {
      ex.errorMessage = result.errorMessage
      ex.status = ExecutionStatus.Failed
      delete result.errorMessage
    } else {
      ex.status = ExecutionStatus.Completed
    }
  }
  private updateExecutionFromError(ex: CommandExecution, e: Error) {
    let errorMessage : string
    if (e.message) {
      errorMessage = e.message
    } else {
      errorMessage = String(e)
    }
    ex.errorMessage = errorMessage
    ex.status = ExecutionStatus.Failed
  }
}
