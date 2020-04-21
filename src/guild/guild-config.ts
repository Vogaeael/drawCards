import { RanksNumber } from '../deck/ranks';

export class GuildConfig {
  private prefix: string = '!';
  private joker: boolean = false;
  private ranksNumber: RanksNumber = RanksNumber.ranks_52;

  public setPrefix(newPref: string): void {
    this.prefix = newPref;
  }

  public setJoker(joker: boolean): void {
    this.joker = joker;
  }

  public useJoker(): void {
    this.setJoker(true);
  }

  public dontUseJoker(): void {
    this.setJoker(false);
  }

  public setRanksNumber(ranksNum: RanksNumber): void {
    this.ranksNumber = ranksNum;
  }

  public getPrefix(): string {
    return this.prefix;
  }

  public getJoker(): boolean {
    return this.joker;
  }

  public getRanksNumber(): RanksNumber {
    return this.ranksNumber;
  }
}
