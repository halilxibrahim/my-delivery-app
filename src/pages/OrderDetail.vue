<template>
    <div class="order-detail-container">
      <h1>Order: {{ order?.name }}</h1>
      <p>Status: {{ order?.status }}</p>
      <p>Delivery Location: {{ order?.deliveryLocation }}</p>
      <Button label="Mark as Collected" @click="markAsCollected" :disabled="order?.status === 'collected'" />
      <BarcodeScanner />
      <CameraCapture />
      <LocationDisplay />
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute } from 'vue-router';
  import Button from 'primevue/button';
  import BarcodeScanner from '../components/BarcodeScanner.vue';
  import CameraCapture from '../components/CameraCapture.vue';
  import LocationDisplay from '../components/LocationDisplay.vue';
  
  export default {
    components: { Button, BarcodeScanner, CameraCapture, LocationDisplay },
    setup() {
      const store = useStore();
      const route = useRoute();
      const orderId = route.params.id;
      const order = computed(() => store.state.orders.find(o => o.id === orderId));
  
      const markAsCollected = () => {
        store.dispatch('markOrderAsCollected', orderId);
      };
  
      return { order, markAsCollected };
    },
  };
  </script>
  
  <style scoped>
  .order-detail-container { padding: 20px; }
  </style>