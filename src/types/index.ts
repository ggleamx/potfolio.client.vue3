export interface APIResponse<T> {
    error: boolean;
    msg: string;
    payload: T;
    statusCode: number;
  }
  
  export interface Student {
    id: number | null | undefined;
    email: string;
    firstName: string;
    lastName: string;
    gender: string | null;
    dateOfBirth: string ;
    status: boolean | null | undefined;
    createdAt: string | null | undefined;
    updatedAt: string | null | undefined;
    deletedAt: string | null | undefined;
  }
  


  export interface Teacher {
    id: number | null | undefined;
    email: string;
    firstName: string;
    lastName: string;
    gender: string | null;
    status: boolean | null | undefined;
    createdAt: string | null | undefined;
    updatedAt: string | null | undefined;
    deletedAt: string | null | undefined;
  }

  export interface Grade {

    id: number | null | undefined;
    name: string;
    status: boolean | null | undefined;
    createdAt: string | null | undefined;
    section: string | null | undefined; 
    updatedAt: string | null | undefined;
    deletedAt: string | null | undefined;
    teacher: number | null | undefined | Teacher;

  }


  export interface StudentsGrades {
    id: number | null | undefined;
    student: number | null | undefined | Student;
    grade: number | null | undefined | Grade;
    status: boolean | null | undefined;
    section: string | null | undefined;
    createdAt: string | null | undefined;
    updatedAt: string | null | undefined;
    deletedAt: string | null | undefined;
  }




