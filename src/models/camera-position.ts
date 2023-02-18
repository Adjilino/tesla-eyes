import { CameraPositionInterface } from "../interfaces";

export class VideosByCameraPosition {
  private left_repeater: HTMLVideoElement[] = [];
  private right_repeater: HTMLVideoElement[] = [];
  private front: HTMLVideoElement[] = [];
  private back: HTMLVideoElement[] = [];

  constructor(cameraPosition?: CameraPositionInterface) {
    if (cameraPosition) {
      this.left_repeater = cameraPosition.left_repeater || [];
      this.right_repeater = cameraPosition.right_repeater || [];
      this.front = cameraPosition.front || [];
      this.back = cameraPosition.back || [];
    }
  }

  setLeftRepeater(leftRepeater: HTMLVideoElement[]): void {
    this.left_repeater = leftRepeater;
  }

  getLeftRepeater(): HTMLVideoElement[] {
    return this.left_repeater;
  }

  setRightRepeater(rightRepeater: HTMLVideoElement[]): void {
    this.right_repeater = rightRepeater;
  }

  getRightRepeater(): HTMLVideoElement[] {
    return this.right_repeater;
  }

  setFront(front: HTMLVideoElement[]): void {
    this.front = front;
  }

  getFront(): HTMLVideoElement[] {
    return this.front;
  }

  setBack(back: HTMLVideoElement[]): void {
    this.back = back;
  }

  getBack(): HTMLVideoElement[] {
    return this.back;
  }

  addLeftRepeater(leftRepeater: HTMLVideoElement): void {
    if (!this.left_repeater) {
      this.left_repeater = [];
    }

    this.left_repeater.push(leftRepeater);
  }

  addRightRepeater(rightRepeater: HTMLVideoElement): void {
    if (!this.right_repeater) {
      this.right_repeater = [];
    }

    this.right_repeater.push(rightRepeater);
  }

  addFront(front: HTMLVideoElement): void {
    if (!this.front) {
      this.front = [];
    }

    this.front.push(front);
  }

  addBack(back: HTMLVideoElement): void {
    if (!this.back) {
      this.back = [];
    }

    this.back.push(back);
  }

  static positions(): string[] {
    return ["left_repeater", "right_repeater", "front", "back"];
  }
}
