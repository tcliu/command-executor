import axios, { AxiosResponse } from "axios"
import { CommandRunnable } from "../../../core/src/models"
import { Args, Context, Params } from "../../../core/src/types"

export interface ApiSpec {
  toCommandRunnable(): CommandRunnable
}

export abstract class BaseApiSpec implements ApiSpec {
  abstract method(args: Args, ctx: Context): string
  abstract path(args: Args, ctx: Context): string
  axiosOptions(args: Args, ctx: Context): Params {
    const env = ctx.envs?.[args.env ?? 'local']
    const urlPrefix = env?.urlPrefix ?? ''
    const path = this.path(args, ctx)
    return {
      method: this.method(args, ctx),
      url: `${urlPrefix}${path}`,
      headers: this.headers(args, ctx),
      params: this.params(args, ctx),
      data: this.data(args, ctx)
    }
  }
  toCommandRunnable() : CommandRunnable {
    return (args: Args, ctx: Context) => this.run(args, ctx)
  }
  async run(args: Args, ctx: Context) : Promise<Params> {
    const axiosOptions : Params = this.axiosOptions(args, ctx)
    const res : Params = {
      axiosOptions
    }
    try {
      const resp = await axios.request(axiosOptions)
      res.data = resp.data
      res.status = resp.status,
      res.statusText = resp.statusText
      if (res.status !== 200) {
        res.errorMessage = `Invalid status: ${res.status}`
      }
      this.handleResponse(resp, ctx)
    } catch (e) {
      res.errorMessage = e.message
      this.handleError(e, ctx)
    }
    return res
  }
  headers(args: Args, ctx: Context): Params | undefined {
    return {
      'content-type': 'application/json'
    }
  }
  params(args: Args, ctx: Context): Params | undefined {
    return undefined
  }
  data(args: Args, ctx: Context): Params | undefined {
    return undefined
  }
  handleResponse(res: AxiosResponse, ctx: Context) {

  }
  handleError(e: Error, ctx: Context) {

  }
}

export abstract class BaseAuthApiSpec extends BaseApiSpec {
  headers(args: Args, ctx: Params = {}) {
    let headers = super.headers(args, ctx)
    const account = ctx.accounts?.[args.account]
    if (account) {
      headers = Object.assign({}, headers, {
        'account-uuid': account.accountUuid,
        'user-uuid': account.userUuid
      })
    }
    return headers
  }
}
