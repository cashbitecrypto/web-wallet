import { NextPage } from "next";
import Layout from "../components/layout";
import { gql, useQuery } from "@apollo/client";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import Image, { ImageLoaderProps } from 'next/image';

const WalletQuery = gql`
  query {
    wallet {
      address
    }
  }
`;

const qrLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `https://api.qrserver.com/v1/create-qr-code?data=${src}&size=${width}x${width}`;
}

const Receive: NextPage = () => {
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
          <Image alt="Wallet Address" src={query.data.wallet.address} width={250} height={250} loader={qrLoader}/>
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
