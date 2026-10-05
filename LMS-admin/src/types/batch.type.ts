export type BatchStatus = "upcoming" | "ongoing" | "completed";

export interface BatchSchedule {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    days: string[];
}

export interface Batch {
    _id: string;
    batchName: string;
    day: string;
    course: string;
    mentor: string;
    students: string[];
    schedule: BatchSchedule;
    status: BatchStatus
}
