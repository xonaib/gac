export interface Employee {
    Id: number;
    Code: string;
    Name: string;
}

export interface Task {
    Id: number;
    Name: string;
    Description: string;
}

export interface Effort {
    Id: number;
    Date: number;
    hours: number;
    taskId: number;
    employeeId: number;
    isDirty?: boolean;
}

export interface EmployeeTasksAndEffort {
    tasks: Task[];
    efforts: Effort[];
}

export interface DayToDateMapping {
    day: string;
    date: number;
    idx: number;
}
