import { ChatRoom, User } from "../entity/";
import { DataSource } from "apollo-datasource";
import { getConnection, getRepository } from "typeorm";
import { UserInputError } from "apollo-server-core";

export class ChatRoomController extends DataSource {
    async registerChatRoom(userId: any, roomName: string) {
        try {
            const connection = getConnection();

            const user = await connection
                .getRepository(User)
                .findOne({ id: userId }, { relations: ["chatRoom"] });

            if (!user) {
                throw new Error("Usuário não encontrado");
            }

            if (user.chatRoom) {
                throw new Error("Usuário já possui uma sala");
            }

            const newChatRoom = new ChatRoom();

            newChatRoom.roomName = roomName;

            const chatRoom = await connection.manager.save(newChatRoom);

            user.chatRoom = newChatRoom;

            await connection.manager.save(user);

            return chatRoom;
        } catch (error: any) {
            throw new UserInputError(error.message);
        }
    }

    async getAllRooms() {
        try {
            return await getConnection().manager.find(ChatRoom, {
                relations: ["user"],
            });
        } catch (error) {
            console.log(error);
            throw new Error("Erro interno");
        }
    }

    async deleteChatRoom(roomId: any) {
        try {
            const chatConnection = getConnection().getRepository(ChatRoom);

            const room = await chatConnection.findOne(
                { id: roomId },
                { relations: ["user"] }
            );

            if (!room) {
                throw new Error("Room not found");
            }

            await chatConnection.remove(room);

            return "ChatRoom Deleted";
        } catch (error: any) {
            throw new UserInputError(error.message);
        }
    }
}
