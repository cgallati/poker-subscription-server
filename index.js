import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import {ApolloServerPluginDrainHttpServer} from "apollo-server-core";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from "express";
import {schema} from "./gql/schema.js";
import {incrementNumber} from "./tick-tock.js";

// instantiate http server
const app = express()
const httpServer = createServer(app);

// instantiate websocket server
const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: '/',
});

// instantiate Apollo Server
const serverCleanup = useServer({ schema }, wsServer);
const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        }
    ],
});

// start Apollo Server with http server middleware
await server.start();
server.applyMiddleware({
    app,
    // this is the default, but note that it's *not* /graphql
    path: '/'
});


// tell the http server to start listening
await new Promise(resolve => httpServer.listen(4000, resolve));
console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);

// incrementNumber();