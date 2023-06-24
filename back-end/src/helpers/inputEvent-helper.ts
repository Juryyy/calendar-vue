import { Request, Response } from "express";
import eventService from "../services/event-service";
import { inputEvent, googleEvent } from "@prisma/client";
import { createEvent, authorize, fetchEvents } from "../google/google";

export default {
  async createEvent(req: Request, res: Response) {
    const event = req.body as inputEvent;
    if (
      !event.title ||
      !event.description ||
      !event.start ||
      !event.end ||
      event.userId ||
      event.title === "" ||
      event.description === "" ||
      event.userId < 0
    ) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const createdEvent = await eventService.inputEvent.createEvent(event);
    return res.status(201).json(createdEvent);
  },

  async uploadUnsentEvents() {
    const auth = await authorize();
    const events = await eventService.inputEvent.getEventsWithUploadedFalse();
    for (let event of events) {
      const googleEvent = {
        summary: event.title + " ### " + event.userId,
        description: event.description,
        start: {
          dateTime: event.start,
          timeZone: "Europe/Prague",
        },
        end: {
          dateTime: event.end,
          timeZone: "Europe/Prague",
        },
      };
      const response = await createEvent(auth, googleEvent);
      if (response.error !== null) {
        event.uploaded = true;
        await eventService.inputEvent.updateEvent(event.id, event);
      } else {
        return response.error;
      }
    }
  },

  async fetchEventsFromG() {
    const auth = await authorize();
    const response = await fetchEvents(auth);
    if (response.error !== null) {
      return response.error;
    } else {
    if(response.events){
        for (let event of response.events) {
            if(event.summary && event.description && event.start && event.end && event.id && event.start.dateTime && event.end.dateTime){

        const eventToSave : Omit<googleEvent, "id"> = {
          title: event.summary.split(" ### ")[0],
          description: event.description,
          start: new Date(event.start.dateTime),
          end: new Date(event.end.dateTime),
          userId: parseInt(event.summary.split(" ### ")[1]),
          calEventId : parseInt(event.id)
        };
        await eventService.googleEvent.createEvent(eventToSave);
      }
    }
    }
    }
  },
};
