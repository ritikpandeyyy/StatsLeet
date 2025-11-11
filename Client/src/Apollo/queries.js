import { gql } from "@apollo/client";

export const query = gql`
  query GetStudents($usernames: [String!]!) {
    getStudents(usernames: $usernames) {
      studentName
      studentUsername
      all
      easy
      medium
      hard
    }
  }
`;
