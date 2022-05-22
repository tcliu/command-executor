<template>
  <div>
    <div class="row">
      <div class="col col-md-2 q-pt-sm">
        <label>Select environment</label>
      </div>
      <div class="col col-md-10">
        <q-select
          outlined
          v-model="selectedEnvironmentName"
          use-input
          hide-selected
          fill-input
          dense
          input-debounce="0"
          :options="envNames"
          @filter="envFilterFn"
          style="width: 300px; padding-bottom: 10px"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No results</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <div class="row">
      <div class="col col-md-2 q-pt-sm">
        <label>Select template</label>
      </div>
      <div class="col col-md-10">
        <q-select
          outlined
          v-model="selectedTemplateName"
          use-input
          hide-selected
          fill-input
          dense
          input-debounce="0"
          :options="templateNames"
          @filter="templateFilterFn"
          style="width: 300px; padding-bottom: 10px"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-input class="textarea" v-model="commandText" type="textarea" dense outlined rows="12" />
      </div>
    </div>
    <div class="row">
      <div class="col q-pt-md q-gutter-sm">
        <q-btn color="primary" label="Send" @click="send" />
        <q-btn color="secondary" label="Reset" @click="reset" />
        <!-- <q-btn color="brown-5" label="Debug" @click="debug" /> -->
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>
<script lang="ts" setup>
import { ref, watch, Ref } from 'vue'
import { ApiClient } from '../services/ApiClient'
import { Params } from '../models/types'
import { TaskView } from './models'
import { clearObject } from '../../../core/src/utils'

const props = defineProps({
  templates: {
    type: Object
  },
  templateName: {
    type: String
  },
  env: {
    type: String
  },
  task: {
    type: Object
  }
})

const envNameValues = ['local', 'dev', 'sit']
const templateNameValues = Object.keys(props.templates)
templateNameValues.sort()

const templates: Ref<Params> = ref(props.templates)
const selectedTemplateName: Ref<string> = ref(props.templateName)
const selectedEnvironmentName: Ref<string> = ref(props.env)
const commandText: Ref<string> = ref(getCommandText(selectedTemplateName.value))
const envNames: Ref<string[]> = ref(envNameValues)
const templateNames: Ref<string[]> = ref(templateNameValues)
const task: Ref<TaskView> = ref(props.task)

const apiClient = new ApiClient()

watch(selectedTemplateName, async (nv: string, ov: string) => {
  commandText.value = getCommandText(nv)
})

watch(commandText, async (nv: string, ov: string) => {
  localStorage.setItem('command.' + selectedTemplateName.value, nv)
})

function send() {
  apiClient
    .sendCommands({
      command: commandText.value
    })
    .then(data => {
      console.log('data', data)
      updateTask(data)
    })
}

function updateTask(data: TaskView) {
  if (task.value.executions) {
    for (let i=0; i<data.executions.length; i++) {
      if (task.value.executions[i]) {
        clearObject(task.value.executions[i])
        Object.assign(task.value.executions[i], data.executions[i])
      } else {
        task.value.executions.push(data.executions[i])
      }
    }
    if (task.value.executions.length > data.executions.length) {
      task.value.executions.length = data.executions.length
    }
  } else {
    Object.assign(task.value, data)
  }
}

function reset() {
  console.log('reset to template', selectedTemplateName.value)
  localStorage.removeItem('command.' + selectedTemplateName.value)
  commandText.value = getCommandText(selectedTemplateName.value)
  task.value.executions.length = 0
}

function str(o: any) {
  return o ? String(o) : ''
}

function getCommandText(templateName: string) {
  return (
    localStorage.getItem('command.' + templateName) ??
    props.templates[templateName]
  )
}

function envFilterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase()
    envNames.value = envNameValues.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    )
  })
}

function templateFilterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase()
    templateNames.value = templateNameValues.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    )
  })
}

function debug() {
  console.log('debug', task)
}

</script>
