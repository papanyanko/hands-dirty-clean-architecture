/**
 * Account entity
 * @param id AccountId
 * @param baselineBalance Money
 * @param activityWindow ActivityWindow
 *
 * @method withdraw(money: Money, targetAccountId: AccountId): boolean
 * @method deposit(money: Money, sourceAccountId: AccountId): boolean
 */
export class Account {
  private readonly id: AccountId;
  private readonly baselineBalance: Money;
  private readonly activityWindow: ActivityWindow;

  constructor(
    id: AccountId,
    baselineBalance: Money,
    activityWindow: ActivityWindow
  ) {
    this.id = id;
    this.baselineBalance = baselineBalance;
    this.activityWindow = activityWindow;
  }

  public calculateBalance(): Money {
    return Money.add(
      this.baselineBalance,
      this.activityWindow.calculateBalance(this.id)
    );
  }

  public withdraw(money: Money, targetAccountId: AccountId): boolean {
    if (!this.mayWithdraw(money)) return false;

    const withdrawal = new Activity(
      this.id,
      this.id,
      targetAccountId,
      new Date(),
      money
    );
    this.activityWindow.addActivity(withdrawal);
    return true;
  }

  private mayWithdraw(money: Money): boolean {
    return Money.add(this.calculateBalance(), money.negate()).isPositive();
  }

  public deposit(money: Money, sourceAccountId: AccountId): boolean {
    const deposit = new Activity(
      this.id,
      sourceAccountId,
      new Date(),
      this.id,
      money
    );
    this.activityWindow.addActivity(deposit);
    return true;
  }
}
