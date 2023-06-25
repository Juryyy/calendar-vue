import { NextFunction, Request, Response } from "express";
import eventService from "../services/event-service";
import { inputEvent, googleEvent } from "@prisma/client";
import { createEvent, authorize, fetchEvents } from "../google/google";

export default {
  async createInputEvent(req: Request, res: Response, next: NextFunction) {
    const event = req.body as inputEvent;
    event.start = new Date(event.start);
    event.end = new Date(event.end);
    if (
      !event.title ||
      !event.description ||
      !event.start ||
      !event.end ||
      event.title === "" ||
      event.description === ""
    ) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const createdEvent = await eventService.inputEvent.createEvent(event);
    res.json(createdEvent);
    next();
  },

  async uploadUnsentEvents(req: Request, res: Response, next: NextFunction) {
    const auth = await authorize();
    const events = await eventService.inputEvent.getEventsWithUploadedFalse();
    for (let event of events) {
      //Edit time to match google calendar
      const adjustedStart = new Date(event.start);
      adjustedStart.setHours(adjustedStart.getHours() - 2);

      const adjustedEnd = new Date(event.end);
      adjustedEnd.setHours(adjustedEnd.getHours() - 2);

      //Create event
      const googleEvent = {
        summary: event.title + " ### " + event.userId,
        description: event.description,
        start: {
          dateTime: adjustedStart.toISOString(),
          timeZone: "Europe/Prague",
        },
        end: {
          dateTime: adjustedEnd.toISOString(),
          timeZone: "Europe/Prague",
        },
      };
      const response = await createEvent(auth, googleEvent);
      if (response.error === null) {
        event.uploaded = true;
        await eventService.inputEvent.updateEvent(event.id, event);
      } else {
        return response.error;
      }
    }
    next();
  },

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

  
};
