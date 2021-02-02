import {useApollo} from "../utils/apolloClient";
import {ApolloProvider} from "@apollo/client";

export default function App({Component, pageProps}) {

  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps}/>
    </ApolloProvider>);
}