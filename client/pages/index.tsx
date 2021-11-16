import { useUser } from '@auth0/nextjs-auth0'
import { gql, useQuery } from '@apollo/client';
import type { NextPage } from 'next'

const WalletQuery = gql`
  query {
    allWallets {
      id
      name
      address
    }
    wallet {
      id
      name
      address
      lockedBalance
      unlockedBalance
      transactions {
        blockHeight
        isCoinbaseTransaction
        fee
        paymentId
        unlockTime
        hash
        timestamp
        amount
      }
    }
    info {
      walletHeight
      daemonHeight
      networkHeight
    }
  }
`

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser();
  const { loading, error: gqlError, data } = useQuery(WalletQuery);

  if (isLoading) return <div>One sec...</div>;
  if (loading) return <div>One moment...</div>;
  if (error) return <div>Something went wrong with authentication: {error.message}</div>;
  if (user) {
    if (gqlError) {
      return <div>Something went wrong with query: {gqlError.message}</div>;
    }

    return (
      <div>

        <h1>Account</h1>
        <p>Welcome {user.name}! <a href="/api/auth/logout">Logout</a>.</p>
        <p><b>Raw User Token:</b> <code>{JSON.stringify(user)}</code></p>
        <h1>Wallets</h1>
        {
          data.allWallets.map((wallet: any) => (
            <div key={wallet.id}>
              <h3>{wallet.name}</h3>
              <p>
                <b>Address:</b> {wallet.address}
              </p>
            </div>
          ))
        }
        <h1>Wallet {data.wallet.name}</h1>
        <p>
          <b>Unlocked Balance:</b> {data.wallet.unlockedBalance} CB<br/>
          <b>Locked Balance:</b> {data.wallet.lockedBalance} CB<br/>
        </p>
        <table style={{border: 1}}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Amount</th>
              <th>Payment ID</th>
              <th>Extra</th>
            </tr>
          </thead>
          <tbody>
            {
              data.wallet.transactions.map((tx: any) => (
                <tr key={tx.hash}>
                  <td>{tx.hash}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.paymentId}</td>
                  <td>
                    {tx.isCoinbaseTransaction && "Mining Reward"}<br/>
                    Unlocks at {tx.unlockTime}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <h1>Info</h1>
        <p>
          <b>Wallet / Daemon / Network Height:</b> {data.info.walletHeight} / {data.info.daemonHeight} / {data.info.networkHeight}
        </p>
        <p><b>Raw Query Result:</b> <code>{JSON.stringify(data)}</code></p>
      </div>
    )
  }

  return <a href="/api/auth/login">Login</a>;
}

export default Home
