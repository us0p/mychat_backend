import { DataSource } from "apollo-datasource";
import { Message } from "../entity";
import { getConnection, getRepository } from "typeorm";

export class MessageController extends DataSource {
    async getAllChatMessages(roomId: any) {
        try {
            const allMessages = await getConnection()
                .getRepository(Message)
                .find({ roomId });

            return allMessages;
        } catch (error) {
            throw new Error("Internal server error");
        }
    }

    async postMessage(messageObject: any) {
        try {
            const message = new Message();
            message.author = messageObject.author;
            message.authorImage = messageObject.authorImage;
            message.message = messageObject.message;
            message.roomId = messageObject.roomId;

            const postedMessage = await getConnection().manager.save(message);

            return postedMessage;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
