import route from 'ziggy-js';
import { defineComponent } from 'vue';

export default route;

// Componente Ziggy para Vue
export const ZiggyVue = {
    install(app) {
        app.config.globalProperties.$route = route;
        app.provide('route', route);
    }
};