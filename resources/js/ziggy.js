import route from '../../vendor/tightenco/ziggy/dist/vue.es';
import { Ziggy } from './ziggy.generated';

export const ZiggyVue = {
  install(app) {
    app.config.globalProperties.$route = (...args) => route(...args, Ziggy);
    app.provide('route', (...args) => route(...args, Ziggy));
  },
};
