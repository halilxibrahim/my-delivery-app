<template>
  <div class="home-container">
    <div class="bento-grid">
      <div class="welcome-box">
        <h1>Hoş Geldiniz</h1>
        <p class="subtitle">Teslimat Paneliniz</p>
      </div>

      <div class="stats-box">
        <div class="stat-item">
          <span class="stat-number">12</span>
          <span class="stat-label">Aktif Sipariş</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">45</span>
          <span class="stat-label">Bugün Tamamlanan</span>
        </div>
      </div>

      <div class="action-box">
        <Button 
          label="Siparişleri Görüntüle" 
          icon="pi pi-list"
          class="action-button"
          @click="$router.push('/orders')" />
      </div>
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button';

export default {
  components: { Button },
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-box,
.stats-box,
.action-box {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.welcome-box {
  text-align: left;
}

.welcome-box h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-weight: 700;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.stats-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 8px;
}

.stat-label {
  color: #4b5563;
  font-size: 0.95rem;
}

.action-box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-button {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

@media (max-width: 768px) {
  .home-container {
    padding: 16px;
  }
  
  .welcome-box h1 {
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}
</style>