import { resolvePlaceholders } from "../../core/src/utils"

const str = 'My name is {name}'
const placeholders = {
  name: 'Peter'
}
const message = resolvePlaceholders(str, placeholders)
console.log(message)
