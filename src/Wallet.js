const walletItemTemplate = (strings, id, activeClass, title, amount) => {
  const [str0, str1, str2, str3, str4] = strings;
  return `${str0}${id}${str1}${activeClass}${str2}${title}${str3}${amount}${str4}`;
};

export class Wallet {
  title;
  amount;
  id;
  isPrimary;
  constructor({ title, amount, isPrimary }) {
    this.title = title;
    this.amount = amount;
    this.id = self.crypto.randomUUID();
    this.isPrimary = isPrimary || false;
  }

  update({ amount, isPrimary }) {
    if (amount !== undefined) {
      this.amount += amount;
    }
    this.isPrimary = isPrimary !== undefined ? isPrimary : this.isPrimary;
  }

  setIsPrimary(value) {
    this.isPrimary = value;
  }

  getHtml() {
    return walletItemTemplate`
      <li id="${
        this.id
      }" class="sidebar__wallets__list__item p-4 rounded-lg flex flex-col gap-2 ${
      this.isPrimary ? "sidebar__wallets__list__item--active" : ""
    }">
        <h4 class="sidebar__wallets__list__item__heading font-bold">${
          this.title
        }</h4>
        <p class="sidebar__wallets__list__item__amount text-slate-500">$${
          this.amount
        }</p>
      </li>
    `;
  }
}
