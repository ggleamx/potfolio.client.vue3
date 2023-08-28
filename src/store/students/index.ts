
import { ref,Ref } from 'vue';
import axios from 'axios';
import { APIResponse, Student } from '../../types';

type State = {
  students:  Ref<Student[]>;

  totalItems: Ref<number>;
  totalPages: Ref<number>;
  currentPage : Ref<number>;

  isLoading: Ref<boolean>;
  isSuccess: Ref<boolean>;
  errorMessage: Ref<string>;
};

const state: State = {
  students: ref([]),

  totalItems: ref(0),
  totalPages: ref(0),
  currentPage: ref(0),

  isLoading: ref(false),
  isSuccess: ref(false),
  errorMessage: ref(''),
}

const addStudent = async (newStudent: Student) => {
  state.isLoading.value = true;
  try {
    const response = await axios.post<APIResponse<Student>>('http://localhost:8080/api/students', newStudent);
    if (response.status === 201 || response.status === 200) {
      state.students.value.push(response.data.payload);
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


const fetchStudents = async (page = 0, size = 5) => {
  if(page < 0 || size < 0 ) return;
  if(page > 0 && page >= state.totalPages.value) return;
  state.isLoading.value = true;
  try {
    const response = await fetch(`http://localhost:8080/api/students?page=${page}&size=${size}`);
    const data = await response.json();

      state.students.value = data.payload.students;
      state.totalItems.value = data.payload.totalItems;
      state.totalPages.value = data.payload.totalPages;
      state.currentPage.value = data.payload.currentPage;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
  } finally {
    state.isLoading.value = false;
  }
};


const updateStudent = async (updatedStudent: Student) => {
  state.isLoading.value = true;
  try {
    const response = await axios.put<APIResponse<Student>>(`http://localhost:8080/api/students/${updatedStudent.id}`, updatedStudent);
    if (response.status === 200) {
      const index = state.students.value.findIndex(student => student.id === updatedStudent.id);
      if (index !== -1) {
        state.students.value[index] = updatedStudent;
      }
      state.isSuccess.value = true;
    }
  } catch (error: any) {

    state.isSuccess.value = false;
    if (error.response?.data?.msg) {
      state.errorMessage.value = error.response.data.msg;
    } else {
      state.errorMessage.value = "Error al actualizar el estudiante";
    }
  } finally {
    state.isLoading.value = false;
  }
};


const getStudentById = (id: number): Student | null => {
  if(state.students.value.length === 0)
  return null;

  const student = state.students.value.find(student => student.id === id);

  if(student === undefined)
  return null;

  return student;
}

const deleteStudent = async (id: number) => {
  state.isLoading.value = true;
  try {
    const response = await axios.delete<APIResponse<void>>(`http://localhost:8080/api/students/${id}`);
    if (response.status === 200) {
      const index = state.students.value.findIndex(student => student.id === id);
      if (index !== -1) {
        state.students.value[index].status = false;
      }
      state.isSuccess.value = true;
    }
  } catch (error: any) {
    console.error("Error al eliminar estudiante:", error);
    state.isSuccess.value = false;
    if (error.response?.data?.msg) {
      state.errorMessage.value = error.response.data.msg;
    } else {
      state.errorMessage.value = "Error al eliminar estudiante";
    }
  } finally {
    state.isLoading.value = false;
  }
};



export const useStudentsStore = () => {
  return {
    ...state,
    addStudent,
    fetchStudents,
    updateStudent,
    getStudentById,
    deleteStudent
  };
};
