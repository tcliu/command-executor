
import { Params } from '../models/types'

const setupTemplates = `
op=placeholders group=setup gg=123
op=defaultArgs group=setup env=local
op=env group=setup name=local urlPrefix=http://localhost:3000 group=setup
op=account group=setup name=acct1 accountUuid=a123 userUuid=u123
op=account group=setup name=acct2 accountUuid=a124 userUuid=u124
`

const templates : Record<string,string> = {
  createLoan: `
  ${setupTemplates}
  op=createOrder inst=BTC-USD qty=0.01 hourlyRate=0.3 side=BORROW timeInForce=GOOD_TILL_CANCEL account=acct1
  op=createOrder inst=BTC-USD qty=0.01 hourlyRate=0.3 side=LEND timeInForce=GOOD_TILL_CANCEL account=acct2
  `,
  getInstruments: `
  ${setupTemplates}
  op=getInstruments
  `,
  getOrders: `
  ${setupTemplates}
  op=getOrders
  `
}

for (const key in templates) {
  templates[key] = templates[key]
    .split(/\n/g)
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('#'))
    .join('\n')
}

export default templates
