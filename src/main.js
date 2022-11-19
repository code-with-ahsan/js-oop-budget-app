import { BudgetAppUI } from "./BudgetAppUI";

const main = () => {
  const app = new BudgetAppUI({
    formSelector: ".sidebar__form",
    transactionsSelector: ".main-section__transactions",
    walletsSelector: ".sidebar__wallets__list",
  });
  app.init();
};

main();
