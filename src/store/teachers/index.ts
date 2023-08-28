
import { ref,Ref } from 'vue';
import axios from 'axios';
import { APIResponse, Teacher } from '../../types';

type State = {
  teachers:  Ref<Teacher[]>;

  totalItems: Ref<number>;
  totalPages: Ref<number>;
  currentPage : Ref<number>;

  isLoading: Ref<boolean>;
  isSuccess: Ref<boolean>;
  errorMessage: Ref<string>;
};

const state: State = {
  teachers: ref([]),

  totalItems: ref(0),
  totalPages: ref(0),
  currentPage: ref(0),

  isLoading: ref(false),
  isSuccess: ref(false),
  errorMessage: ref(''),
}

const addTeacher = async (newTeacher: Teacher) => {
  state.isLoading.value = true;
  try {
    const response = await axios.post<APIResponse<Teacher>>('http://localhost:8080/api/teachers', newTeacher);
    if (response.status === 201 || response.status === 200) {
      state.teachers.value.push(response.data.payload);
      state.isSuccess.value = true;
    }
  } catch (error:any) {
    console.error("Error al añadir estudiante:", error);
    state.isSuccess.value = false;
    if (error.response?.data?.msg) {  // Utiliza optional chaining aquí
      state.errorMessage.value = error.response.data.msg;
    } else {
      state.errorMessage.value = "Error al añadir estudiante"; // Puede ser más específico según el error
    }
  } finally {
    state.isLoading.value = false;
  }
};


const fetchTeachers = async (page = 0, size = 5) => {
  if(page < 0 || size < 0 ) return;
  if(page > 0 && page >= state.totalPages.value) return;
  state.isLoading.value = true;
  try {
    const response = await fetch(`http://localhost:8080/api/teachers?page=${page}&size=${size}`);
    const data = await response.json();

      state.teachers.value = data.payload.teachers;
      state.totalItems.value = data.payload.totalItems;
      state.totalPages.value = data.payload.totalPages;
      state.currentPage.value = data.payload.currentPage;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
  } finally {
    state.isLoading.value = false;
  }
};


const updateTeacher = async (updatedTeacher: Teacher) => {
  state.isLoading.value = true;
  try {
    const response = await axios.put<APIResponse<Teacher>>(`http://localhost:8080/api/teachers/${updatedTeacher.id}`, updatedTeacher);
    if (response.status === 200) {
      const index = state.teachers.value.findIndex(Teacher => Teacher.id === updatedTeacher.id);
      if (index !== -1) {
        state.teachers.value[index] = updatedTeacher;
      }
      state.isSuccess.value = true;
    }
  } catch (error: any) {

    state.isSuccess.value = false;
    if (error.response?.data?.msg) {
      state.errorMessage.value = error.response.data.msg;
    } else {
      state.errorMessage.value = "Error al actualizar el maestro";
    }
  } finally {
    state.isLoading.value = false;
  }
}

const getTeacherById = (id: number): Teacher | null => {
  if(state.teachers.value.length === 0)
  return null;

  const Teacher = state.teachers.value.find(Teacher => Teacher.id === id);

  if(Teacher === undefined)
  return null;

  return Teacher;
}

const deleteTeacher = async (id: number) => {
  state.isLoading.value = true;
  try {
    const response = await axios.delete<APIResponse<void>>(`http://localhost:8080/api/teachers/${id}`);
    if (response.status === 200) {
      const index = state.teachers.value.findIndex(Teacher => Teacher.id === id);
      if (index !== -1) {
        state.teachers.value[index].status = false;
      }
      state.isSuccess.value = true;
    }
  } catch (error: any) {
    state.isSuccess.value = false;
    if (error.response?.data?.msg) {
      state.errorMessage.value = error.response.data.msg;
    } else {
      state.errorMessage.value = "Error al eliminar maestro";
    }
  } finally {
    state.isLoading.value = false;
  }
};



export const useTeachersStore = () => {
  return {
    ...state,
    addTeacher,
    fetchTeachers,
    updateTeacher,
    getTeacherById,
    deleteTeacher
  };
};
