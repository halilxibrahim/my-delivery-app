<template>
  <div class="location-display">
    <!-- Loading State -->
    <div v-if="loading" class="status-box loading">
      <i class="pi pi-spin pi-spinner"></i>
      <p>Konum bilgileri alınıyor...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="status-box error">
      <i class="pi pi-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <Button 
        label="Tekrar Dene" 
        icon="pi pi-refresh"
        class="retry-button"
        @click="getLocation" />
    </div>

    <!-- Success State -->
    <div v-else-if="location" class="location-content">
      <!-- Combined Location Box -->
      <div class="info-box location-box">
        <h3>Konum Bilgileri</h3>
        <div class="location-details-grid">
          <!-- GPS Section -->
          <div class="section-grid gps-section">
            <div class="detail-item">
              <span class="label">Enlem</span>
              <span class="value">{{ location.coords.latitude.toFixed(6) }}°</span>
            </div>
            <div class="detail-item">
              <span class="label">Boylam</span>
              <span class="value">{{ location.coords.longitude.toFixed(6) }}°</span>
            </div>
            <div class="detail-item">
              <span class="label">Doğruluk</span>
              <span class="value">{{ location.coords.accuracy.toFixed(0) }} metre</span>
            </div>
          </div>

          <!-- Divider -->
          <div class="vertical-divider"></div>

          <!-- Address Section -->
          <div class="section-grid address-section">
            <div v-if="address" class="address-details">
              <div class="detail-item" v-if="address.street">
                <span class="label">Sokak</span>
                <span class="value">{{ address.street }}</span>
              </div>
              <div class="detail-item" v-if="address.neighborhood">
                <span class="label">Mahalle</span>
                <span class="value">{{ address.neighborhood }}</span>
              </div>
              <div class="detail-item" v-if="address.district">
                <span class="label">İlçe</span>
                <span class="value">{{ address.district }}</span>
              </div>
              <div class="detail-item" v-if="address.city">
                <span class="label">İl</span>
                <span class="value">{{ address.city }}</span>
              </div>
            </div>
            <div v-else-if="addressLoading" class="address-loading">
              <i class="pi pi-spin pi-spinner"></i>
              <p>Adres bilgileri yükleniyor...</p>
            </div>
            <div v-else-if="addressError" class="address-error">
              <i class="pi pi-exclamation-circle"></i>
              <p>{{ addressError }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Update Button -->
      <Button 
        label="Konumu Güncelle" 
        icon="pi pi-sync"
        class="update-button"
        @click="getLocation" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import Button from 'primevue/button';

// Capacitor'ı sadece mobile ortamda import et
let Geolocation;
try {
  Geolocation = require('@capacitor/geolocation').Geolocation;
} catch (error) {
  console.log('Capacitor Geolocation yüklenemedi, tarayıcı API kullanılacak');
}

export default {
  components: { Button },
  setup() {
    const store = useStore();
    const location = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const address = ref(null);
    const addressLoading = ref(false);
    const addressError = ref(null);

    const checkPermissions = async () => {
      try {
        // Eğer Capacitor varsa onunla izinleri kontrol et
        if (Geolocation) {
          const permStatus = await Geolocation.checkPermissions();
          console.log('İzin durumu:', permStatus);
          
          if (permStatus.location !== 'granted') {
            const newPermStatus = await Geolocation.requestPermissions();
            console.log('Yeni izin durumu:', newPermStatus);
            return newPermStatus.location === 'granted';
          }
          return true;
        } else {
          // Tarayıcıda navigator.permissions API varsa kullan
          if (navigator.permissions) {
            const status = await navigator.permissions.query({ name: 'geolocation' });
            return status.state === 'granted' || status.state === 'prompt';
          }
          return true; // API yoksa izni varsayılan olarak ver
        }
      } catch (err) {
        console.error('İzin kontrolü hatası:', err);
        return false;
      }
    };

    const getAddressFromCoords = async (latitude, longitude) => {
      try {
        addressLoading.value = true;
        addressError.value = null;
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=tr`
        );
        
        if (!response.ok) {
          throw new Error('Adres bilgileri alınamadı');
        }

        const data = await response.json();
        
        if (!data || !data.address) {
          throw new Error('Adres bulunamadı');
        }

        const addressData = {
          street: data.address.road || data.address.pedestrian || '',
          neighborhood: data.address.neighbourhood || data.address.suburb || '',
          district: data.address.city_district || data.address.town || data.address.municipality || '',
          city: data.address.city || data.address.state || ''
        };

        address.value = addressData;
      } catch (err) {
        console.error('Adres çözümleme hatası:', err);
        addressError.value = err.message;
      } finally {
        addressLoading.value = false;
      }
    };

    const getLocation = async () => {
      try {
        loading.value = true;
        error.value = null;
        address.value = null; // Adres bilgilerini sıfırla

        console.log('Konum izinleri kontrol ediliyor...');
        const hasPermission = await checkPermissions();
        
        if (!hasPermission) {
          throw new Error('Konum izni alınamadı');
        }

        console.log('Konum alınıyor...');
        
        if (Geolocation) {
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
          
          console.log('Konum alındı (Capacitor):', position);
          location.value = position;
          store.dispatch('updateLocation', position);
          // Konum alındıktan sonra adres bilgilerini al
          await getAddressFromCoords(position.coords.latitude, position.coords.longitude);
        } else if (navigator.geolocation) {
          return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                console.log('Konum alındı (Browser):', position);
                location.value = position;
                store.dispatch('updateLocation', position);
                // Konum alındıktan sonra adres bilgilerini al
                await getAddressFromCoords(position.coords.latitude, position.coords.longitude);
                loading.value = false;
                resolve(position);
              },
              (err) => {
                console.error('Tarayıcı konum hatası:', err);
                handleLocationError(err);
                loading.value = false;
                resolve(null);
              },
              {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 0
              }
            );
          });
        } else {
          throw new Error('Konum servisi mevcut değil');
        }
      } catch (err) {
        console.error('Konum alma hatası:', err);
        handleLocationError(err);
      } finally {
        if (Geolocation) {
          loading.value = false;
        }
      }
    };
    
    const handleLocationError = (err) => {
      if (err.code === 1 || (err.message && err.message.includes('permission'))) {
        error.value = 'Konum izni reddedildi. Lütfen sistem ayarlarından konum iznini açın.';
      } else if (err.code === 2 || (err.message && err.message.includes('unavailable'))) {
        error.value = 'Konum servisi kullanılamıyor. Lütfen:\n' +
                     '1. Sistem ayarlarından konum servislerinin açık olduğunu kontrol edin\n' +
                     '2. İnternet bağlantınızı kontrol edin\n' + 
                     '3. GPS sinyalinin güçlü olduğu bir alanda olduğunuzdan emin olun\n' +
                     '4. Uygulamayı yeniden başlatın';
      } else if (err.code === 3 || (err.message && err.message.includes('timeout'))) {
        error.value = 'Konum alma zaman aşımına uğradı. Lütfen tekrar deneyin.';
      } else {
        error.value = `Konum alınamadı: ${err.message || 'Bilinmeyen hata'}`;
      }
    };

    onMounted(() => {
      // Lifecycle hook'ları await'ten önce kaydedin
      let intervalId;
      
      // onUnmounted'ı burada tanımlıyoruz
      onUnmounted(() => {
        if (intervalId) clearInterval(intervalId);
      });
      
      // Sonra asenkron işlemi çağırıyoruz
      getLocation();
      
      // Interval'ı ayarlıyoruz
      intervalId = setInterval(getLocation, 300000); // 5 dakikada bir güncelle
    });

    return { 
      location, 
      getLocation, 
      loading, 
      error,
      address,
      addressLoading,
      addressError
    };
  },
};
</script>

<style scoped>
.location-display {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  overflow: hidden;
}

.status-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
  gap: 16px;
}

.status-box i {
  font-size: 2rem;
  color: #3b82f6;
}

.status-box.error i {
  color: #ef4444;
}

.status-box p {
  color: #4b5563;
  font-size: 1.1rem;
  margin: 0;
}

.location-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-box {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.05),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.info-box h3 {
  color: #1a1a1a;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.location-details-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  align-items: start;
}

.section-grid {
  display: grid;
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.detail-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.vertical-divider {
  width: 1px;
  background: linear-gradient(to bottom, transparent, #e5e7eb 20%, #e5e7eb 80%, transparent);
  height: 100%;
  min-height: 200px;
}

.address-loading,
.address-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  text-align: center;
}

.address-loading i,
.address-error i {
  font-size: 1.5rem;
  color: #3b82f6;
}

.address-error i {
  color: #ef4444;
}

.address-loading p,
.address-error p {
  color: #4b5563;
  margin: 0;
}

.update-button,
.retry-button {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.update-button:hover,
.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

@media (max-width: 768px) {
  .location-details-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .vertical-divider {
    display: none;
  }

  .detail-item {
    padding: 12px;
  }
}
</style>