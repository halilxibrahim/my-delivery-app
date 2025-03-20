<template>
  <div class="order-detail-container">
    <div class="bento-grid">
      <div class="header-box">
        <div class="header-content">
          <h1>Sipariş Detayları</h1>
          <p class="subtitle">{{ order?.name }}</p>
        </div>
        <span :class="['status-badge', order?.status]">
          {{ order?.status }}
        </span>
      </div>

      <div class="info-box">
        <div class="location-container">
          <LocationDisplay class="location-map" />
        </div>
      </div>

      <div class="tools-grid">
        <div class="tool-box scanner-box">
          <h2>Barkod Tara</h2>
          <BarcodeScanner />
        </div>

        <div class="tool-box camera-box">
          <h2>Fotoğraf Çek</h2>
          <CameraCapture />
        </div>
      </div>

      <div class="action-box">
        <Button 
          label="Teslim Alındı Olarak İşaretle" 
          icon="pi pi-check"
          class="action-button"
          :class="{ 'disabled': order?.status === 'collected' }"
          @click="markAsCollected" 
          :disabled="order?.status === 'collected'" />
      </div>
    </div>
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
.order-detail-container {
  min-height: 100vh;
  padding: clamp(16px, 4vw, 32px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(16px, 3vw, 24px);
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(8px, 2vw, 16px);
}

.header-box {
  grid-column: 1 / -1;
}

.info-box {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.location-container {
  width: 100%;
  aspect-ratio: 16/9;
  max-height: 500px;
  margin: 0;
  border-radius: 16px;
  overflow: hidden;
}

.location-map {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  margin: 0;
}

.tools-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(16px, 3vw, 24px);
}

.action-box {
  grid-column: 1 / -1;
}

.header-box,
.info-box,
.tool-box,
.action-box {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: clamp(16px, 3vw, 24px);
  padding: clamp(20px, 4vw, 32px);
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.08),
    0 4px 8px rgba(0, 0, 0, 0.04),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.header-box:hover,
.info-box:hover,
.tool-box:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 20px rgba(0, 0, 0, 0.1),
    0 6px 10px rgba(0, 0, 0, 0.06),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
}

.header-content h1 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  line-height: 1.2;
  margin-bottom: clamp(8px, 2vw, 12px);
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.collected {
  background: #dcfce7;
  color: #166534;
}

.status-badge.delivered {
  background: #dbeafe;
  color: #1e40af;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-group label {
  font-size: 0.95rem;
  color: #4a5568;
  font-weight: 500;
}

.info-group p {
  font-size: 1.1rem;
  color: #1a1a1a;
  margin: 0;
}

.location-details {
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 0 0 16px 16px;
}

.location-details h3 {
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 8px;
  font-weight: 600;
}

.location-details p {
  font-size: 1rem;
  color: #4a5568;
  margin: 0;
  line-height: 1.5;
}

.tool-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tool-box h2 {
  font-size: 1.25rem;
  color: #1a1a1a;
  font-weight: 600;
  margin: 0;
}

.action-button {
  max-width: 400px;
  padding: clamp(14px, 2vw, 16px);
  border-radius: 12px;
  font-size: clamp(1rem, 2vw, 1.1rem);
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-button:not(.disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.action-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #94a3b8;
}

@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .location-container {
    aspect-ratio: 4/3;
    min-height: 700px;
  }
}

@media (max-width: 425px) {
  .location-container {
    aspect-ratio: 1/1;
    min-height: 750px;
    width: 100%;
  }
}

@media (max-width: 375px) {
  .bento-grid {
    gap: 12px;
    padding: 8px;
  }

  .location-container {
    aspect-ratio: 3/4;
    min-height: 700px;
  }

  .header-box,
  .info-box,
  .tool-box,
  .action-box {
    padding: 16px;
    border-radius: 16px;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .tools-grid {
    gap: 12px;
  }
}

@media (max-width: 320px) {
  .location-container {
    aspect-ratio: 3/4;
    min-height: 700px;
  }
}

@media (max-width: 480px) {
  .tool-box {
    padding: 20px;
  }
  
  .action-button {
    width: 100%;
    max-width: none;
  }
}
</style>