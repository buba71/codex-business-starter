import { registerVueControllerComponents } from '@symfony/ux-vue';
import './stimulus_bootstrap.js';
registerVueControllerComponents(import.meta.glob('./vue/controllers/**/*.vue', { eager: true }));
