import {PrismaClient, googleEvent} from '@prisma/client';

const prisma = new PrismaClient();

export default {
    async createEvent(event : Omit<googleEvent, "id">){
        return await prisma.googleEvent.create({
            data: event
        });
    },

    async deleteEvent(id : number){
        return await prisma.googleEvent.delete({
            where: {
                id: id
            }
        });
    },

    async getEventById(id : number){
        return await prisma.googleEvent.findUnique({
            where: {
                id: id
            }
        });
    },

    async getEvents(){  
        return await prisma.googleEvent.findMany();
    },
    
    async getEventsForMonth(month: number) {

      const startDate = new Date(new Date().getFullYear(), month -1, 1);
      const endDate = new Date(new Date().getFullYear(), month, 0);

      console.log(startDate.toLocaleDateString('en-US'), endDate.toLocaleDateString('en-US'));
      
      const events = await prisma.googleEvent.findMany({
        where: {
          start: {
            gte: startDate,
            lt: endDate,
          },
        },
      });
        return events;
      },

      async getEventByCalEventId(calEventId: string) {
        return await prisma.googleEvent.findUnique({
          where: {
            calEventId: calEventId,
          },
        });
      },

      async updateEventData(id: number, title: string, description: string) {
        return await prisma.googleEvent.update({
          where: {
            id: id,
          },
          data: {
            title: title,
            description: description,
          },
        });
      },

      async getEventsByUserId(userId: number) {
        return await prisma.googleEvent.findMany({
          where: {
            userId: userId,
          },
        });
      },


      async getUpcomingEventForUser(userId: number) {
        return await prisma.googleEvent.findFirst({
          where: {
            userId: userId,
            start: {
              gte: new Date(),
            },
          },
          orderBy: {
            start: 'asc',
          },
        });
      },

      

}