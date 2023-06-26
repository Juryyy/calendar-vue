import {PrismaClient, inputEvent} from '@prisma/client';

const prisma = new PrismaClient();

export default {
    async createEvent(event : inputEvent){
        return await prisma.inputEvent.create({
            data: {
                title: event.title,
                description: event.description,
                start: event.start,
                end: event.end,
                uploaded: false,
                user: {
                    connect: {
                        id: event.userId
                    }
                }
            }
        });
    },

    async deleteEvent(id : number){
        return await prisma.inputEvent.delete({
            where: {
                id: id
            }
        });
    },

    async getEventsWithUploadedFalse(){
        return await prisma.inputEvent.findMany({
            where: {
                uploaded: false
            }
        });
    },

    async updateEvent(id: number, event: inputEvent){
        return await prisma.inputEvent.update({
            where: {
                id: id
            },
            data: event
        });
    },
    
    async checkAvailability(event: inputEvent) {
        const events = await prisma.inputEvent.findMany({
            where: {
                OR: [
                    {
                        start: {
                            gte: event.start,
                            lt: event.end
                        }
                    },
                    {
                        end: {
                            gt: event.start,
                            lte: event.end
                        }
                    }
                ]
            }
        });
        const gEvents = await prisma.googleEvent.findMany({
            where: {
                OR: [
                    {
                        start: {
                            gte: event.start,
                            lt: event.end
                        }
                    },
                    {
                        end: {
                            gt: event.start,
                            lte: event.end
                        }
                    }
                ]
            }
        });
        if (events.length > 0 || gEvents.length > 0) {
            return false;
        }
        return true;
    },

}