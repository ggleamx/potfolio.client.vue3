import { createPinia } from 'pinia';
import { useStore } from './entity/index';


export const pinia = createPinia();

// Reexportando para un acceso más fácil si es necesario
export {

    useStore
};
