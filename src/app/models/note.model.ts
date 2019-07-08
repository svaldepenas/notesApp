export class NoteModel {
    id: string;
    title: string;
    description: string;
    author: string;
    creationDate: Date;
    finishDate: Date;
    modificationDate: Date;
    members: string[];

    constructor() {
        this.creationDate = new Date();
        this.finishDate = new Date();
        this.modificationDate = new Date();
        this.members = [];
    }
}
