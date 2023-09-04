import { NextFunction, Request, Response } from "express";
import eventService from "../services/event-service";
import { inputEvent, googleEvent } from "@prisma/client";
import {
  createGoogleEvent,
  authorize,
  fetchEvents,
  updateGoogleEvent,
} from "../google/google";
import {
  eventInputChecker,
  titleChecker,
  descriptionChecker,
} from "../helpers/inputChecker";

export default {
  async createInputEvent(req: Request, res: Response, next: NextFunction) {
    const data = req.body;

    const [startHours, startMinutes] = formatTime(data.startTime);
    const start = new Date(formatDate(data.startDate));
    start.setHours(startHours + 2);
    start.setMinutes(startMinutes);

    const [endHours, endMinutes] = formatTime(data.endTime);
    const end = new Date(formatDate(data.endDate));
    end.setHours(endHours + 2);
    end.setMinutes(endMinutes);

    const event = {} as inputEvent;
    event.title = data.title;
    event.description = data.description;
    event.userId = data.userId;
    event.start = new Date(start);
    event.end = new Date(end);

    if (eventInputChecker(event) === false) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const timeCheck = await eventService.inputEvent.checkAvailability(event);
    if (!timeCheck) {
      return res.status(400).json({ error: "Time is taken" });
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
      const response = await createGoogleEvent(auth, googleEvent);
      if (response.error === null) {
        event.uploaded = true;
        await eventService.inputEvent.updateEvent(event.id, event);
      } else {
        return response.error;
      }
    }
    next();
  },

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    const data = req.body;

    if (!titleChecker(data.title) && !descriptionChecker(data.description)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let googleEvent = await eventService.googleEvent.getEventByCalEventId(
      data.calEventId
    );

    if (googleEvent) {
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

const formatDate = (date: any) => {
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
};

const formatTime = (time: any) => {
  const [hours, minutes] = time.split(":");
  return [parseInt(hours), parseInt(minutes)];
};
