<template>
  <div class="q-pa-md">
    <order-list :orders="orders"></order-list>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import OrderList from '../components/OrderList.vue'
import { ApiClient } from '../services/ApiClient'

const orders = ref([])

const apiClient = new ApiClient()
apiClient.getOrders().then(data => {
  console.log('orders', data)
  orders.value.length = 0
  data.forEach(order => orders.value.push(order))
})

</script>
