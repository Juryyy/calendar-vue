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

}