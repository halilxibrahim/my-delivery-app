<template>
  <div>
    <h2>Konum Bilgisi</h2>
    
    <div v-if="loading">
      <p>Konum alınıyor...</p>
    </div>
    
    <div v-else-if="error">
      <p>Hata: {{ error }}</p>
    </div>
    
    <div v-else-if="location">
      <p>Enlem: {{ location.coords.latitude }}</p>
      <p>Boylam: {{ location.coords.longitude }}</p>
      <p>Doğruluk: {{ location.coords.accuracy }} metre</p>
    </div>
    
    <Button label="Konumu Güncelle" @click="getLocation" />
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

    const getLocation = async () => {
      try {
        loading.value = true;
        error.value = null;

        console.log('Konum izinleri kontrol ediliyor...');
        const hasPermission = await checkPermissions();
        
        if (!hasPermission) {
          throw new Error('Konum izni alınamadı');
        }

        console.log('Konum alınıyor...');
        
        if (Geolocation) {
          // Capacitor API ile konum al
          const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
          
          console.log('Konum alındı (Capacitor):', position);
          location.value = position;
          store.dispatch('updateLocation', position);
        } else if (navigator.geolocation) {
          // Tarayıcı API ile konum al - Hata ele alma iyileştirildi
          return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                console.log('Konum alındı (Browser):', position);
                location.value = position;
                store.dispatch('updateLocation', position);
                loading.value = false;
                resolve(position);
              },
              (err) => {
                console.error('Tarayıcı konum hatası:', err);
                
                // Konum alınamadığında, geliştirme ortamında varsayılan konum kullanın
                if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
                  console.log('Geliştirme ortamında varsayılan konum kullanılıyor');
                  const mockPosition = {
                    coords: {
                      latitude: 41.0082, // İstanbul koordinatları
                      longitude: 28.9784,
                      accuracy: 10
                    },
                    timestamp: Date.now()
                  };
                  location.value = mockPosition;
                  store.dispatch('updateLocation', mockPosition);
                } else {
                  handleLocationError(err);
                }
                
                loading.value = false;
                resolve(null); // Promise'i çözüyoruz, hata durumunda bile
              },
              {
                enableHighAccuracy: false, // Daha fazla uyumluluk için false
                timeout: 30000, // Zaman aşımını artırdık
                maximumAge: 300000 // 5 dakikaya kadar eski konumları kabul et
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
        if (Geolocation) { // navigator.geolocation için callback'lerde loading değeri ayarlanıyor
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
                     '3. Uygulamayı yeniden başlatın';
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

    return { location, getLocation, loading, error };
  },
};
</script>

<style scoped>
.error {
  color: red;
  margin: 10px 0;
}

button {
  margin-top: 10px;
}
</style>