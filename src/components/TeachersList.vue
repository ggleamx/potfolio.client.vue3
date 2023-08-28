<template>
  <div class="list-container">
    <ul v-if="teachers && teachers.length">
      <li v-for="teacher in teachers" :key="teacher.id!" class="teacher-card"
        :class="{ 'disabled-card': !teacher.status }">
        <!-- Encabezado de la tarjeta (ID, nombres, botones, icono de expansión) -->
        <div class="card-header" @click="toggleDetails(teacher.id!)">
          <div>
          <span> <strong>#{{ teacher.id }}</strong></span>
          <span class="name">{{ teacher.firstName }} {{ teacher.lastName }}</span>
          
          </div>
        
          <div class="action-buttons" v-if="teacher.status">
            <button @click.stop="editTeacher(teacher.id!)">Editar</button>
            <button @click.stop="confirmAndDeleteTeacher(teacher.id!)">Eliminar</button>
            <font-awesome-icon :icon="expandedTeachers.includes(teacher.id!) ? 'chevron-up' : 'chevron-down'"
              class="expand-icon" />
          </div>
          <!-- Si el usuario está inactivo, solo muestra el icono de expansión -->
          <div class="action-buttons" v-else>
            <font-awesome-icon :icon="expandedTeachers.includes(teacher.id!) ? 'chevron-up' : 'chevron-down'"
              class="expand-icon" />
          </div>
        </div>
        <div class="divider"></div>
        <!-- Contenido detallado de la tarjeta (visible al expandir) -->
        <transition name="slide" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">

          <div v-if="expandedTeachers.includes(teacher.id!)" class="card-details">
            <div><strong>Email:</strong> {{ teacher.email }}<br></div>
            <div>
              <strong>Fecha registro:</strong>
              {{ formatDateTime(teacher.createdAt!) }}
            </div>
            <div>
              <strong>Fecha actualización:</strong>
              {{ formatDateTime(teacher.updatedAt!) }}
            </div>
            <div v-if="teacher.deletedAt != null">
              <strong>Fecha de borrado:</strong>
              {{ formatDateTime(teacher.deletedAt!) }}
            </div>
            <div>
              <strong>Status:</strong>
              <span :style="{ color: teacher.status ? 'green' : 'red' }">
                {{ teacher.status ? ' Activo' : ' Inactivo' }}
              </span>
            </div>


            <div>
              <strong>Genero:</strong>
              <span :style="{ color: teacher.gender === 'F' ? 'pink' : 'blue' }">
                {{ teacher.gender === 'F' ? ' Femenino' : ' Masculino' }}
              </span>
            </div>
          </div>
        </transition>
      </li>
    </ul>
    <p v-else>No hay estudiantes disponibles</p>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { Teacher } from '../types';
import { useRouter } from 'vue-router';
import { useTeachersStore } from '../store/teachers/index';
import moment from 'moment';

export default {
  props: {
    teachers: {
      type: Array as () => Teacher[],
      required: true
    }
  },
  setup() {
    const expandedTeachers = ref<number[]>([]);
    const router = useRouter();
    const store = useTeachersStore();

    const toggleDetails = (id: number) => {
      if (expandedTeachers.value.includes(id)) {
        const index = expandedTeachers.value.indexOf(id);
        expandedTeachers.value.splice(index, 1);
      } else {
        expandedTeachers.value.push(id);
      }
    };

    const confirmAndDeleteTeacher = async (id: number) => {
      const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este estudiante?");
      if (confirmed) {
        await store.deleteTeacher(id); // llama al método deleteTeacher de tu store
        if (store.isSuccess.value) {
          alert("Estudiante eliminado con éxito");
        } else {
          alert(`Error al eliminar estudiante: ${store.errorMessage.value}`);
        }
      }
    };

    const editTeacher = (id: number) => {
      router.push({ name: 'teachers-edit', params: { id: id.toString() } });

    };

    const formatDate = (date: string) => {
      return moment(date).format("D MMMM YYYY");
    };

    const formatDateTime = (date: string) => {
      return moment(date).format("D MMMM YYYY h:mm a");
    };

    const beforeEnter = (el: any) => {
      el.style.maxHeight = '0px';
    }

    const enter = (el: any) => {
      el.style.maxHeight = el.scrollHeight + 'px';
    }

    const beforeLeave = (el: any) => {
      el.style.maxHeight = el.scrollHeight + 'px';
    }

    const leave = (el: any) => {
      el.style.maxHeight = '0px';
    }

    return {
      expandedTeachers,
      formatDateTime,
      formatDate,
      toggleDetails,
      editTeacher,
      beforeEnter,
      enter,
      beforeLeave,
      confirmAndDeleteTeacher,
      leave
    };



  }
}
</script>

<style scoped>
.divider {
  width: 100%;
  height: 1px;
  background-color: #ddd;
  margin-top: 10px;
}

.list-container {
  width: 70%;
  min-height: 70%;
  max-height: 100%;
  margin: 0 auto;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

.teacher-card {
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  position: relative;
  transition: background-color 0.3s;
  display: flex;
  flex-direction: column;
}

.teacher-card:hover {
  background-color: #f6f6f6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.name {
  flex: 1;
  margin-left: 15px;
  text-align: center;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.action-buttons button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-buttons button:hover {
  background-color: #ddd;
}

.expand-icon {
  margin-left: 10px;
  cursor: pointer;
  flex-shrink: 0;
}

.card-details {
  padding: 10px 0;
  overflow: hidden;
  max-height: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  transition: max-height 0.5s ease-in-out;
}

/* CSS para la animación */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.5s ease-in-out;
}

.slide-enter,
.slide-leave-to

/* .slide-leave-active in <2.1.8 */
  {
  max-height: 0;
}

.disabled-card {
  border: 1px solid rgba(245, 9, 9, 0.522);
  opacity: 0.8;
}

/* Estilos para dispositivos móviles */
@media (max-width: 767px) {
  .list-container {
    width: 95%;
  }

  .teacher-card {
    font-size: 1.1em;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
  }

  .name,
  .action-buttons {
    margin-top: 8px;
  }

  .action-buttons {
    gap: 5px;
  }

  .action-buttons button {
    padding: 8px 12px;
  }

  .expand-icon {
    font-size: 1.2em;
  }
}
</style>
