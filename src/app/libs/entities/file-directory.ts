export class FileDirectory {
    public name!: string;
    public path!: string;
    public base64!: any;

    constructor(values?: any) {
        if (values) {
            this.name = values.name;
            this.path = values.path;
            this.base64 = undefined;
        }
    }
    
    public async setFile(file: File) {
        this.base64 = await this._readFileAsUrl(file);
    }

    private async _readFileAsUrl(file: File) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = (e) => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            }

            fileReader.readAsDataURL(file);
        });
    }
}
