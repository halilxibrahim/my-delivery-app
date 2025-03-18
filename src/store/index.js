import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    orders: [],
    location: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setOrders(state, orders) {
      state.orders = orders;
    },
    setLocation(state, location) {
      state.location = location;
    },
    updateOrderStatus(state, { orderId, status }) {
      const order = state.orders.find(o => o.id === orderId);
      if (order) order.status = status;
    },
  },
  actions: {
    login({ commit }, user) {
      // Simulate API call or local validation
      commit('setUser', user);
    },
    fetchOrders({ commit }) {
      // Simulate fetching orders from an API
      const mockOrders = [
        { id: '1', name: 'Order 1', status: 'pending', deliveryLocation: '123 Main St' },
        { id: '2', name: 'Order 2', status: 'pending', deliveryLocation: '456 Oak Ave' },
      ];
      commit('setOrders', mockOrders);
    },
    async updateLocation({ commit }) {
      const { Geolocation } = await import('@capacitor/geolocation');
      const position = await Geolocation.getCurrentPosition();
      commit('setLocation', position);
    },
    markOrderAsCollected({ commit }, orderId) {
      commit('updateOrderStatus', { orderId, status: 'collected' });
    },
  },
});