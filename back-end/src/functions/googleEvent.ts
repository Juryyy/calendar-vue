import {NextFunction, Request, Response } from "express";
import eventService from "../services/event-service";
import { inputEvent, googleEvent } from "@prisma/client";
import { authorize, fetchEvents, deleteEventCalendar, updateGoogleEvent} from "../google/google";

import {
  eventInputChecker,
  titleChecker,
  descriptionChecker,
} from "../middlewear/inputChecker";

export default {

  
  async getEventsForMonth(req: Request, res: Response, next: NextFunction) {
    const month = parseInt(req.params.month);
    const events = await eventService.googleEvent.getEventsForMonth(month);
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

  async getEventsForUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if(userId){
    const events = await eventService.googleEvent.getEventsByUserId(userId);
    if(events){
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
  } else {
    res.status(400).json({ error: "No events found" });
  }
  } else {
    res.status(400).json({ error: "No user found" });
  }
},
  // * Fetch events from google calendar and save them to database
  async fetchEventsFromG(req: Request, res: Response, next: NextFunction) {
    const auth = await authorize();
    const response = await fetchEvents(auth);
    if (response.error !== null) {
      return response.error;
    } else {
      if (response.events) {
        for (let event of response.events) {
          if (
            event.summary &&
            event.description &&
            event.start &&
            event.end &&
            event.id &&
            event.start.dateTime &&
            event.end.dateTime
          ) {
            const calEventId = event.id;
            const existingEvent =
              await eventService.googleEvent.getEventByCalEventId(calEventId);
            if (!existingEvent) {
              const adjustedStart = new Date(event.start.dateTime);
              adjustedStart.setHours(adjustedStart.getHours() + 2);

              const adjustedEnd = new Date(event.end.dateTime);
              adjustedEnd.setHours(adjustedEnd.getHours() + 2);

              const eventToSave: Omit<googleEvent, "id"> = {
                title: event.summary.split(" ### ")[0],
                description: event.description,
                start: adjustedStart,
                end: adjustedEnd,
                userId: parseInt(event.summary.split(" ### ")[1]),
                calEventId: calEventId,
              };
              await eventService.googleEvent.createEvent(eventToSave);
            }
          }
        }
      }
    }
    next();
  },

  async getNextEventForUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if (userId) {
      const event = await eventService.googleEvent.getUpcomingEventForUser(userId);
      if (event) {
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
        res.json(eventToSend);
      } else {
        res.status(400).json({ error: "No events found" });
      }
    } else {
      res.status(400).json({ error: "No user found" });
    }
  },

  async deleteEventById(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if(userId){
      const id = parseInt(req.params.id);
      const event = await eventService.googleEvent.getEventById(id);
      if(event){
        if(event.userId !== userId){
          return res.status(400).json({ error: "You are not authorized to delete this event" });
        }
      const auth = await authorize();
      const response = await eventService.googleEvent.deleteEvent(id);
      const deleteResponse = await deleteEventCalendar(auth, event.calEventId);
      res.status(200).json({ message: "Event deleted" });
      } else {
        res.status(400).json({ error: "No event found" });
      }
    } else {
      res.status(400).json({ error: "No user found" });
    }
  },

    // * Update event in google calendar and database
    async updateEvent(req: Request, res: Response, next: NextFunction) {
      const data = req.body;
      const userId = req.user?.id;
  
      if (!titleChecker(data.title) && !descriptionChecker(data.description)) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      let googleEvent = await eventService.googleEvent.getEventByCalEventId(
        data.calEventId
      );
  
      if (googleEvent) {
        if(googleEvent.userId !== userId){
          return res.status(400).json({ error: "You are not authorized to edit this event" });
        }

          await eventService.googleEvent.updateEventData(
            googleEvent.id,
            data.title,
            data.description
          );
        let uploadEvent = await eventService.googleEvent.getEventByCalEventId(
          data.calEventId
        );
        if (!uploadEvent) {
          return res.status(400).json({ error: "Event not found" });
        }
        const auth = await authorize();
  
        const response = await updateGoogleEvent(auth, uploadEvent);
        if (response.error === null) {
          res.status(200).json({ message: "Event updated" });
        } else {
          return response.error;
        }
      }
      next();
    },


};
