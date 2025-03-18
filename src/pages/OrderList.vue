<template>
    <div class="order-list-container">
      <h1>Order List</h1>
      <Listbox :options="orders" optionLabel="name" @change="goToOrder($event.value.id)">
        <template #option="slotProps">
          <div>{{ slotProps.option.name }} - {{ slotProps.option.status }}</div>
        </template>
      </Listbox>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import Listbox from 'primevue/listbox';
  
  export default {
    components: { Listbox },
    setup() {
      const store = useStore();
      const router = useRouter();
      const orders = computed(() => store.state.orders);
  
      store.dispatch('fetchOrders');
  
      const goToOrder = (orderId) => {
        router.push(`/order/${orderId}`);
      };
  
      return { orders, goToOrder };
    },
  };
  </script>
  
  <style scoped>
  .order-list-container { padding: 20px; }
  </style>