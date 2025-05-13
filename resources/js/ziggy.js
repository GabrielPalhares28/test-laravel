import route from 'ziggy-js';
import { Ziggy } from './ziggy.routes';

// Configura o route com as rotas definidas
const routeFunction = (name, params, absolute, config = Ziggy) => {
    return route(name, params, absolute, config);
};

// Componente Ziggy para Vue
export const ZiggyVue = {
    install(app) {
        app.config.globalProperties.$route = routeFunction;
        app.provide('route', routeFunction);
    }
};

export { routeFunction as route };