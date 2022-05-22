<template>
  <div>
    <q-table
    title="Orders"
    :rows="orders"
    :columns="columns"
    row-key="id" dense wrap-cells
    :pagination="pagination"
    :rows-per-page-options="[10, 20, 50, 100]" />
  </div>
</template>
<script lang="ts" setup>import { ref } from 'vue';

const props = defineProps({
  orders: {
    type: Object
  }
})
const orders = ref(props.orders)
const pagination = ref({
  rowsPerPage: 20
})
const columns = ref([
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: row => row.id,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'account_uuid',
    required: true,
    label: 'Account UUID',
    align: 'left',
    field: row => row.account_uuid,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'user_uuid',
    required: true,
    label: 'User UUID',
    align: 'left',
    field: row => row.user_uuid,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'instrument_name',
    required: true,
    label: 'Instrument name',
    align: 'left',
    field: row => row.instrument_name,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'quantity',
    required: true,
    label: 'Quantity',
    align: 'right',
    field: row => row.quantity,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'hourly_rate',
    required: true,
    label: 'Hourly rate',
    align: 'right',
    field: row => row.hourly_rate,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'side',
    required: true,
    label: 'Side',
    align: 'center',
    field: row => row.side,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left',
    field: row => row.status,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'created_time',
    required: true,
    label: 'Created time',
    align: 'right',
    field: row => row.created_time,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'updated_time',
    required: true,
    label: 'Updated time',
    align: 'right',
    field: row => row.updated_time,
    format: val => `${val}`,
    sortable: true
  }
])
</script>
