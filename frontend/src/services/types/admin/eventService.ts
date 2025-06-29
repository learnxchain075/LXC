export interface IEventForm {
    id: string;
    title: string;
    description?: string;
    start: string; // or Date depending on usage
    end: string;   // or Date depending on usage
    category: string;
    attachment?: string;
    targetAudience: "ALL" | "STUDENTS" | "TEACHERS" | string;
    schoolId: string;
    roles: Role[];
    sections: Section[];
    Class: Class[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Role {
    id: string;
    name: string;
  }
  
  export interface Section {
    id: string;
    name: string;
  }
  
  export interface Class {
    id: string;
    name: string;
  }
  

