// src/store/index.ts

import { createPinia } from 'pinia';
import { useStudentsStore } from './students/index';
import { useTeachersStore } from './teachers';
import { useGradesStore } from './grades';
import { useStudentsGradesStore } from './students-grades';

export const pinia = createPinia();

// Reexportando para un acceso más fácil si es necesario
export {
  useStudentsStore,
  useTeachersStore,
  useGradesStore,
  useStudentsGradesStore
};
