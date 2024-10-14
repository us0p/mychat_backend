import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";
import typeDefs from "./schemas";
import resolvers from "./resolvers";
import { createConnection, Connection } from "typeorm";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

import {
    UserController,
    RickAndMortyAPI,
    ChatRoomController,
    MessageController,
} from "./dataSources";

(async function () {
    try {
        const app = express();
        const httpServer = http.createServer(app);

        const schema = makeExecutableSchema({ typeDefs, resolvers });

        const subscriptionServer = SubscriptionServer.create(
            {
                schema,
                execute,
                subscribe,
            },
            {
                server: httpServer,
            }
        );

        console.log(subscriptionServer.server);

        const server = new ApolloServer({
            schema,
            plugins: [
                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                subscriptionServer.close();
                            },
                        };
                    },
                },
            ],
            dataSources: () => {
                return {
                    userController: new UserController(),
                    rickAndMortyAPI: new RickAndMortyAPI(),
                    chatRoomController: new ChatRoomController(),
                    messageController: new MessageController(),
                };
            },
        });

        await server.start();
        server.applyMiddleware({
            app,
            path: "/",
        });

        httpServer.listen({ port: 4000 });

        console.log(
            `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
        );
        await createConnection();
        console.log("db connected!");
    } catch (error) {
        console.log("error: ", error);
    }
})();
