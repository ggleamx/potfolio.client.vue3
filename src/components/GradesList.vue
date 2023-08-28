<template>
  <div class="list-container">
    <ul v-if="grades && grades.length">
      <li v-for="grade in grades" :key="grade.id!" class="grade-card"
        :class="{ 'disabled-card': !grade.status }">
        <!-- Encabezado de la tarjeta (ID, nombres, botones, icono de expansión) -->
        <div class="card-header" @click="toggleDetails(grade.id!)">
          <div>
          <span> <strong>#{{ grade.id }}</strong></span>
          <span class="name">{{ grade.name}} grado </span>
          
          </div>
        
          <div class="action-buttons" v-if="grade.status">
            <button @click.stop="editGrade(grade.id!)">Editar</button>
            <button @click.stop="confirmAndDeleteGrade(grade.id!)">Eliminar</button>
            <font-awesome-icon :icon="expandedGrades.includes(grade.id!) ? 'chevron-up' : 'chevron-down'"
              class="expand-icon" />
          </div>
          <!-- Si el usuario está inactivo, solo muestra el icono de expansión -->
          <div class="action-buttons" v-else>
            <font-awesome-icon :icon="expandedGrades.includes(grade.id!) ? 'chevron-up' : 'chevron-down'"
              class="expand-icon" />
          </div>
        </div>
        <div class="divider"></div>
        <!-- Contenido detallado de la tarjeta (visible al expandir) -->
        <transition name="slide" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">

          <div v-if="expandedGrades.includes(grade.id!)" class="card-details">
            <div><strong>Maestro : </strong> {{ ( grade.teacher as Teacher).firstName}}  {{   ( grade.teacher as Teacher).lastName}}<br></div>
            <div>
              <strong>Fecha registro:</strong>
              {{ formatDateTime(grade.createdAt!) }}
            </div>
            <div>
              <strong>Fecha actualización:</strong>
              {{ formatDateTime(grade.updatedAt!) }}
            </div>
            <div v-if="grade.deletedAt != null">
              <strong>Fecha de borrado:</strong>
              {{ formatDateTime(grade.deletedAt!) }}
            </div>
            <div>
              <strong>Status:</strong>
              <span :style="{ color: grade.status ? 'green' : 'red' }">
                {{ grade.status ? ' Activo' : ' Inactivo' }}
              </span>
            </div>
          </div>
        </transition>
      </li>
    </ul>
    <p v-else>No hay grados disponibles</p>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
// eslint-disable-next-line no-unused-vars
import { Grade, Teacher } from '../types';
import { useRouter } from 'vue-router';
import { useGradesStore } from '../store/grades/index';
import moment from 'moment';

export default {
  props: {
    grades: {
      type: Array as () => Grade[],
      required: true
    }
  },
  setup() {
    const expandedGrades = ref<number[]>([]);
    const router = useRouter();
    const store = useGradesStore();

    const toggleDetails = (id: number) => {
      if (expandedGrades.value.includes(id)) {
        const index = expandedGrades.value.indexOf(id);
        expandedGrades.value.splice(index, 1);
      } else {
        expandedGrades.value.push(id);
      }
    };

    const confirmAndDeleteGrade = async (id: number) => {
      const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este grado?");
      if (confirmed) {
        await store.deleteGrade(id); // llama al método deleteGrade de tu store
        if (store.isSuccess.value) {
          alert("Grado eliminado con éxito");
        } else {
          alert(`Error al eliminar grado: ${store.errorMessage.value}`);
        }
      }
    };

    const editGrade = (id: number) => {
      router.push({ name: 'grades-edit', params: { id: id.toString() } });

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
      expandedGrades,
      formatDateTime,
      formatDate,
      toggleDetails,
      editGrade,
      beforeEnter,
      enter,
      beforeLeave,
      confirmAndDeleteGrade,
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

.grade-card {
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  position: relative;
  transition: background-color 0.3s;
  display: flex;
  flex-direction: column;
}

.grade-card:hover {
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

  .grade-card {
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
