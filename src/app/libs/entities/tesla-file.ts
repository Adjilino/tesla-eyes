export class TeslaFile {
    private name?: string;
    private path?: string;
    private type?: string;

    constructor(values: any = {}) {
        if (values) {
            this.setName(values?.name);
            this.setPath(values?.path);
            this.setType(values?.type);
        }
    }

    public setName(name: string) {
        this.name = name;
    }

    public getName(): string | undefined {
        return this.name;
    }

    public setPath(path: string) {
        this.path = path;
    }

    public getPath(): string | undefined {
        return this.path;
    }

    public setType(type: string) {
        this.type = type;
    }

    public getType(): string | undefined {
        return this.type;
    }
}
