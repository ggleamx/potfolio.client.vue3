<template>
    <div class="register-container">
        <h2 v-if="!isEditMode">Registrar Estudiante</h2>
        <h2 v-else>Editar Estudiante</h2>
        <form @submit.prevent="handleSubmit">
            <div class="input-group">
                <label for="firstName">Nombre</label>
                <input type="text" id="firstName" v-model="firstName" />
                <div v-if="firstNameError" class="error">El campo es requerido</div>
            </div>
            <div class="input-group">
                <label for="lastName">Apellido</label>
                <input type="text" id="lastName" v-model="lastName" />
                <div v-if="lastNameError" class="error">El campo es requerido</div>
            </div>
            <div class="input-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" v-model="email" />
                <div v-if="emailError" class="error">El campo es requerido</div>
            </div>
            <div class="input-group">
                <label for="dateOfBirth">Fecha de Nacimiento</label>
                <input type="date" id="dateOfBirth" v-model="dateOfBirth" />
                <div v-if="dateOfBirthError" class="error">El campo es requerido</div>
            </div>
            <div class="input-group">
                <label for="gender">Género</label>
                <select id="gender" v-model="gender">
                    <option disabled value="">Selecciona uno</option>
                    <option>M</option>
                    <option>F</option>
                </select>
                <div v-if="genderError" class="error">El campo es requerido</div>
            </div>
            <div class="button-group">
                <button type="button" @click="handleCancel">Cancelar</button>
                <button type="submit">{{ isEditMode ? 'Actualizar' : 'Guardar' }}</button>
            </div>
        </form>

        <div v-if="isLoading" class="loading-container">
            <div class="loading-circle"></div> <!-- Tu círculo de carga -->
        </div>
       
        <div v-if="errorMessage" class="snackbar error">
            {{ errorMessage }}
        </div>
    </div>
</template>
  
<script lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStudentsStore } from '../store/students/index';
import { Student } from '../types/index';

export default {

    setup() {

        const route = useRoute()
        const router = useRouter();

        const isEditMode = ref<boolean>(false);
        const studentToEdit = ref<Student | null>(null);
        const { addStudent, getStudentById, updateStudent, isSuccess, errorMessage, isLoading } = useStudentsStore();
        errorMessage.value = ''
        const firstName = ref<string>('');
        const lastName = ref<string>('');
        const email = ref<string>('');
        const dateOfBirth = ref<string>('');
        const gender = ref<string | null>(null);

        const firstNameError = ref<boolean>(false);
        const lastNameError = ref<boolean>(false);
        const emailError = ref<boolean>(false);
        const dateOfBirthError = ref<boolean>(false);
        const genderError = ref<boolean>(false);


        onMounted(() => {
            const id = route.params.id;

            if (id !== undefined) {
                isEditMode.value = true;
                const student = getStudentById(parseInt(id.toString()));
                if (student) {
                    firstName.value = student.firstName;
                    lastName.value = student.lastName;
                    email.value = student.email;
                    dateOfBirth.value = student.dateOfBirth;
                    gender.value = student.gender;
                }

                studentToEdit.value = student;
            }
        });


        const validateField = (field: string | null, errorRef: typeof genderError) => {
            if (field === null || field === '') {
                errorRef.value = true;
                return false;
            } else {
                errorRef.value = false;
                return true;
            }
        };

        const handleSubmit = async () => {
            const isFirstNameValid = validateField(firstName.value, firstNameError);
            const isLastNameValid = validateField(lastName.value, lastNameError);
            const isEmailValid = validateField(email.value, emailError);
            const isDateOfBirthValid = validateField(dateOfBirth.value, dateOfBirthError);
            const isGenderValid = validateField(gender.value, genderError)



            if (isGenderValid && isFirstNameValid && isLastNameValid && isEmailValid && isDateOfBirthValid) {
                const newStudent: Student = {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    email: email.value,
                    dateOfBirth: dateOfBirth.value,
                    gender: gender.value,
                    id: isEditMode.value ? studentToEdit.value?.id : null,
                    status: isEditMode.value ? studentToEdit.value?.status : null,
                    createdAt: isEditMode.value ? studentToEdit.value?.createdAt : null,
                    updatedAt: isEditMode.value ? studentToEdit.value?.updatedAt : null,
                    deletedAt: isEditMode.value ? studentToEdit.value?.deletedAt : null
                }



                if (isEditMode.value) {
                    await updateStudent(newStudent);
                } else {
                    await addStudent(newStudent);
                }


                if (isSuccess.value) {
                    router.push('/students');
                }
            }
        };

        const handleCancel = () => {
            router.push('/students');
        };

        return {
            gender,
            genderError,
            firstName,
            lastName,
            email,
            dateOfBirth,
            firstNameError,
            lastNameError,
            emailError,
            dateOfBirthError,
            isLoading,
            isSuccess,
            errorMessage,
            isEditMode,
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
