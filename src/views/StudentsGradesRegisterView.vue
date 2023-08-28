<template>
    <div class="register-container">
        <h2 v-if="!isEditMode">Registrar <br> Estudiante - Grado</h2>
        <h2 v-else>Editar Estudiante - Grado</h2>
        <form @submit.prevent="handleSubmit">
            <div class="input-group">
                <label for="sectionName">Grupo</label>
               
                <select id="section" v-model="selectedSection">
                    <option disabled value="">Selecciona uno</option>
                    <option v-for="section in sections" :key="section" :value="section">
                        {{ section }}
                    </option>
                    <option :value="'load-more'">Cargar más...</option>
                </select>

                <div v-if="sectionNameError" class="error">El campo es requerido</div>
            </div>

            <div class="input-group">
                <label for="student">Estudiante</label>
                <select id="student" v-model="selectedStudentId" @change="handleStudentChange">
                    <option disabled value="">Selecciona uno</option>
                    <option v-for="student in students" :key="student.id!" :value="student.id">
                        {{ student.firstName }} {{ student.lastName }}
                    </option>
                </select>
                <div v-if="studentError" class="error">El campo es requerido</div>
            </div>



            <div class="input-group">
                <label for="grade">Grado</label>
                <select id="grade" v-model="selectGradeId" @change="handleGradeChange">
                    <option disabled value="">Selecciona uno</option>
                    <option v-for="grade in grades" :key="grade.id!" :value="grade.id">
                        {{ grade.name }} grado
                    </option>
                    <option :value="'load-more'">Cargar más...</option>
                </select>
                <div v-if="studentError" class="error">El campo es requerido</div>
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
import { Student, StudentsGrades, Grade } from '../types/index';
import { useStudentsStore } from '../store/students/index';
import { useStudentsGradesStore } from '../store/students-grades/index';

export default {
    setup() {
        const route = useRoute()
        const router = useRouter();

        const isEditMode = ref<boolean>(false);
        const studentGradeToEdit = ref<StudentsGrades | null>(null);

        const { grades, fetchGrades } = useGradesStore();
        const { students, fetchStudents } = useStudentsStore();

        const { addStudentGrade, updateStudentGrade, getStudentGradeById, sections , errorMessage, isSuccess, isLoading } = useStudentsGradesStore();
        const currentSize = ref<number>(5);

        const selectedSection = ref<string>('');

        const selectedStudentId = ref<number | null | string  | undefined>(null);
        const studentError = ref<boolean>(false);

        const selectGradeId = ref<number | null |  string | undefined>(null);
        const gradeError = ref<boolean>(false);


        const sectionNameError = ref<boolean>(false);


        const handleStudentChange = async () => {
            if (selectedStudentId.value === 'load-more') {
                currentSize.value += 1;
                await fetchStudents(0, currentSize.value + 5);
            }
        }

        const handleGradeChange = async () => {
  if (selectGradeId.value === 'load-more') {
    currentSize.value += 1;
    await fetchGrades(0,currentSize.value + 5); 
  }
};

        onMounted(async () => {
            errorMessage.value = ''

            await fetchGrades();
            await fetchStudents();

            const id = route.params.id;

            if (id !== undefined) {
                isEditMode.value = true;
                const grade = getStudentGradeById(parseInt(id.toString()));

                if (grade) {
                    selectedSection.value = grade.section!;
                    selectedStudentId.value = (grade.student as Student).id;
                    selectGradeId.value = (grade.grade as Grade).id;
                }

                studentGradeToEdit.value = grade;
                // actualizar solo a los estudiantes disponibles 

            }

        });

        const validateField = (field: string | null, errorRef: typeof sectionNameError) => {
            if (field === null || field === '') {
                errorRef.value = true;
                return false;
            } else {
                errorRef.value = false;
                return true;
            }
        };

        const handleSubmit = async () => {
            const isSectionNameValid = validateField(selectedSection.value, sectionNameError);
            const isStudentIdValid = validateField(selectedStudentId.value == null || selectedStudentId.value === 'load-more' ? "" : selectedStudentId.value.toString(), studentError);
            const isGradeIdValid = validateField(selectGradeId.value == null  || selectGradeId.value === 'load-more' ?  "" : selectGradeId.value.toString(), gradeError);

            if (isStudentIdValid && isSectionNameValid && isGradeIdValid) {
                const newStudentGrade = {
                    student_id: selectedStudentId.value,
                    grade_id: selectGradeId.value,
                    section: selectedSection.value

                };

                if (isEditMode.value) {

                    await updateStudentGrade(newStudentGrade, studentGradeToEdit.value!.id!);
                } else {
                    await addStudentGrade(newStudentGrade);
                }

                if (isSuccess.value) {

                    router.push('/');
                }
            }
        };

        const handleCancel = () => {
            router.push('/grades');
        };

        return {
            selectedSection,
            sectionNameError,
            isLoading,
            isSuccess,
            errorMessage,
            isEditMode,
            students,
            grades,
            selectedStudentId,
            studentError,
            selectGradeId,
            gradeError,
            sections,
            handleStudentChange,
            handleGradeChange,
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
