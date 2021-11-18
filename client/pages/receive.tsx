import { NextPage } from "next";
import Layout from "../components/layout";
import { gql, useQuery } from "@apollo/client";
import { Box, Container, Grid, Paper, Typography, useMediaQuery } from "@mui/material";
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
    content = <Container sx={{ marginY: 3 }}>
      <Paper variant="outlined" sx={{ textAlign: 'center', padding: 3 }}>
        <Box sx={{ margin: 3}}>
          <QRCode value={`cashbite:${query.data.wallet.address}`} bgColor={qrBgColor} fgColor={qrFgColor} />
        </Box>
        <Typography>Send coins to:</Typography>
        <Typography sx={{ overflowX: 'auto' }}>{query.data.wallet.address}</Typography>
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
