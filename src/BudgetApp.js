import { TransactionStorage, WalletStorage } from "./Storage";
import { Wallet } from "./Wallet";

export class BudgetApp {
  wallet;
  wallets = [];
  transactionStorage = new TransactionStorage();
  walletStorage = new WalletStorage();
  transactions = [];
  categories = [
    {
      title: "Restaurants & Cafe",
      iconClasses: "fa-solid fa-utensils",
      value: "restaurants-and-cafe",
    },
    {
      title: "Clothes & Shopping",
      iconClasses: "fa-solid fa-shirt",
      value: "clothes-and-shopping",
    },
    {
      title: "Credits & Loans",
      iconClasses: "fa-solid fa-credit-card",
      value: "credits-and-loans",
    },
    {
      title: "Gift Cards",
      iconClasses: "fa-solid fa-gift",
      value: "gift-cards",
    },
  ];

  constructor() {
    let wallets = this.walletStorage.getAll();
    if (!wallets.length) {
      // no wallets in storage, creating new wallets
      wallets = [
        new Wallet({
          title: "Google Pay",
          amount: 5000,
        }),
        new Wallet({
          title: "Apple Pay",
          amount: 2000,
        }),
      ];
      this.setPrimaryWallet(wallets[0]);
    } else {
      // we had wallets from storage, finding the primary and setting as well
      wallets = wallets.map((wallet) => new Wallet(wallet));
      const primaryWallet = wallets.find((wallet) => wallet.isPrimary);
      this.wallet = primaryWallet;
    }
    this.wallets = wallets;
  }

  setPrimaryWallet(wallet) {
    if (this.wallet) {
      this.wallet.setIsPrimary(false);
    }
    wallet.setIsPrimary(true);
    this.wallet = wallet;
  }
}
