import { NextPage } from "next";
import Layout from "../components/layout";
import { gql, useQuery } from "@apollo/client";
import { Box, Container, Grid, Paper, Typography, useMediaQuery, Skeleton } from "@mui/material";
import QRCode from 'react-qr-code';

const WalletQuery = gql`
  query {
    wallet {
      address
    }
  }
`;

const Receive: NextPage = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const qrBgColor = prefersDarkMode ? '#000000' : '#ffffff';
  const qrFgColor = prefersDarkMode ? '#ffffff' : '#000000';
  const query = useQuery(WalletQuery);

  const loading = query.loading || query.error || !query.data.wallet;

  let content;

  if (query.error) {
    content = <>
      <p>Something went wrong: {query.error.toString()}</p>
      <p>Got a 401 error? Please go to the settings tab to login.</p>
    </>;
  } else {
    content = <Container sx={{ marginY: 3 }}>
      <Paper variant="outlined" sx={{ textAlign: 'center', padding: 3 }}>
        <Box sx={{ margin: 3}}>
          {loading
            ? <Skeleton variant="rectangular" width={256} height={256} sx={{ marginX: 'auto' }} />
            : <QRCode value={`cashbite:${query.data.wallet.address}`} bgColor={qrBgColor} fgColor={qrFgColor} />
          }
        </Box>
        <Typography>Send coins to:</Typography>
        {loading
          ? <Typography><Skeleton/></Typography>
          : <Typography sx={{ overflowX: 'auto' }}>{query.data.wallet.address}</Typography>
        }
      </Paper>
    </Container>;
  }

  return (
    <Layout title="Receive">
      {content}
    </Layout>
  )
}

export default Receive;
