import {NextFunction, Request, Response } from "express";
import eventService from "../services/event-service";
import { inputEvent, googleEvent } from "@prisma/client";
import { createEvent, authorize, fetchEvents} from "../google/google";

export default {
  async getEvents(req: Request, res: Response, next: NextFunction) {
    const events = await eventService.googleEvent.getEvents();
    res.json(events);
  },

};
