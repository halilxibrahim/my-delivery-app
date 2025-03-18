<template>
    <div>
      <h2>Barcode Scanner</h2>
      <Button label="Scan Barcode" @click="scanBarcode" />
      <p v-if="barcode">Scanned: {{ barcode }}</p>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import Quagga from 'quagga';
  import Button from 'primevue/button';
  
  export default {
    components: { Button },
    setup() {
      const barcode = ref('');
  
      const scanBarcode = () => {
        Quagga.init({
          inputStream: { name: 'Live', type: 'LiveStream', target: document.body },
          decoder: { readers: ['code_128_reader'] },
        }, (err) => {
          if (err) return console.error(err);
          Quagga.start();
        });
  
        Quagga.onDetected((data) => {
          barcode.value = data.codeResult.code;
          Quagga.stop();
        });
      };
  
      return { barcode, scanBarcode };
    },
  };
  </script>