
import { ref,Ref } from 'vue';
import axios from 'axios';
import { APIResponse, Grade } from '../../types';

type State = {
  grades:  Ref<Grade[]>;

  totalItems: Ref<number>;
  totalPages: Ref<number>;
  currentPage : Ref<number>;

  isLoading: Ref<boolean>;
  isSuccess: Ref<boolean>;
  errorMessage: Ref<string>;
};

const state: State = {
  grades: ref([]),

  totalItems: ref(0),
  totalPages: ref(0),
  currentPage: ref(0),

  isLoading: ref(false),
  isSuccess: ref(false),
  errorMessage: ref(''),
}

const addGrade = async (newGrade:any) => {
  state.isLoading.value = true;
  try {
    const response = await axios.post<APIResponse<Grade>>('http://localhost:8080/api/grades', newGrade);
    if (response.status === 201 || response.status === 200) {
      state.grades.value.push(response.data.payload);
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


const fetchGrades = async (page = 0, size = 5) => {
  if(page < 0 || size < 0 ) return;
  if(page > 0 && page >= state.totalPages.value) return;
  state.isLoading.value = true;
  try {
    const response = await fetch(`http://localhost:8080/api/grades?page=${page}&size=${size}`);
    const data = await response.json();

      state.grades.value = data.payload.grades;
      state.totalItems.value = data.payload.totalItems;
      state.totalPages.value = data.payload.totalPages;
      state.currentPage.value = data.payload.currentPage;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
  } finally {
    state.isLoading.value = false;
  }
};


const updateGrade = async (updatedGrade:any, id:number) => {

  state.isLoading.value = true;
  try {
    const response = await axios.put<APIResponse<Grade>>(`http://localhost:8080/api/grades/${id}`, updatedGrade);
    if (response.status === 200) {
      const index = state.grades.value.findIndex(grade => grade.id === updatedGrade.id);
      if (index !== -1) {
        state.grades.value[index] = updatedGrade;
      }
      state.isSuccess.value = true;
    }
  } catch (error: any) {

    state.isSuccess.value = false;
    if (error.response?.data?.msg) {
      state.errorMessage.value = error.response.data.msg;
    } else {
      state.errorMessage.value = "Error al actualizar el grado";
    }
  } finally {
    state.isLoading.value = false;
  }
};


const getGradeById = (id: number): Grade | null => {
  if(state.grades.value.length === 0)
  return null;

  const grade = state.grades.value.find(grade => grade.id === id);
  if(grade === undefined)
  return null;

  return grade;
}

const deleteGrade = async (id: number) => {
  state.isLoading.value = true;
  try {
    const response = await axios.delete<APIResponse<void>>(`http://localhost:8080/api/grades/${id}`);
    if (response.status === 200) {
      const index = state.grades.value.findIndex(grade => grade.id === id);
      if (index !== -1) {
        state.grades.value[index].status = false;
      }
      state.isSuccess.value = true;
    }
  } catch (error: any) {

    state.isSuccess.value = false;
    if (error.response?.data?.msg) {
      state.errorMessage.value = error.response.data.msg;
    } else {
      state.errorMessage.value = "Error al eliminar el grado";
    }
  } finally {
    state.isLoading.value = false;
  }
};



export const useGradesStore = () => {
  return {
    ...state,
    addGrade,
    fetchGrades,
    updateGrade,
    getGradeById,
    deleteGrade
  };
};
