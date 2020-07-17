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
        Membership(userId: ID!, teamId: ID!): Member
        Team(userId: ID!, teamId: ID!): Team
        Teams(userId: ID!): [Team]
    }

    type Mutation {
        AddTeamMember(teamId: ID!, role: String!, newMemberEmail: String!): Member
        CreateTeam(userId: ID!, name: String!, plan: String!): Team
        EditUser(userId: ID!, userName: String, email: String, firstName: String, lastName: String): User
        EditTeamMemberRole(teamId: ID!, memberId: ID!, role: String!): Member
        RemoveTeamMember(teamId: ID!, memberId: ID!): Team
        UpdatePassword(userId: ID!, currentPassword: String!, newPassword: String!): Boolean
    }
`;

const resolvers = {
    Query: {
        Membership: (obj, args) => {
            return {
                _id: args.userId,
                role: 'OWNER',
                userName: 'Fakey',
                email: 'Fakey@fake.com',
            };
        },
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
        AddTeamMember: (obj, args) => {
            return {
                _id: 'newb2',
                userName: 'Newbie',
                email: args.newMemberEmail,
                role: args.role,
            };
        },
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
        EditTeamMemberRole: (obj, args) => {
            return {
                _id: `${Math.round(Math.random() * Math.pow(10, 6))}`,
                userName: 'Fakey',
                email: 'Fakey@fake.com',
                role: args.role,
            };
        },
        RemoveTeamMember: (obj, args) => {
            return {
                _id: `${Math.round(Math.random() * Math.pow(10, 6))}`,
                name: 'FakeTeam6',
                plan: 'BASIC',
                members: [{
                    _id: `${Math.round(Math.random() * Math.pow(10, 6))}`,
                    userName: 'Fakey',
                    email: 'Fakey@fake.com',
                    role: 'OWNER'
                }]
            };
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