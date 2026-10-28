import { registerVueControllerComponents } from '@symfony/ux-vue';
import './stimulus_bootstrap.js';
import './styles/app.css';
import { initializeTheme } from './vue/composables/theme.js';

initializeTheme();
registerVueControllerComponents(import.meta.glob('./vue/controllers/**/*.vue', { eager: true }));
