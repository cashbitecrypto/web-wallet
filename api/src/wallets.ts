import { Daemon, WalletBackend } from "turtlecoin-wallet-backend";
import { promises as fs, existsSync } from 'fs';
import { IConfig } from "turtlecoin-wallet-backend/dist/lib/Config";

const options : IConfig = {
  addressPrefix: 28116,
  scanCoinbaseTransactions: true
}

class WalletController {
  private daemon: Daemon;
  private wallet: WalletBackend | null = null;
  addressPrefix: number;
  filePath: string;

  constructor(
    host: string = "node1.cashbite.org",
    port: number = 443,
    addressPrefix: number = 28116,
    filePath: string = "./wallet.wal"
  ) {
    this.addressPrefix = addressPrefix;
    this.filePath = filePath;

    this.daemon = new Daemon(host, port);
    this.load().then((wallet) => {
      this.wallet = wallet;
      return this.wallet.start();
    }).then(() => {
      console.log("🔄 Started wallet sync");
    }).catch((err) => {
      console.log("Something has gone wrong!", err);
    });
  }

  async save() {
    if (this.wallet === null) return;
    // const data = this.wallet.toJSONString();
    // await fs.writeFile(this.filePath, data, 'utf-8');
    const saved = this.wallet.saveWalletToFile(this.filePath, "keyboardcat");
    if (!saved) {
      console.warn("Failed to save wallet!");
    }
  }

  private async load() {
    if (!existsSync(this.filePath)) {
      return WalletBackend.createWallet(this.daemon, options);
    }

    // const data = await fs.readFile(this.filePath);
    // const [wallet, error] = await WalletBackend.loadWalletFromJSON(this.daemon, data.toString("utf-8"), options);
    const [wallet, error] = await WalletBackend.openWalletFromFile(this.daemon, this.filePath, "keyboardcat", options);
    if (error) {
      throw error;
    }

    if (wallet === undefined) {
      return WalletBackend.createWallet(this.daemon, options);
    }

    return wallet;
  }

  async getWallet() {
    if (this.wallet === null) {
      const wallet = await this.load();
      this.wallet = wallet;
      return wallet;
    }

    return this.wallet;
  }

  async createWallet() {
    const wallet = await this.getWallet();

    const [address, error] = await wallet.addSubWallet();
    if (error !== undefined) {
      throw error;
    }
    if (address === undefined) {
      throw new Error("Failed to create wallet");
    }
    this.save();
    return address;
  }

  async info() {
    const wallet = await this.getWallet();
    const [walletHeight, daemonHeight, networkHeight] = wallet.getSyncStatus();

    return {
      walletHeight,
      daemonHeight,
      networkHeight
    }
  }
}

export default WalletController;
