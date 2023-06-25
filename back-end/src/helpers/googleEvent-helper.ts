import {NextFunction, Request, Response } from "express";
import eventService from "../services/event-service";
import { inputEvent, googleEvent } from "@prisma/client";
import { createEvent, authorize, fetchEvents} from "../google/google";

export default {
  async getEvents(req: Request, res: Response, next: NextFunction) {
    const events = await eventService.googleEvent.getEvents();
    let eventsToSend : any[] = [];
    //edit the event so event.startDate is like year-month-day, and event.startTime is like hour:minute, same for endDate and endTime
    res.json(eventsToSend);
  },
  
  async getEventsForMonth(req: Request, res: Response, next: NextFunction) {
    const month = parseInt(req.params.month);
    const events = await eventService.googleEvent.getEventsForMonth(month);
    console.log(events[0])
    let eventsToSend : any[] = [];
    for (let i = 0; i < events.length; i++) {
      let event = events[i];
      let eventToSend = {
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: new Date(event.start).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'}),
        startTime: event.start.toISOString().split('T')[1].slice(0,5),
        endDate: new Date(event.end).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'}),
        endTime: event.end.toISOString().split('T')[1].slice(0,5),
        calEventId: event.calEventId,
        userId: event.userId   
      };
      eventsToSend.push(eventToSend);
    }
    console.log(eventsToSend);
    res.json(eventsToSend);
  }
};
