<template>
    <div class="register-container">
        <h2 v-if="!isEditMode">Registrar Grado</h2>
        <h2 v-else>Editar Grado</h2>
        <form @submit.prevent="handleSubmit">
            <div class="input-group">
                <label for="gradeName">Nombre del Grado</label>
                <input type="text" id="gradeName" v-model="gradeName" />
                <div v-if="gradeNameError" class="error">El campo es requerido</div>
            </div>

            <div class="input-group">
        <label for="teacher">Maestro</label>
        <select id="teacher" v-model="selectedTeacherId"  @change="handleTeacherChange">
            <option disabled value="">Selecciona uno</option>
            <option v-for="teacher in teachers" :key="teacher.id!" :value="teacher.id">
                {{ teacher.firstName }} {{ teacher.lastName }}
            </option>
            <option :value="'load-more'">Cargar más...</option>

        </select>
        <div v-if="teacherError" class="error">El campo es requerido</div>
    </div>
            <div class="button-group">
                <button type="button" @click="handleCancel">Cancelar</button>
                <button type="submit">{{ isEditMode ? 'Actualizar' : 'Guardar' }}</button>
            </div>
        </form>

        <div v-if="isLoading" class="loading-container">
            <div class="loading-circle"></div>
        </div>
      
        <div v-if="errorMessage" class="snackbar error">
            {{ errorMessage }}
        </div>
    </div>
</template>
  
<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGradesStore } from '../store/grades/index';
import { Grade, Teacher } from '../types/index';
import { useTeachersStore } from '../store/teachers/index';

export default {
    setup() {
        const route = useRoute()
        const router = useRouter();

        const isEditMode = ref<boolean>(false);
        const gradeToEdit = ref<Grade | null>(null);

        const { addGrade, getGradeById, updateGrade, isSuccess, errorMessage, isLoading } = useGradesStore();
        const { teachers, fetchTeachers } = useTeachersStore();

        const currentSize = ref<number>(5);


        const selectedTeacherId = ref<number | string | null | undefined>(null); 
        const teacherError = ref<boolean>(false);

        const gradeName = ref<string>('');

        const gradeNameError = ref<boolean>(false);

const handleTeacherChange = async () => {
  if (selectedTeacherId.value === 'load-more') {
    currentSize.value += 1;
    await fetchTeachers(0,currentSize.value + 5); 
  }
};

        onMounted( async() => {
            errorMessage.value = ''

            await fetchTeachers(currentSize.value); 

            const id = route.params.id;

            if (id !== undefined) {
                isEditMode.value = true;
                const grade = getGradeById(parseInt(id.toString()));

                if (grade) {
                    gradeName.value = grade.name;
                    selectedTeacherId.value = (grade.teacher as Teacher).id;
                }

                gradeToEdit.value = grade;
            }
        });

        const validateField = (field: string | null, errorRef: typeof gradeNameError) => {
            if (field === null || field === '') {
                errorRef.value = true;
                return false;
            } else {
                errorRef.value = false;
                return true;
            }
        };

        const handleSubmit = async () => {
            const isGradeNameValid = validateField(gradeName.value, gradeNameError);
            const isTeacherValid = validateField(selectedTeacherId.value == null || selectedTeacherId.value === 'load-more'? "" : selectedTeacherId.value.toString(), teacherError); 

            if (isTeacherValid && isGradeNameValid && isTeacherValid) {
                const newGrade = {
                    name: gradeName.value,
                    teacher_id: selectedTeacherId.value
                };

                if (isEditMode.value) {

                    await updateGrade(newGrade, gradeToEdit.value!.id!);
                } else {
                    await addGrade(newGrade);
                }

                if (isSuccess.value) {
                    router.push('/grades');
                }
            }
        };

        const handleCancel = () => {
            router.push('/grades');
        };

        return {
            gradeName,
            gradeNameError,
            isLoading,
            isSuccess,
            errorMessage,
            isEditMode,
            teachers,
            selectedTeacherId,
            teacherError,
            handleTeacherChange,
            handleSubmit,
            handleCancel
        };
    }
};
</script>

<style scoped>
.register-container {
    max-width: 500px;
    margin: 0 auto;
    border-radius: 5px;
}

h2 {
    margin-bottom: 20px;
    text-align: center;
}

.input-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 10px;
    font-weight: 600;
}

input,
select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.error {
    margin-top: 5px;
    color: red;
}

.button-group {
    display: flex;
    justify-content: space-between;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #2196F3;
    color: white;
}

button[type="button"] {
    background-color: #ccc;
}
</style>
