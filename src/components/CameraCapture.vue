<template>
    <div>
      <h2>Camera Capture</h2>
      <Button label="Take Photo" @click="takePhoto" />
      <img v-if="photo" :src="photo" alt="Captured Photo" style="max-width: 100%;" />
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { Camera } from '@capacitor/camera';
  import Button from 'primevue/button';
  
  export default {
    components: { Button },
    setup() {
      const photo = ref('');
  
      const takePhoto = async () => {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: 'uri',
        });
        photo.value = image.webPath;
      };
  
      return { photo, takePhoto };
    },
  };
  </script>