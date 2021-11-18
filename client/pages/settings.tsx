import { useUser } from "@auth0/nextjs-auth0";
import { Container, Paper, List, ListItem, ListItemText, Divider, ListItemButton, ListItemAvatar, Avatar } from "@mui/material";
import { NextPage } from "next";
import Layout from "../components/layout";
import { gql, useMutation, useQuery } from "@apollo/client";

const InfoQuery = gql`
  query {
    info {
      walletHeight
      daemonHeight
      networkHeight
    }
  }
`;

const CreateWalletMutation = gql`
  mutation($name: String!) {
    createWallet(name: $name) {
      address
    }
  }
`;

const Settings: NextPage = () => {
  const user = useUser();
  const info = useQuery(InfoQuery);
  const [createWallet, walletData] = useMutation(CreateWalletMutation);

  const createWalletHandler = async () => {
    const name = prompt("Please enter a name for the wallet");
    await createWallet({
      variables: {
        name
      }
    });
    location.href = "/";
  }

  return (
    <Layout title="Settings">
      <Container sx={{ marginY: 3 }}>
        <Paper variant="outlined">
          <List sx={{ bgcolor: 'background.paper' }}>
            {user.user
              ? <>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={user.user.picture || undefined} />
                    </ListItemAvatar>
                    <ListItemText primary={`Logged in as ${user.user.name}`}/>
                  </ListItem>
                  <ListItemButton component="a" href="/api/auth/logout">
                    <ListItemText primary="Logout"></ListItemText>
                  </ListItemButton>
                  <ListItemButton onClick={createWalletHandler}>
                    <ListItemText primary="Create a new wallet"></ListItemText>
                  </ListItemButton>
                </>
              : <>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar/>
                    </ListItemAvatar>
                    <ListItemText primary={`Logged out`}/>
                  </ListItem>
                  <ListItemButton component="a" href="/api/auth/login">
                    <ListItemText primary="Login"></ListItemText>
                  </ListItemButton>
                </>}
            <Divider/>
            {info.data
              && <ListItem>
                <ListItemText
                  primary="Blockchain Heights"
                  secondary={`Wallet: ${info.data.info.walletHeight}, Daemon: ${info.data.info.daemonHeight}, Network: ${info.data.info.networkHeight}`}/>
                </ListItem>
              }
          </List>
        </Paper>
      </Container>
    </Layout>
  )
}

export default Settings;
