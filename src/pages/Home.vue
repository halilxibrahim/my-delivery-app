<template>
    <div class="home-container">
      <h1>Welcome</h1>
      <Button label="View Orders" @click="$router.push('/orders')" />
    </div>
  </template>
  
  <script>
  import Button from 'primevue/button';
  
  export default {
    components: { Button },
  };
  </script>
  
  <style scoped>
  .home-container { padding: 20px; }
  </style>