export class TeslaEvent {
    private timestamp?: string;
    private city?: string;
    private est_lat?: string;
    private est_lon?: string;
    private reason?: string;
    private camera?: string;

    constructor(values: any = {}) {
        if (values) {
            this.setTimestamp(values?.timestamp);
            this.setCity(values?.city);
            this.setEstLat(values?.est_lat);
            this.setEstLon(values?.est_lon);
            this.setReason(values?.reason);
            this.setCamera(values?.camera);
        }
    }

    public setTimestamp(timestamp: string): void {
        this.timestamp = timestamp;
    }

    public getTimestamp(): string | undefined {
        return this.timestamp;
    }

    public getDate(): Date | undefined {
        if (this.timestamp) {
            return new Date(this.timestamp);
        } else {
            return undefined;
        }
    }

    public setCity(city: string): void {
        this.city = city;
    }

    public getCity(): string | undefined {
        return this.city;
    }

    public setEstLat(est_lat: string): void {
        this.est_lat = est_lat;
    }

    public getEstlat(): string | undefined {
        return this.est_lat;
    }

    public setEstLon(est_lon: string): void {
        this.est_lon = est_lon;
    }

    public getEstLon(): string | undefined {
        return this.est_lon;
    }

    public setReason(reason: string): void {
        this.reason = reason;
    }

    public getReason(): string | undefined {
        return this.reason;
    }

    public setCamera(camera: string): void {
        this.camera = camera;
    }

    public getCamera(): string | undefined {
        return this.camera;
    }
}
