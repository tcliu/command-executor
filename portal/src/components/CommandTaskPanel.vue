<template>
  <div class="q-pt-md">

    <q-table
      :rows="task.executions"
      :columns="columns"
      row-key="id" dense wrap-cells :rows-per-page-options="[10, 20]">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <command-execution-expansion-item :execution="props.row"></command-execution-expansion-item>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import CommandExecutionExpansionItem from './CommandExecutionExpansionItem.vue'

const props = defineProps({
  task: {
    type: Object
  }
})
const task = ref(props.task)
const columns = ref([
  {
    name: 'id',
    required: true,
    label: '#',
    align: 'right',
    field: row => row.id,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'command',
    required: true,
    label: 'Command',
    align: 'left',
    field: row => row.command,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'center',
    field: row => row.status,
    sortable: true
  },
  {
    name: 'elapsedTime',
    required: true,
    label: 'Elapsed time (ms)',
    align: 'right',
    field: row => row.elapsedTime,
    sortable: true
  }
])

</script>
