import {NextFunction, Request, Response } from "express";
import eventService from "../services/event-service";
import { inputEvent, googleEvent } from "@prisma/client";
import { createEvent, authorize, fetchEvents, listEvents} from "../google/google";

export default {
  async getEvents(req: Request, res: Response, next: NextFunction) {
    console.log("getEvents")
    const events = await eventService.googleEvent.getEvents();
    console.log("Events: ", events)
    res.json(events);
  },

  async test(req: Request, res: Response, next: NextFunction) {
    const auth = await authorize();
    const response = await listEvents(auth);
    res.json(response);
  }
};
