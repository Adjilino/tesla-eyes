import { ConfigInterface } from "../interfaces";

export class Config {
  private timestamp?: string;
  private dateTime?: Date;
  private city?: string;
  private est_lat?: string;
  private est_lon?: string;
  private reason?: string;
  private camera?: string;

  constructor(value?: ConfigInterface) {
    if (value) {
      this.setTimestamp(value.timestamp);
      this.setCity(value.city);
      this.setEstLat(value.est_lat);
      this.setEstLon(value.est_lon);
      this.setReason(value.reason);
      this.setCamera(value.camera);
    }
  }

  setTimestamp(timestamp: string | undefined): void {
    this.timestamp = timestamp;
    this.dateTime = timestamp ? new Date(timestamp) : undefined;
  }

  getTimestamp(): string | undefined {
    return this.timestamp;
  }

  getDateTime(): Date | undefined {
    return this.dateTime;
  }

  setCity(city: string | undefined): void {
    this.city = city;
  }

  getCity(): string | undefined {
    return this.city;
  }

  setEstLat(est_lat: string | undefined): void {
    this.est_lat = est_lat;
  }

  getEstLat(): string | undefined {
    return this.est_lat;
  }

  setEstLon(est_lon: string | undefined): void {
    this.est_lon = est_lon;
  }

  getEstLon(): string | undefined {
    return this.est_lon;
  }

  setReason(reason: string | undefined): void {
    this.reason = reason;
  }

  getReason(): string | undefined {
    return this.reason;
  }

  setCamera(camera: string | undefined): void {
    this.camera = camera;
  }

  getCamera(): string | undefined {
    return this.camera;
  }
}
