
import { ref,Ref } from 'vue';
import axios from 'axios';
import { APIResponse, StudentsGrades } from '../../types';

type State = {
  studentsGrades:  Ref<StudentsGrades[]>;

  totalItems: Ref<number>;
  totalPages: Ref<number>;
  currentPage : Ref<number>;

  isLoading: Ref<boolean>;
  isSuccess: Ref<boolean>;
  errorMessage: Ref<string>;
};

const state: State = {
  studentsGrades: ref([]),

  totalItems: ref(0),
  totalPages: ref(0),
  currentPage: ref(0),

  isLoading: ref(false),
  isSuccess: ref(false),
  errorMessage: ref(''),
}

const addStudentGrade = async (newGrade:any) => {
  state.isLoading.value = true;
  try {
    const response = await axios.post<APIResponse<StudentsGrades>>('http://localhost:8080/api/students_grades', newGrade);
    if (response.status === 201 || response.status === 200) {

      state.isSuccess.value = true;
    }
  } catch (error:any) {
    state.isSuccess.value = false;
    if (error.response?.data?.msg) {  
      state.errorMessage.value = error.response.data.msg;
    } else {
      state.errorMessage.value = "Error al añadir registro"; 
    }
  } finally {
    state.isLoading.value = false;
  }
};


const fetchStudentsGrades = async (page = 0, size = 5) => {
  if(page < 0 || size < 0 ) return;
  if(page > 0 && page >= state.totalPages.value) return;
  state.isLoading.value = true;

  try {
    const response = await fetch(`http://localhost:8080/api/students_grades?page=${page}&size=${size}`);
    const data = await response.json();

      state.studentsGrades.value = data.payload.students_grades;
      state.totalItems.value = data.payload.totalItems;
      state.totalPages.value = data.payload.totalPages;
      state.currentPage.value = data.payload.currentPage;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
  } finally {
    state.isLoading.value = false;
  }
};


const updateStudentGrade = async (updatedGrade:any, id:number) => {

  state.isLoading.value = true;
  try {
    const response = await axios.put<APIResponse<StudentsGrades>>(`http://localhost:8080/api/students_grades/${id}`, updatedGrade);
    if (response.status === 200) {
      const index = state.studentsGrades.value.findIndex(grade => grade.id === updatedGrade.id);
      if (index !== -1) {
        state.studentsGrades.value[index] = updatedGrade;
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


const getStudentGradeById = (id: number): StudentsGrades | null => {
  if(state.studentsGrades.value.length === 0)
  return null;

  const grade = state.studentsGrades.value.find(grade => grade.id === id);
  if(grade === undefined)
  return null;

  return grade;
}

const deleteStudentGrade = async (id: number) => {
  state.isLoading.value = true;
  try {
    const response = await axios.delete<APIResponse<void>>(`http://localhost:8080/api/students_grades/${id}`);
    if (response.status === 200) {
     // remove from array

      const index = state.studentsGrades.value.findIndex(grade => grade.id === id);
      if (index !== -1) {
        state.studentsGrades.value.splice(index, 1);
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



export const useStudentsGradesStore = () => {
  return {
    ...state,
    sections: [
      'A',
      'B',
      'C',
      'D'
    ],
    addStudentGrade,
    fetchStudentsGrades,
    updateStudentGrade,
    getStudentGradeById,
    deleteStudentGrade
  };
};
