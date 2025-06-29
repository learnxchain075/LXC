export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    min?: number;
    max?: number;
    custom?: (value: any, data: any) => string | null;
    validValues?: any[];
    type?: "string" | "number" | "date";
  }
  
  export interface ValidationRules {
    [key: string]: ValidationRule;
  }
  
  export const validateForm = <T extends unknown>(data: T, rules: ValidationRules): Record<string, string> => {
    const errors: Record<string, string> = {};
  
    Object.keys(rules).forEach((field) => {
      const rule = rules[field];
      const value = (data as any)[field];
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1");
  
    
      if (rule.required && (value === undefined || value === null || value === "")) {
        errors[field] = `${fieldName} is required`;
        return;
      }
  
     
      if (value === undefined || value === null || value === "") {
        return;
      }
  
    
      if (rule.type) {
        if (rule.type === "string" && typeof value !== "string") {
          errors[field] = `${fieldName} must be a string`;
          return;
        }
        if (rule.type === "number" && (typeof value !== "number" || isNaN(value))) {
          errors[field] = `${fieldName} must be a valid number`;
          return;
        }
        if (rule.type === "date" && !(value instanceof Date && !isNaN(value.getTime()))) {
          errors[field] = `${fieldName} must be a valid date`;
          return;
        }
      }
  
    
      if (typeof value === "string") {
        if (rule.minLength && value.length < rule.minLength) {
          errors[field] = `${fieldName} must be at least ${rule.minLength} characters`;
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors[field] = `${fieldName} must be at most ${rule.maxLength} characters`;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errors[field] = `${fieldName} has an invalid format`;
        }
      }
  
     
      if (typeof value === "number") {
        if (rule.min !== undefined && value < rule.min) {
          errors[field] = `${fieldName} must be at least ${rule.min}`;
        }
        if (rule.max !== undefined && value > rule.max) {
          errors[field] = `${fieldName} must be at most ${rule.max}`;
        }
      }
  
      if (rule.validValues && !rule.validValues.includes(value)) {
        errors[field] = `${fieldName} must be one of: ${rule.validValues.join(", ")}`;
      }
  
     
      if (rule.custom) {
        const customError = rule.custom(value, data);
        if (customError) {
          errors[field] = customError;
        }
      }
    });
  
    return errors;
  };