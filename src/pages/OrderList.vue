<template>
  <div class="order-list-container">
    <div class="bento-grid">
      <div class="header-box">
        <h1>Siparişler</h1>
        <p class="subtitle">Teslimat siparişlerinizi yönetin</p>
      </div>

      <div class="orders-box">
        <div class="orders-header">
          <h2>Aktif Siparişler</h2>
          <span class="order-count">{{ orders.length }} sipariş</span>
        </div>
        
        <div class="order-list">
          <div 
            v-for="order in orders" 
            :key="order.id"
            class="order-card"
            @click="goToOrder(order.id)">
            <div class="order-info">
              <h3>{{ order.name }}</h3>
              <span :class="['status-badge', order.status]">{{ order.status }}</span>
            </div>
            <i class="pi pi-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
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
.order-list-container {
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.bento-grid {
  display: grid;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-box,
.orders-box {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.header-box {
  text-align: left;
}

.header-box h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-weight: 700;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.orders-header h2 {
  font-size: 1.5rem;
  color: #1a1a1a;
  font-weight: 600;
}

.order-count {
  color: #666;
  font-size: 1rem;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.8);
}

.order-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-info h3 {
  font-size: 1.1rem;
  color: #1a1a1a;
  font-weight: 500;
  margin: 0;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
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

.pi-chevron-right {
  color: #94a3b8;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .order-list-container {
    padding: 16px;
  }
  
  .header-box h1 {
    font-size: 2rem;
  }
  
  .order-card {
    padding: 16px;
  }
}
</style>