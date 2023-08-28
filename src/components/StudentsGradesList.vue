<template>
  <div class="list-container">
    <ul v-if="studentsGrades && studentsGrades.length">
      <li v-for="studentGrades in studentsGrades" :key="studentGrades.id!" class="studentGrades-card"
        :class="{ 'disabled-card': !studentGrades.status }">
        <!-- Encabezado de la tarjeta (ID, nombres, botones, icono de expansión) -->
        <div class="card-header" @click="toggleDetails(studentGrades.id!)">
          <div style="width: 20px;">
          <span> <strong>#{{ studentGrades.id }}</strong></span>
          <span class="name">{{ (studentGrades.student as Student).firstName}} {{ (studentGrades.student as Student).lastName }}</span>
          
          </div>
        
          <div class="action-buttons" v-if="studentGrades.status">
            <button @click.stop="editStudent(studentGrades.id!)">Editar</button>
            <button @click.stop="confirmAndDeleteStudent(studentGrades.id!)">Eliminar</button>
            <font-awesome-icon :icon="expandedStudents.includes(studentGrades.id!) ? 'chevron-up' : 'chevron-down'"
              class="expand-icon" />
          </div>
          <!-- Si el usuario está inactivo, solo muestra el icono de expansión -->
          <div class="action-buttons" v-else>
            <font-awesome-icon :icon="expandedStudents.includes(studentGrades.id!) ? 'chevron-up' : 'chevron-down'"
              class="expand-icon" />
          </div>
        </div>
        <div class="divider"></div>
        <!-- Contenido detallado de la tarjeta (visible al expandir) -->
        <transition name="slide" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">



          <div v-if="expandedStudents.includes(studentGrades.id!)" class="card-details">          
            <div>
              <strong>Grado: </strong>
              {{ ( studentGrades.grade as Grade).name}} grado
            </div>

            <div>
              <strong>Grupo: </strong>
              {{ studentGrades.section}} 
            </div>

            <div>
              <strong>Maestro: </strong>
              {{ (( studentGrades.grade as Grade).teacher as Teacher).firstName}} {{ (( studentGrades.grade as Grade).teacher as Teacher).lastName}}
            </div>

            <div :style="{margin:'10px 0px'}" class="divider"></div>
            
            <div>
              <strong>Fecha registro:</strong>
              {{ formatDateTime(studentGrades.createdAt!) }}
            </div>
            <div>
              <strong>Fecha actualización:</strong>
              {{ formatDateTime(studentGrades.updatedAt!) }}
            </div>
            <div v-if="studentGrades.deletedAt != null">
              <strong>Fecha de borrado:</strong>
              {{ formatDateTime(studentGrades.deletedAt!) }}
            </div>
            <div>
              <strong>Status:</strong>
              <span :style="{ color: studentGrades.status ? 'green' : 'red' }">
                {{ studentGrades.status ? ' Activo' : ' Inactivo' }}
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
import { useRouter } from 'vue-router';
import { useStudentsGradesStore } from '../store/students-grades/index';
import moment from 'moment';
// eslint-disable-next-line no-unused-vars
import { StudentsGrades, Student, Grade, Teacher } from '../types/index';

export default {
  props: {
    studentsGrades: {
      type: Array as () => StudentsGrades[],
      required: true
    }
  },
  setup() {
    const expandedStudents = ref<number[]>([]);
    const router = useRouter();
    const store = useStudentsGradesStore();

    const toggleDetails = (id: number) => {
      if (expandedStudents.value.includes(id)) {
        const index = expandedStudents.value.indexOf(id);
        expandedStudents.value.splice(index, 1);
      } else {
        expandedStudents.value.push(id);
      }
    };

    const confirmAndDeleteStudent = async (id: number) => {
      const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este estudiante?");
      if (confirmed) {
        await store.deleteStudentGrade(id); // llama al método deleteStudent de tu store
        if (store.isSuccess.value) {
          alert("Estudiante eliminado con éxito");
        } else {
          alert(`Error al eliminar estudiante: ${store.errorMessage.value}`);
        }
      }
    };

    const editStudent = (id: number) => {
      router.push({ name: 'students_grades-edit', params: { id: id.toString() } });

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
      expandedStudents,
      formatDateTime,
      formatDate,
      toggleDetails,
      editStudent,
      beforeEnter,
      enter,
      beforeLeave,
      confirmAndDeleteStudent,
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

.studentGrades-card {
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  position: relative;
  transition: background-color 0.3s;
  display: flex;
  flex-direction: column;
}

.studentGrades-card:hover {
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
  white-space: nowrap;  /* El texto no se envolverá en nuevas líneas */
  overflow: hidden;  /* Ocultar texto que excede el contenedor */
  text-overflow: ellipsis;  /* Agregar puntos suspensivos al final */
  max-width: calc(100% - 40px);  /* Puedes ajustar este valor según tus necesidades */
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

.pink {
  color: pink;
  font-weight: 600;
}

.blue {
  color: blue;
  font-weight: 700;
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

  .studentGrades-card {
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
