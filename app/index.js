import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(bodyParser.json());

const typeDefs = gql`
    type User {
        _id: String!
        userName: String!
        email: String!
        firstName: String!
        lastName: String!
    }

    type Member {
        _id: ID!
        userName: String!
        email: String!
        role: String!
    }

    type Team {
        _id: ID!
        name: String!
        plan: String!
        members: [Member]
    }

    type Query {
        Team(userId: ID!, teamId: ID!): Team
        Teams(userId: ID!): [Team]
    }

    type Mutation {
        CreateTeam(userId: ID!, name: String!, plan: String!): Team
        EditUser(userId: ID!, userName: String, email: String, firstName: String, lastName: String): User
        UpdatePassword(userId: ID!, currentPassword: String!, newPassword: String!): Boolean
    }
`;

const resolvers = {
    Query: {
        Team: (obj, args) => {
            return {
                _id: `${Math.round(Math.random()* Math.pow(10,6))}`,
                name: 'FakeTeam6',
                plan: 'BASIC',
                members: [{
                    _id: args.userId,
                    userName: 'Fakey',
                    email: 'Fakey@fake.com',
                    role: 'OWNER'
                }]
            };
        },
        Teams: (obj, args) => {
            return [
                {
                    _id: `${Math.round(Math.random()* Math.pow(10,6))}`,
                    name: 'FakeTeam1',
                    plan: 'BASIC',
                    members: [{
                        _id: args.userId,
                        userName: 'Fakey',
                        email: 'Fakey@fake.com',
                        role: 'OWNER'
                    }],
                },
                {
                    _id: `${Math.round(Math.random()* Math.pow(10,6))}`,
                    name: 'FakeTeam2',
                    plan: 'PRO',
                    members: [{
                        _id: args.userId,
                        userName: 'Fakey',
                        email: 'Fakey@fake.com',
                        role: 'OWNER'
                    }],
                }
            ]
        }
    },
    Mutation: {
        CreateTeam: (obj, args, context, info) => {
            return {
                _id: `${Math.round(Math.random()* Math.pow(10,6))}`,
                name: args.name,
                plan: args.plan,
                members: [{
                    _id: args.userId,
                    userName: 'Fakey',
                    email: 'Fakey@fake.com',
                    role: 'OWNER'
                }]
            };
        },
        EditUser: (obj, args) => {
            return {
                _id: args.userId,
                userName: args.userName || 'Faker',
                email: args.email || 'Faker@fake.com',
                firstName: args.firstName || 'Fakey',
                lastName: args.lastName || 'Fake',
            }
        },
        UpdatePassword: (obj, args) => {
            return true;
        }
    },
};

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

apolloServer.applyMiddleware({ app, path: '/graphql', cors: true, bodyParserConfig: false });

app.listen(8000, () => {
    console.log('Server running on port 8000');
});