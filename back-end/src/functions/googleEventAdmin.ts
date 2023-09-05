import {NextFunction, Request, Response } from "express";
import eventService from "../services/event-service";
import { inputEvent, googleEvent } from "@prisma/client";
import { authorize, fetchEvents, deleteEventCalendar} from "../google/google";

export default{
    async getEvents(req: Request, res: Response, next: NextFunction) {
        const events = await eventService.googleEvent.getEvents();
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
        res.json(eventsToSend);
      },

      async deleteEvent(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);
        const event = await eventService.googleEvent.getEventById(id);
        if(event){
        const auth = await authorize();
        const response = await eventService.googleEvent.deleteEvent(id);
        const deleteResponse = await deleteEventCalendar(auth, event.calEventId);
        res.status(200).json({ message: "Event deleted" });
        } else {
          res.status(400).json({ error: "No event found" });
        }
      }
}