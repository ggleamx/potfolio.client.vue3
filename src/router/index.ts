import { createRouter, createWebHistory } from 'vue-router';
import StudentsView from '../views/StudentsView.vue';
import StudentsRegisterView from '@/views/StudentsRegisterView.vue';


import TeachersView from '@/views/TeachersView.vue';
import TeachersRegisterView from '@/views/TeachersRegisterView.vue';
import GradesView from '@/views/GradesView.vue';
import GradesRegisterView from '@/views/GradesRegisterView.vue';
import StudentsGradesView from '@/views/StudentsGradesView.vue';
import StudentsGradesRegisterView from '@/views/StudentsGradesRegisterView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: StudentsGradesView
  },
  {
    path: '/students-grades',
    name: 'students_grades',
    component: StudentsGradesRegisterView
  },

  {
    path: '/students-grades/:id',
    name: 'students_grades-edit',
    component: StudentsGradesRegisterView,
    props:true,
    

  },
  {
    path: '/students',
    name: 'students',
    component: StudentsView
  },
  {
    path: '/students/register', // Añade esta nueva ruta
    name: 'students-register',
    component: StudentsRegisterView
  },
  {
    path: '/students/:id',
    name: 'students-edit',
    component: StudentsRegisterView,
    props:true,
  },
  {
    path:'/teachers',
    name: 'teachers',
    component: TeachersView
  },
  {
    path:'/teachers/register',
    name: 'teachers-register',
    component: TeachersRegisterView
  },
  {
    path:'/teachers/:id',
    name: 'teachers-edit',
    component: TeachersRegisterView,
    props:true,
  },

  {
    path: '/grades',
    name: 'grades',
    component: GradesView,
  },
  {
    path: '/grades/register',
    name: 'grades-register',
    component: GradesRegisterView,
  },
  {
    path: '/grades/:id',
    name: 'grades-edit',
    component: GradesRegisterView,
    props:true,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
