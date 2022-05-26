import { Capture } from "./capture";

export class Entry {
    thumb!: string;
    type!: 'ad' | 'tesla';
    title!: string;
    description!: string | Date;
    capture!: Capture;

    constructor(values?: any) {
        if (values) {
            this.thumb = values.thumb;
            this.type = values.type;
            this.title = values.title;
            this.description = values.description;
            this.capture = new Capture(values.capture);
        }
    }
}
