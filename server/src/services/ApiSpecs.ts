import { Args, Context } from "../../../core/src/types"
import { ApiSpec, BaseApiSpec, BaseAuthApiSpec } from "./ApiSpec"

export const apiSpecs : Record<string,ApiSpec> = {

  getInstruments: new class extends BaseApiSpec {
    method() {
      return 'GET'
    }
    path() {
      return '/api/get-instruments'
    }
  },

  createOrder: new class extends BaseAuthApiSpec {
    method() {
      return 'POST'
    }
    path() {
      return '/api/create-order'
    }
    data(args: Args, ctx: Context) {
      return {
        instrument_name: args.inst,
        quantity: args.qty,
        hourly_rate: args.hourlyRate,
        side: args.side,
        time_in_force: args.timeInForce
      }
    }
  },

  getOrders: new class extends BaseAuthApiSpec {
    method() {
      return 'GET'
    }
    path() {
      return '/api/get-orders'
    }
  }

}
