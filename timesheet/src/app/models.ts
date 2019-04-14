export interface Employee {
    id: number;
    code: string;
    name: string;
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
}

export interface EmployeeTasksAndEffort {
    tasks: Task[];
    efforts: Effort[];
}