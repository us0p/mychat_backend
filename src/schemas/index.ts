import { gql } from "apollo-server-express";

const typeDefs = gql`
    scalar Date

    type User {
        imageUrl: String
        username: String
        id: String
    }

    type ChatRoom {
        roomName: String
        id: String
    }

    type CompleteChatRoom {
        roomName: String
        id: String
        user: User
    }

    type Info {
        count: Int
        pages: Int
        next: String
        prev: String
    }

    type SharedFields {
        name: String
        url: String
    }

    type Results {
        id: Int
        name: String
        status: String
        species: String
        type: String
        gender: String
        origin: SharedFields
        location: SharedFields
        image: String
        episode: [String]
        url: String
        created: Date
    }

    type Message {
        id: String
        roomId: String
        author: String
        authorImage: String
        message: String
    }

    type FilteredMessage {
        author: String
        authorImage: String
        message: String
    }

    type PaginatedRMApiResult {
        info: Info
        results: [Results]
    }

    type Query {
        start: String
        getPaginatedCharactersData(page: Int!): PaginatedRMApiResult
        checkUserData(id: String!): User
        getChatRooms: [CompleteChatRoom]
        getAllChatMessages(roomId: String!): [Message]
    }

    type Mutation {
        registerUser(imageUrl: String!, username: String!): User
        updateUserImage(imageUrl: String!, username: String!): User
        registerChatRoom(userId: String!, roomName: String!): ChatRoom
        deleteChatRoom(roomId: String!): String
        postMessage(
            authorImage: String!
            author: String!
            roomId: String!
            message: String!
        ): Message
    }

    type Subscription {
        allChatRooms: [CompleteChatRoom]
        newMessage: FilteredMessage
    }
`;

export default typeDefs;
