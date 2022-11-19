import { BudgetApp } from "./BudgetApp";
import { createElementFromHTML } from "./Utils";
import { Transaction } from "./Transaction";

const TRANSACTION_FORM_MODES = {
  NEW: "new",
  EDIT: "edit",
};

export class BudgetAppUI {
  app;
  transactionForm;
  transactionsListEl;
  walletsListEl;
  entryCancelBtnEl;
  transactionToEdit;
  transactionFormMode = TRANSACTION_FORM_MODES.NEW;
  constructor({ formSelector, transactionsSelector, walletsSelector }) {
    this.app = new BudgetApp();
    this.transactionForm = document.querySelector(formSelector);
    this.transactionsListEl = document.querySelector(transactionsSelector);
    this.walletsListEl = document.querySelector(walletsSelector);
    this.entryCancelBtnEl = document.querySelector("#entryCancelBtn");
  }

  init() {
    this.initEventHandlers();
    this.assignCategories();
    this.renderWallets(this.app.wallets);
    this.renderTransactionsFromStorage();
  }

  renderTransactionsFromStorage() {
    const transactionsFromStorage = this.app.transactionStorage.getAll();
    transactionsFromStorage.forEach((transaction) => {
      const transactionInstance = this.createTransaction(transaction);
      this.app.transactions.push(transactionInstance);
    });
  }

  /**
   * Renders the wallet by finding it in the DOM by its ID
   * @param {wallet} wallet The wallet instance
   */
  renderWallet(wallet) {
    const walletEl = document.getElementById(wallet.id);
    walletEl.querySelector(
      ".sidebar__wallets__list__item__heading"
    ).textContent = wallet.title;
    walletEl.querySelector(
      ".sidebar__wallets__list__item__amount"
    ).textContent = `$${wallet.amount}`;
    if (wallet.isPrimary) {
      walletEl.classList.add("sidebar__wallets__list__item--active");
    } else {
      walletEl.classList.remove("sidebar__wallets__list__item--active");
    }
  }

  renderTransaction(transaction) {
    const transactionEl = document.getElementById(
      `transaction_${transaction.id}`
    );
    const html = transaction.getHtml();
    transactionEl.outerHTML = html;
  }

  renderWallets(wallets) {
    wallets.forEach((wallet) => {
      const html = wallet.getHtml();
      this.walletsListEl.appendChild(createElementFromHTML(html));
    });
  }

  setFormMode(mode) {
    this.transactionFormMode = mode;
    const { elements } = this.transactionForm;
    const headingEl = document.querySelector(".sidebar__heading");
    switch (this.transactionFormMode) {
      case TRANSACTION_FORM_MODES.NEW:
        // code for new transaction
        headingEl.textContent = "New Transaction";
        elements["entrySubmitBtn"].textContent = "Create";
        this.entryCancelBtnEl.setAttribute("hidden", "true");
        this.transactionForm.reset();
        this.transactionToEdit = null;
        this.transactionsListEl.querySelectorAll("button").forEach((button) => {
          button.removeAttribute("disabled");
        });
        break;
      case TRANSACTION_FORM_MODES.EDIT:
        // code for edit transaction
        headingEl.textContent = "Edit Transaction";
        elements["entrySubmitBtn"].textContent = "Update";
        this.setTransactionFormValues(elements, this.transactionToEdit);
        this.entryCancelBtnEl.removeAttribute("hidden");
        this.transactionsListEl.querySelectorAll("button").forEach((button) => {
          button.setAttribute("disabled", true);
        });
        break;
    }
  }

  setTransactionFormValues(elements, transaction) {
    elements["title"].value = transaction.title;
    elements["amount"].value = transaction.amount;
    elements["category"].value = transaction.category.value;
    elements["type"].value = transaction.type;
  }

  handleTransactionAction(event) {
    const { target } = event;
    const transactionEl = event.target.closest("[id^=transaction]");
    const transactionId = transactionEl.id.replace("transaction_", "");
    let targetButton;
    if (target.nodeName === "button") {
      targetButton = target;
    } else {
      targetButton = target.closest("button");
    }
    if (
      targetButton.classList.contains(
        "main-section__transactions__item__actions__delete"
      )
    ) {
      console.log("this is the delete button");
      this.deleteTransaction(transactionEl, transactionId);
    } else if (
      targetButton.classList.contains(
        "main-section__transactions__item__actions__edit"
      )
    ) {
      console.log("this is the edit button");
      this.editTransaction(transactionEl, transactionId);
    }
  }

  editTransaction(el, id) {
    const transactionToEdit = this.app.transactions.find(
      (transaction) => transaction.id === id
    );
    this.transactionToEdit = transactionToEdit;
    this.setFormMode(TRANSACTION_FORM_MODES.EDIT);
  }

  assignCategories() {
    const categoriesElement = document.querySelector(
      ".sidebar__form #categoriesEl"
    );
    this.app.categories.forEach((category) => {
      const optionEl = document.createElement("OPTION");
      optionEl.value = category.value;
      optionEl.textContent = category.title;
      categoriesElement.appendChild(optionEl);
    });
  }

  initEventHandlers() {
    this.transactionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const { elements } = event.target;
      const title = elements["title"].value;
      const amount = elements["amount"].value;
      const category = elements["category"].value;
      const type = elements["type"].value;
      const categoryObj = this.app.categories.find(
        (cat) => cat.value === category
      );
      switch (this.transactionFormMode) {
        case TRANSACTION_FORM_MODES.NEW:
          const transaction = this.createTransaction({
            title,
            amount,
            category: categoryObj,
            type,
          });
          event.target.reset();
          elements["category"].value = category;
          this.app.wallet.update({
            amount:
              type === "credit" ? transaction.amount : -transaction.amount,
          });
          this.app.transactions.push(transaction);
          break;
        case TRANSACTION_FORM_MODES.EDIT:
          const previousAmount = this.transactionToEdit.amount;
          const amountDiff = previousAmount - Number(amount);
          this.transactionToEdit.update({
            title,
            amount,
            category: categoryObj,
            type,
          });
          this.app.wallet.update({
            amount: type === "debit" ? amountDiff : -amountDiff,
          });
          this.renderTransaction(this.transactionToEdit);
          this.setFormMode(TRANSACTION_FORM_MODES.NEW);
          break;
        default:
          break;
      }

      this.app.walletStorage.setAll(this.app.wallets);
      this.renderWallet(this.app.wallet);
      this.app.transactionStorage.setAll(this.app.transactions);
    });

    this.walletsListEl.addEventListener("click", (event) => {
      let element = event.target;
      if (element.nodeName !== "LI") {
        element = element.closest("LI");
      }
      event.stopImmediatePropagation();
      this.app.wallet.update({
        isPrimary: false,
      });
      this.renderWallet(this.app.wallet);
      this.changePrimaryWallet(element);
    });

    this.transactionsListEl.addEventListener(
      "click",
      this.handleTransactionAction.bind(this)
    );

    this.entryCancelBtnEl.addEventListener("click", () => {
      this.setFormMode(TRANSACTION_FORM_MODES.NEW);
    });
  }

  deleteTransaction(el, id) {
    const transactionToRemove = this.app.transactions.find(
      (transaction) => transaction.id === id
    );
    const { amount, type } = transactionToRemove;
    this.app.transactions = this.app.transactions.filter((tr) => {
      return tr.id !== transactionToRemove.id;
    });
    this.app.transactionStorage.setAll(this.app.transactions);
    this.app.wallet.update({
      amount: type === "credit" ? -amount : amount,
    });
    this.app.walletStorage.setAll(this.app.wallets);
    this.renderWallet(this.app.wallet);
    el.remove();
  }

  changePrimaryWallet(newWalletDomEl) {
    const newWallet = this.app.wallets.find(
      (wallet) => wallet.id === newWalletDomEl.id
    );
    newWallet.update({ isPrimary: true });
    this.app.wallet = newWallet;
    this.renderWallet(newWallet);
  }

  createTransaction({ title, amount, category, type }) {
    const newTransaction = new Transaction({
      title,
      amount,
      category,
      date: new Date(),
      type,
    });
    const html = newTransaction.getHtml();
    this.transactionsListEl.appendChild(createElementFromHTML(html));
    return newTransaction;
  }
}
