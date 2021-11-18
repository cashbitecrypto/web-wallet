import { useUser } from '@auth0/nextjs-auth0'
import { gql, useMutation, useQuery } from '@apollo/client';
import type { NextPage } from 'next'
import Layout from '../components/layout';
import { Avatar, Box, Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography, Paper } from '@mui/material';
import { CallMade, CallReceived, CheckCircle, OpenInNew, TrackChanges } from '@mui/icons-material';
import { green, orange, red } from '@mui/material/colors';
import Transaction from '../components/transaction';

const WalletQuery = gql`
  query {
    wallet {
      name
      lockedBalance
      unlockedBalance
      transactions {
        fee
        paymentId
        unlockTime
        hash
        timestamp
        amount
        isCoinbaseTransaction
      }
    }
  }
`;

const Home: NextPage = () => {
  const query = useQuery(WalletQuery);

  let content;

  if (query.loading) {
    content = <p>Loading...</p>;
  } else if (query.error) {
    content = <>
      <p>Something went wrong: {query.error.toString()}</p>
      <p>Got a 401 error? Please go to the settings tab to login.</p>
    </>;
  } else if (!query.data.wallet) {
    content = <p>You have no wallet. Please go to the settings page to make one.</p>;
  } else {
    content = <>
      <Box sx={{ backgroundColor: '#9013fe', color: 'white', margin: 0, paddingY: 10, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h2">{query.data.wallet.unlockedBalance} CB</Typography>
          <Typography variant="overline">Available Balance</Typography>
        </Container>
      </Box>
      <Container sx={{ marginY: 3 }}>
        <Paper variant="outlined">
          <List sx={{ bgcolor: 'background.paper', overflowX: 'clip' }}>
            {
              query.data.wallet.transactions.length > 0
                ? query.data.wallet.transactions.map((tx: any) => (
                    <Transaction key={tx.hash} transaction={tx}/>
                  ))
                : <Typography variant="caption" sx={{ paddingLeft: 3 }}>No transactions yet</Typography>
            }
          </List>
        </Paper>
      </Container>
    </>;
  }

  return (
    <Layout title="Overview">
      {content}
    </Layout>
  )
}

export default Home
