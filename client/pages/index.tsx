import { useUser } from '@auth0/nextjs-auth0'
import { gql, useMutation, useQuery } from '@apollo/client';
import type { NextPage } from 'next'
import Layout from '../components/layout';
import { Avatar, Box, Container, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography, Paper, Skeleton } from '@mui/material';
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
  const loading = query.loading || query.error || !query.data.wallet;

  let content;

  if (query.error) {
    content = <>
      <p>Something went wrong: {query.error.toString()}</p>
      <p>Got a 401 error? Please go to the settings tab to login.</p>
    </>;
  } else {
    content = <>
      <Box sx={{ backgroundColor: '#9013fe', color: 'white', margin: 0, paddingY: 10, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h2">
            {loading
              ? <Skeleton width={200} sx={{ marginX: 'auto' }} />
              : `${query.data.wallet.unlockedBalance} CB`
            }
          </Typography>
          <Typography variant="overline">Available Balance</Typography>
        </Container>
      </Box>
      <Container sx={{ marginY: 3 }}>
        <Paper variant="outlined">
          <List sx={{ bgcolor: 'background.paper', overflowX: 'clip' }}>
            {loading
              ? [...Array(10)].map((i) => (
                  <ListItem key={i}>
                    <ListItemAvatar>
                      <Skeleton variant="circular" width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText primary={<Skeleton width={150}/>} secondary={<Skeleton width={250}/>}/>
                  </ListItem>
                ))
              : (query.data.wallet.transactions.length > 0
                  ? query.data.wallet.transactions.map((tx: any) => (
                      <Transaction key={tx.hash} transaction={tx}/>
                    ))
                  : <Typography variant="caption" sx={{ paddingLeft: 3 }}>No transactions yet</Typography>
              )
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
