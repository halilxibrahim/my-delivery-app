import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import store from './store';
import router from './router';


const app = createApp(App);
app.use(PrimeVue);
app.use(store);
app.use(router);
app.mount('#app');