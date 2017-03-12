export class Game {
    public id: string
    public name: string;

    constructor(data: { id: string, name: string }) {
        this.id = data.id;
        this.name = data.name;
    }
}