import { GetAccountBalanceQuery } from '../../port/in/GetAccountBalanceQuery';
import { LoadAccountPort } from '../../port/out/LoadAccountPort';

export class GetAccountBalanceService implements GetAccountBalanceQuery {
  private readonly loadAccountPort: LoadAccountPort;

  constructor(loadAccountPort: LoadAccountPort) {
    this.loadAccountPort = loadAccountPort;
  }

  getAccountBalance(accountId: AccountId): Money {
    const account = this.loadAccountPort.loadAccount(accountId);
    return account.calculateBalance();
  }
}
