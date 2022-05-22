import { Account, CommandRunnable, Env } from '../../../core/src/models'
import { Args, Context } from '../../../core/src/types'
import { delay } from '../../../core/src/utils'

export const commandRunnables : Record<string,CommandRunnable> = {

  async defaultArgs(args: Args, ctx: Context) {
    if (!ctx.defaultArgs) {
      ctx.defaultArgs = {}
    }
    Object.assign(ctx.defaultArgs, args)
  },

  async placeholders(args: Args, ctx: Context) {
    if (!ctx.placeholders) {
      ctx.placeholders = {}
    }
    Object.assign(ctx.placeholders, args)
  },

  async env(args: Args, ctx: Context) {
    if (!ctx.envs) {
      ctx.envs = {}
    }
    if (args.name && args.urlPrefix) {
      const env : Env = {
        name: args.name,
        urlPrefix: args.urlPrefix
      }
      ctx.envs[args.name] = env
    } else if (!args.name) {
      throw new Error('Missing argument [name]')
    } else if (!args.urlPrefix) {
      throw new Error('Missing argument [urlPrefix]')
    }
  },

  async account(args: Args, ctx: Context) {
    if (!ctx.accounts) {
      ctx.accounts = {}
    }
    if (args.name && args.accountUuid && args.userUuid) {
      const account : Account = {
        name: args.name,
        accountUuid: args.accountUuid,
        userUuid: args.userUuid
      }
      ctx.accounts[args.name] = account
    } else if (!args.name) {
      throw new Error('Missing argument [name]')
    } else if (!args.accountUuid) {
      throw new Error('Missing argument [accountUuid]')
    } else if (!args.userUuid) {
      throw new Error('Missing argument [userUuid]')
    }
  }

}