<template>
  <div class="q-pl-md">
    <q-markup-table>
      <tbody>
        <tr v-show="view.api()">
          <td>API</td>
          <td>{{ view.api() }}</td>
        </tr>
        <tr v-show="view.headers()">
          <td>Request headers</td>
          <td class="json-cell">
            <pre>{{ JSON.stringify(view.headers(), null, 2) }}</pre>
          </td>
        </tr>
        <tr v-show="view.data()">
          <td>Request data</td>
          <td class="json-cell">
            <pre>{{ JSON.stringify(view.data(), null, 2)}}</pre>
          </td>
        </tr>
        <tr v-show="view.body()">
          <td>Response body</td>
          <td class="json-cell">
            <pre>{{ JSON.stringify(view.body(), null, 2) }}</pre>
          </td>
        </tr>
        <tr v-show="view.errorMessage()">
          <td>Error message</td>
          <td>{{ view.errorMessage() }}</td>
        </tr>
        <tr v-show="view.startTime()">
          <td>Start time</td>
          <td>{{ view.startTime() }}</td>
        </tr>
        <tr v-show="view.endTime()">
          <td>End time</td>
          <td>{{ view.endTime() }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>
<style scoped>
.json-cell > pre {
  max-height: 250px;
  overflow: auto;
  word-break: break-all;
}
</style>
<script lang="ts" setup>
import { ref } from 'vue'
import { CommandExecution } from '../../../core/src/models'
const datePattern = 'YYYY-MM-DD HH:mm:ss.SSS'
class ResultView {
  execution: CommandExecution
  constructor(ex: CommandExecution) {
    this.execution = ex
  }
  id() {
    return this.execution?.id
  }
  axiosOptions() {
    return this.execution?.result?.axiosOptions
  }
  method() {
    return this.axiosOptions()?.method
  }
  url() {
    return this.axiosOptions()?.url
  }
  api() {
    const method = this.method()
    const url = this.url()
    if (method && url) {
      return method + ' ' + url
    } else {
      return url
    }
  }
  headers() {
    return this.axiosOptions()?.headers
  }
  data() {
    return this.axiosOptions()?.data
  }
  errorMessage() {
    return this.execution?.errorMessage
  }
  result() {
    return this.execution?.result
  }
  status() {
    return this.execution?.status
  }
  body() {
    return this.result()?.data
  }
  startTime() {
    return this.execution?.startTime
  }
  endTime() {
    return this.execution?.endTime
  }
  elapsedTime() {
    return this.execution?.elapsedTime
  }
}

const props = defineProps({
  execution: {
    type: Object
  }
})
const view = ref(new ResultView(props.execution))
</script>
