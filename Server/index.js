import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import crypto from 'crypto';

// HMAC function
function hmac_rawurlsafe_base64_string(distinct_id, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(distinct_id)
    .digest('base64url')
    .replace(/=+$/, '');
}

const INBOX_SECRET = "W_F0I04NaLzhJEaEhuzRO3y7YCwJaLSbCXi973DHHe0";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

// Define GraphQL schema
const typeDefs = `
  type Student {
    studentName: String!
    studentUsername: String!
    all: Int!
    easy: Int!
    medium: Int!
    hard: Int!
  }

  type Query {
    getStudents(usernames: [String!]!): [Student!]!
  }
`;

// Define GraphQL resolvers
const resolvers = {
  Query: {
    getStudents: async (_, { usernames }) => {
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              realName
            }
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `;

      try {
        const requests = usernames.map((username) =>
          axios.post(
            "https://leetcode.com/graphql",
            {
              query,
              variables: { username },
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          )
        );

        const responses = await Promise.all(requests);

        return responses
          .map((response) => {
            const userData = response.data.data.matchedUser;
            if (!userData) return null;

            const submissionData = userData.submitStats.acSubmissionNum;
            const solvedCounts = submissionData.reduce(
              (obj, { difficulty, count }) => {
                obj[difficulty.toLowerCase()] = count;
                return obj;
              },
              { all: 0, easy: 0, medium: 0, hard: 0 }
            );

            return {
              studentName: userData.profile.realName,
              studentUsername: userData.username,
              ...solvedCounts,
            };
          })
          .filter((student) => student !== null);
      } catch (error) {
        console.error("Error fetching student data:", error);
        return [];
      }
    },
  },
};

// Initialize Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Start server properly for Render
async function startApolloServer() {
  try {
    await server.start();
    app.use('/graphql', expressMiddleware(server));

    // ✅ Health check route for Render
    app.get('/', (req, res) => {
      res.send('✅ Server running fine on Render');
    });

    // ✅ Subscriber ID endpoint
    app.get('/generate-subscriber-id', (req, res) => {
      const distinct_id = req.query.distinct_id;
      if (!distinct_id) {
        return res.status(400).send('distinct_id is required');
      }
      const subscriber_id = hmac_rawurlsafe_base64_string(distinct_id, INBOX_SECRET);
      res.json({ subscriber_id });
    });

    // ✅ IMPORTANT: Listen on 0.0.0.0 for Render
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Server failed to start:", error);
  }
}

// Start Apollo + Express app
startApolloServer();
