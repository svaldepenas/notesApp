export class NoteModel {
    id: string;
    title: string;
    description: string;
    author: string;
    creationDate: Date;
    finishDate: Date;

    constructor() {
        this.creationDate = new Date();
    }
}
