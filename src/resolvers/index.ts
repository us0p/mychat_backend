import { GraphQLScalarType, Kind } from "graphql";
import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

const dateScalar = new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    serialize(value: any) {
        return value;
    },
    parseValue(value: any) {
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10));
        }
        return null;
    },
});

const resolvers = {
    Date: dateScalar,
    Query: {
        start: () => "olá mundo",
        getPaginatedCharactersData: async (
            _: any,
            page: any,
            { dataSources }: any
        ) => {
            const data =
                await dataSources.rickAndMortyAPI.getPaginatedCharactersData(
                    page.page
                );
            return data;
        },
        checkUserData: async (_: any, id: any, { dataSources }: any) => {
            const data = await dataSources.userController.getUser(id.id);
            return data;
        },
        getChatRooms: async (_: any, __: any, { dataSources }: any) => {
            const allChatRooms =
                await dataSources.chatRoomController.getAllRooms();

            return allChatRooms;
        },
        getAllChatMessages: async (
            _: any,
            messageObject: any,
            { dataSources }: any
        ) => {
            const data = await dataSources.messageController.getAllChatMessages(
                messageObject.roomId
            );

            return data;
        },
    },
    Mutation: {
        registerUser: async (_: any, userObject: any, { dataSources }: any) => {
            const data = await dataSources.userController.registerUser(
                userObject
            );
            return data;
        },
        updateUserImage: async (
            _: any,
            userObject: any,
            { dataSources }: any
        ) => {
            const data = await dataSources.userController.updateUserImage(
                userObject.username,
                userObject.imageUrl
            );
            return data;
        },
        registerChatRoom: async (
            _: any,
            chatObject: any,
            { dataSources }: any
        ) => {
            const data = await dataSources.chatRoomController.registerChatRoom(
                chatObject.userId,
                chatObject.roomName
            );

            const allChatRooms =
                await dataSources.chatRoomController.getAllRooms();

            pubSub.publish("CHAT_ROOM_CREATED", { allChatRooms });

            return data;
        },
        deleteChatRoom: async (
            _: any,
            roomIdObject: any,
            { dataSources }: any
        ) => {
            const data = await dataSources.chatRoomController.deleteChatRoom(
                roomIdObject.roomId
            );

            const allChatRooms =
                await dataSources.chatRoomController.getAllRooms();

            pubSub.publish("CHAT_ROOM_CREATED", { allChatRooms });

            return data;
        },
        postMessage: async (
            _: any,
            messageObject: any,
            { dataSources }: any
        ) => {
            pubSub.publish("NEW_MESSAGE", {
                newMessage: {
                    message: messageObject.message,
                    author: messageObject.author,
                    authorImage: messageObject.authorImage,
                },
            });

            const data = await dataSources.messageController.postMessage(
                messageObject
            );

            return data;
        },
    },
    Subscription: {
        allChatRooms: {
            subscribe: () => pubSub.asyncIterator(["CHAT_ROOM_CREATED"]),
        },
        newMessage: {
            subscribe: () => pubSub.asyncIterator(["NEW_MESSAGE"]),
        },
    },
};

export default resolvers;
