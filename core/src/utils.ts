import { Args } from './types'

export function delay(delayMs: number) : Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(delayMs), delayMs)
  })
}

export function readCommands(commandStr: string) : string[] {
  return commandStr.split(/\n/g)
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('#'))
}

export function parseCommand(command: string): Args {
  let esc = false
  let startIndex = 0
  const args: Args = {}
  for (let i = 0; i < command.length; i++) {
    let tok
    const c = command.charAt(i)
    if (!esc && c === ' ') {
      tok = command.substring(startIndex, i)
    } else if (i === command.length - 1) {
      tok = command.substring(startIndex)
    } else if (c === '"') {
      esc = !esc
    }
    if (tok) {
      const eqIdx = tok.indexOf('=')
      const key: string = eqIdx === -1 ? tok : tok.substring(0, eqIdx)
      const value: string =
        eqIdx === -1 ? '' : tok.substring(eqIdx + 1).replace(/"(.*)"/, '$1')
      args[key] = value
      startIndex = i + 1
      tok = null
    }
  }
  return args
}

export function clearObject(obj: Record<string,any>) {
  const propNames = Object.getOwnPropertyNames(obj)
  propNames.forEach(propName => delete obj[propName])
}

export function resolvePlaceholders(v: string, placeholders: Args) : string {
  return v && placeholders ? v.replace(/{(\w+)}/g, (pattern, repl) =>
    placeholders.hasOwnProperty(repl) ? placeholders[repl] : pattern) : v
}
