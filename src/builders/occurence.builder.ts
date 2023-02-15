import { Config, Occurence } from "../models";

export class OccurenceBuilder {
  files: File[] = [];

  constructor() {
    return this;
  }

  addFiles(files: File[]) {
    // add files to the builder
    this.files = files;

    return this;
  }

  async build(): Promise<Occurence | undefined> {
    // build the files
    if (!this.files || this.files.length === 0) {
      return;
    }

    const occurence = new Occurence();

    const occurenceDateTime = this.getOccurenceDateTime();
    occurence.setDateTime(occurenceDateTime);

    const config = await this.getOccurenceConfig();
    occurence.setConfig(config);

    return occurence;
  }

  private getOccurenceDateTime(): Date | undefined {
    if (!this.files || this.files.length === 0) {
      return;
    }

    // retrieve occurence name from the first file
    const splittedPath = this.files[0].webkitRelativePath.split("/");

    if (splittedPath.length < 2) {
      return;
    }

    const occurenceName = splittedPath[splittedPath.length - 2];

    const occurenceDateTime = this.stringToDateTime(occurenceName);

    return occurenceDateTime;
  }

  private stringToDateTime(dateTimeString: string): Date | undefined {
    // Convert date string to a valid date string
    // example of date string: 2022-07-14_11-52-29
    const dateSplitted = dateTimeString.split("_");

    const dateString = dateSplitted.shift();
    const timeStringToConvert = dateSplitted.shift();

    if (!dateString || !timeStringToConvert) {
      return;
    }

    const timeString = timeStringToConvert.split("-").join(":");

    // Convert occurence name to a date
    const dateTime = new Date(`${dateString}T${timeString}`);

    return dateTime;
  }

  private async getOccurenceConfig(): Promise<
    Config | undefined
  > {
    if (!this.files || this.files.length === 0) {
      return;
    }

    const configFile = this.files.find((file) => {
      return file.type === "application/json" && file.name === "event.json";
    });

    if (!configFile) {
      return;
    }

    const configArrayBuffer = await configFile.arrayBuffer();

    const configString = new TextDecoder("utf-8").decode(configArrayBuffer);

    const configJson= JSON.parse(configString);

    const config = new Config(configJson);
    
    return config;
  }
}
