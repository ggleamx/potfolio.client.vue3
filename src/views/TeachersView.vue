<script setup lang="ts">
import { onMounted } from 'vue';
import { useTeachersStore } from '../store/teachers/index';
import TeachersList from '@/components/TeachersList.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const teachersStore = useTeachersStore();
const { teachers, totalItems, isSuccess, totalPages, currentPage, isLoading, fetchTeachers } = useTeachersStore();

onMounted(async () => {
  await teachersStore.fetchTeachers();
});

const handleFabClick = () => {
  // Utiliza el router de Vue para navegar a la nueva página de registro
  router.push('/teachers/register');
};


</script>

<template>
  <div class="teachers-view-container">

 <!-- Título -->
<div class="title-container">
  <div></div> <!-- Agregado para centrar el título -->
  <h1>Maestros</h1>
  <button class="fab" @click="handleFabClick">
    <i class="fa-solid fa-plus plus-icon"></i>
  </button>
</div>

  <!-- Paginación -->
  <div style="margin-bottom: 5px;">Total maestros: {{ totalItems }}</div>

  <div class="pagination">
      <span @click="fetchTeachers(currentPage - 1)" class="arrow" :class="{ 'disabled': currentPage === 0 }">
        <i class="fa-solid fa-chevron-left"></i>
      </span>

      <template v-for="page in totalPages" :key="page">
        <span @click="fetchTeachers(page - 1)" class="pagination-number" :class="{ 'active': currentPage + 1 === page }">{{ page }}</span>
      </template>
      <span @click="fetchTeachers(currentPage + 1)" class="arrow" :class="{ 'disabled': currentPage >= totalPages - 1 }">
        <i class="fa-solid fa-chevron-right"></i></span>
    </div>


    <Transition>
      <TeachersList v-if="!isLoading" :teachers="teachers"/>
    </Transition>

  

    <div v-if="isSuccess" :style=" { color: 'green' } " class="snackbar success">
            Operación realizada con éxito
        </div>

  </div>
</template>

<style scoped>
.teachers-view-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 98%;

}

.title-container {
  display: flex;
  justify-content: space-between;  /* Cambiado de center a space-between */
  align-items: center;
  margin-bottom: 10px;
  padding: 0 20px;
}
.fab {
  width: 46px;
  height: 46px;
  background-color: #868686a9;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.fab:hover {
  background-color: #2196F3;
}

.plus-icon {
  color: white;
  font-size: 2.1em;
}



.title-container h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 1px;
  margin-left: 45px;

}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.arrow {
  cursor: pointer;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.active {
  font-weight: bold;
}

.pagination-number {
  cursor: pointer;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}


</style>
