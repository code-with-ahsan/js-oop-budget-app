class AppStorage {
  localStorageKey;
  getAll() {
    return JSON.parse(localStorage.getItem(this.localStorageKey) || "[]");
  }

  setAll(items = []) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(items));
  }

  updateOne() {}

  deleteOne() {}

  deleteAll() {
    localStorage.removeItem(this.localStorageKey);
  }
}

export class TransactionStorage extends AppStorage {
  localStorageKey = "budget_app_transactions";
}

export class WalletStorage extends AppStorage {
  localStorageKey = "budget_app_wallets";
}
