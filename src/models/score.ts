export class Score {
    public name: string;
    public played: number;
    public won: number;
    public ratio: string

    constructor(data: { name: string, played: number, won: number }) {
        this.name = data.name;
        this.played = data.played;
        this.won = data.won;
        this.ratio = `${this.getRatio()}%`;
    }

    public getRatio(): number {
        return Math.round(this.won / this.played * 100);
    }
}   