import { createApp } from 'vue';
import App from './App.vue';
import { ZiggyVue } from './ziggy';  // Importa o arquivo ziggy.js

const app = createApp(App);

app.use(ZiggyVue);  // Usa o plugin ZiggyVue

app.mount('#app');
