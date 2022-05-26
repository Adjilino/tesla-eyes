export class FileDirectory {
    public name!: string;
    public path!: string;

    constructor(values?: any) {
        if (values) {
            this.name = values.name;
            this.path = values.path;
        }
    }
}
