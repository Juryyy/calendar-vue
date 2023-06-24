import {PrismaClient, inputEvent} from '@prisma/client';

const prisma = new PrismaClient();

export default {
    async createEvent(event : inputEvent){
        return await prisma.inputEvent.create({
            data: event
        });
    },

    async deleteEvent(id : number){
        return await prisma.inputEvent.delete({
            where: {
                id: id
            }
        });
    },

    

}