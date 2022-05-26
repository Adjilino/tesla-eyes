export class EventFile {
    timestamp!: string;
    city!: string;
    est_lat!: string;
    est_lon!: string;
    reason!: string;
    camera!: string;

    constructor(values?: any) {
        if (values) {
            this.timestamp = values.timestamp;
            this.city = values.city;
            this.est_lat = values.est_lat;
            this.est_lon = values.est_lon;
            this.reason = values.reason;
            this.camera = values.camera;
        }
    }
}
