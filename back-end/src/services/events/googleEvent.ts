import {PrismaClient, googleEvent} from '@prisma/client';

const prisma = new PrismaClient();

export default {
    async createEvent(event : googleEvent){
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

}