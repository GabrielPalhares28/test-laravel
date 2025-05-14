import { createApp } from 'vue';
import App from './App.vue';
import { Ziggy } from './ziggy'; // Se você gerou o Ziggy manualmente
import route from 'ziggy-js';

const app = createApp(App);

app.use(ZiggyVue);  // Usa o plugin ZiggyVue

app.mount('#app');
