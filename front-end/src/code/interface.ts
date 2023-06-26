export interface CalEvent {
  id?: number;
  title?: string;
  description?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  calEventId?: string;
  userId?: number;
  status: string;
}
