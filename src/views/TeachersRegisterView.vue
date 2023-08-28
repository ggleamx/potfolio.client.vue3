<template>
    <div class="register-container">
        <h2 v-if="!isEditMode">Registrar Maestro</h2>
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
import { useTeachersStore } from '../store/teachers/index';
import { Teacher } from '../types/index';

export default {

    setup() {

        const route = useRoute()
        const router = useRouter();

        const isEditMode = ref<boolean>(false);
        const teacherToEdit = ref<Teacher | null>(null);
        const { addTeacher, getTeacherById, updateTeacher, isSuccess, errorMessage, isLoading } = useTeachersStore();

        const firstName = ref<string>('');
        const lastName = ref<string>('');
        const email = ref<string>('');
        const gender = ref<string | null>(null);

        const firstNameError = ref<boolean>(false);
        const lastNameError = ref<boolean>(false);
        const emailError = ref<boolean>(false);
        const genderError = ref<boolean>(false);


        onMounted(() => {
            const id = route.params.id;
            errorMessage.value = ''
            if (id !== undefined) {
                isEditMode.value = true;
                const teacher = getTeacherById(parseInt(id.toString()));
                if (teacher) {
                    firstName.value = teacher.firstName;
                    lastName.value = teacher.lastName;
                    email.value = teacher.email;
                    gender.value = teacher.gender;
                }

                teacherToEdit.value = teacher;
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
            const isGenderValid = validateField(gender.value, genderError)



            if (isGenderValid && isFirstNameValid && isLastNameValid && isEmailValid) {
                const newTeacher: Teacher = {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    email: email.value,
                    gender: gender.value,
                    id: isEditMode.value ? teacherToEdit.value?.id : null,
                    status: isEditMode.value ? teacherToEdit.value?.status : null,
                    createdAt: isEditMode.value ? teacherToEdit.value?.createdAt : null,
                    updatedAt: isEditMode.value ? teacherToEdit.value?.updatedAt : null,
                    deletedAt: isEditMode.value ? teacherToEdit.value?.deletedAt : null
                }



                if (isEditMode.value) {
                    await updateTeacher(newTeacher);
                } else {
                    await addTeacher(newTeacher);
                }


                if (isSuccess.value) {
                    router.push('/teachers');
                }
            }
        };

        const handleCancel = () => {
            router.push('/teachers');
        };

        return {
            gender,
            genderError,
            firstName,
            lastName,
            email,
            firstNameError,
            lastNameError,
            emailError,
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
