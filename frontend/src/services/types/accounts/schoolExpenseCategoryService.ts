
export interface ISchoolExpenseCategory {
    id: string;
    name: string;
    schoolId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ICreateSchoolExpenseCategory {
    name: string;
    schoolId: string;
  }
  
  export interface IUpdateSchoolExpenseCategory {
    name: string;
  }
  

  // router.post('/school/expense-category', createSchoolExpenseCategory);
  // router.get('/school/expense-category/:schoolId', getSchoolExpenseCategories);
  // router.put('/school/expense-category/:id', updateSchoolExpenseCategory);
  // router.delete('/school/expense-category/:id', deleteSchoolExpenseCategory);
  