
import { ApolloClient, InMemoryCache} from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://leetstats.onrender.com/graphql', // Your GraphQL server URL
  cache: new InMemoryCache(),
});

export default client;
