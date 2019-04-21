export interface Employee {
    Id: number;
    Code: string;
    Name: string;
    Hours: number;
    AvgHours: number;
}

export interface Task {
    Id: number;
    Name: string;
    Description: string;
}

export interface Effort {
    Id: number;
    Date: number;
    Hours: number;
    TaskId: number;
    EmployeeId: number;
    isDirty?: boolean;
}

export interface EmployeeTasksAndEffort {
    Tasks: Task[];
    Efforts: Effort[];
}

export interface DayToDateMapping {
    day: string;
    date: number;
    idx: number;
}

export interface WeekStartAndEndDates {
    weekStartDate: number;
    weekEndDate: number;
}