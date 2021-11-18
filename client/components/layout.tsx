import React, { FunctionComponent } from 'react';
import Head from 'next/head';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import { CallMade, CallReceived, List, Settings } from '@mui/icons-material';
import { NextLinkComposed } from './link';
import { useRouter } from 'next/router';

type LayoutProps = {
  title: string
}

const Layout: FunctionComponent<LayoutProps> = ({ title, children }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title} | CashBite Web Wallet</title>
      </Head>
      <Box sx={{ pb: 7 }}>
        <Box component="main">
          {children}
        </Box>
        <Paper component="nav" sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation showLabels value={router.pathname}>
            <BottomNavigationAction component={NextLinkComposed} to={{ pathname: "/" }} value="/" label="Overview" icon={<List/>} />
            <BottomNavigationAction component={NextLinkComposed} to={{ pathname: "/receive" }} value="/receive" label="Receive" icon={<CallReceived/>} />
            <BottomNavigationAction component={NextLinkComposed} to={{ pathname: "/send" }} value="/send" label="Send" icon={<CallMade/>} />
            <BottomNavigationAction component={NextLinkComposed} to={{ pathname: "/settings" }} value="/settings" label="Settings" icon={<Settings/>} />
          </BottomNavigation>
        </Paper>
      </Box>
    </>
  );
};

export default Layout;
