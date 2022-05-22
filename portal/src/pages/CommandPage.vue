<template>
 <div class="q-pa-md">
    <div class="row">
      <div class="col">
        <command-panel :templates="templates" :templateName="selectedTemplateName" :env="env" :task="task"></command-panel>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <command-task-panel :task="task"></command-task-panel>
      </div>
    </div>
 </div>
</template>
<script lang="ts" setup>
import { Ref, ref } from 'vue'
import CommandPanel from 'components/CommandPanel.vue'
import CommandTaskPanel from 'components/CommandTaskPanel.vue'
import ApiTemplates from '../services/ApiTemplates'
import { TaskView } from '../components/models'
const templates = ref(ApiTemplates)
const env = ref('local')
const task : Ref<TaskView> = ref({})
const selectedTemplateName = ref('createLoan')
</script>
