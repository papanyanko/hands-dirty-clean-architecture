import { SendMoneyCommandType } from '../../port/in/SendMoneyCommand';
import { SendMoneyUseCase } from '../../port/in/SendMoneyUseCase';
import { LoadAccountPort } from '../../port/out/LoadAccountPort';
import { UpdateAccountStatePort } from '../../port/out/UpdateAccountStatePort';

class SendMoneyService implements SendMoneyUseCase {
  private readonly loadAccountPort: LoadAccountPort;
  private readonly updateAccountStatePort: UpdateAccountStatePort;

  constructor(
    loadAccountPort: LoadAccountPort,
    updateAccountStatePort: UpdateAccountStatePort
  ) {
    this.loadAccountPort = loadAccountPort;
    this.updateAccountStatePort = updateAccountStatePort;
  }

  public sendMoney(command: SendMoneyCommandType): boolean {
    const sourceAccount = this.loadAccountPort.loadAccount(
      command.sourceAccountId
    );
    const targetAccount = this.loadAccountPort.loadAccount(
      command.targetAccountId
    );

    if (!sourceAccount || !targetAccount) return false;

    if (!sourceAccount.withdraw(command.money, targetAccount.id)) return false;
    if (!targetAccount.deposit(command.money, sourceAccount.id)) return false;

    this.updateAccountStatePort.updateActivities(sourceAccount);
    this.updateAccountStatePort.updateActivities(targetAccount);

    return true;
  }
}
