import { CallReceived, CheckCircle, OpenInNew } from "@mui/icons-material";
import { IconButton, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { green, orange } from "@mui/material/colors";

type TransactionProps = {
  transaction: {
    fee: number,
    paymentId: string | null,
    unlockTime: number,
    hash: string,
    timestamp: any,
    amount: number,
    isCoinbaseTransaction: boolean
  }
}

const Transaction = ({ transaction }: TransactionProps) => {
  let color;
  let icon;
  let time;
  let amount;
  let text;

  if (transaction.isCoinbaseTransaction) {
    color = orange[500];
    icon = <CheckCircle/>;
    text = "Mining Reward";
  } else {
    color = green[500];
    icon = <CallReceived/>;
    if (transaction.paymentId != null) {
      text = `Payment ID: ${transaction.paymentId}`;
    } else {
      text = "Received";
    }
  }

  time = (new Date(transaction.timestamp * 1000)).toLocaleString();
  amount = `${transaction.amount} CB`;

  if (transaction.fee > 0) {
    amount += ` (${transaction.fee} CB fee)`;
  }

  return (
    <ListItem secondaryAction={
      <IconButton edge="end" href={`https://explorer.cashbite.org/transaction.html?hash=${transaction.hash}`} target="_blank">
        <OpenInNew/>
      </IconButton>
    }>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: color }}>
          {icon}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={amount} secondary={`${time} - ${text}`}/>
    </ListItem>
  );
}

export default Transaction;
