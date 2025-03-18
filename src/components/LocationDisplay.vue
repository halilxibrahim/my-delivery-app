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
      
      <div v-if="address">
        <h3>Adres Bilgileri:</h3>
        <p v-if="address.neighborhood">Mahalle: {{ address.neighborhood }}</p>
        <p v-if="address.street">Sokak: {{ address.street }}</p>
        <p v-if="address.district">İlçe: {{ address.district }}</p>
        <p v-if="address.city">Şehir: {{ address.city }}</p>
      </div>
      <div v-else-if="addressLoading">
        <p>Adres bilgileri yükleniyor...</p>
      </div>
      <div v-else-if="addressError">
        <p>Adres bilgileri alınamadı: {{ addressError }}</p>
      </div>
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
.error {
  color: red;
  margin: 10px 0;
}

button {
  margin-top: 10px;
}
</style>