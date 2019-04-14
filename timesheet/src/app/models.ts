export interface Employee {
    id: number;
    code: string;
    name: string;
}

export interface Task {
    id: number;
    name: string;
    description: string;
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

export interface DayToDateMapping {
    day: string;
    date: number;
}
