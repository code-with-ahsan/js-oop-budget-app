export const transactionItemTemplate = (
  strings,
  id,
  iconClasses,
  title,
  date,
  type,
  amount
) => {
  const [str0, str1, str2, str3, str4, str5, str6] = strings;
  return `${str0}${id}${str1}${iconClasses}${str2}${title}${str3}${date}${str4}${type}${str5}${amount}${str6}`;
};

export class Transaction {
  category;
  title;
  date;
  amount;
  type;
  constructor({ category, title, date, amount, type }) {
    this.category = category || null;
    this.id = self.crypto.randomUUID();
    this.title = title;
    this.date = (date || new Date()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    this.type = type;
    this.amount = Number(amount);
  }

  update({ category, title, type, amount }) {
    this.category = category || this.category;
    this.type = type || this.type;
    this.amount = amount || this.amount;
    this.title = title || this.title;
  }

  getHtml() {
    return transactionItemTemplate`
    <div id="transaction_${
      this.id
    }" class="main-section__transactions__item mb-4 duration-300 hover:shadow-lg shadow-sm bg-white rounded-lg p-4 flex items-center gap-4 text-xs sm:text-base">
      <div class="main-section__transactions__item__icon rounded-icon text-sky-600 bg-blue-100 ">
        <i class="${this.category?.iconClasses}"></i>
      </div>
      <div class="flex-1 flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <h4 class="font-bold">
            ${this.title}
          </h4>
          <div class="text-slate-500">
            ${this.date}
          </div>
        </div>
        <div class="font-bold mt-2 sm:mt-0">
          ${this.type === "credit" ? "" : "-"}$${this.amount}
        </div>
      </div>
      <div class="main-section__transactions__item__actions ml-6 flex items-center gap-4">
        <button class="main-section__transactions__item__actions__edit rounded-icon rounded-icon-clickable text-slate-600 bg-slate-100">
          <i class="fa fa-pencil"></i>
        </button>
        <button class="main-section__transactions__item__actions__delete rounded-icon rounded-icon-clickable text-red-600 bg-red-100">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>
  `;
  }
}
