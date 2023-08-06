import {
  errorSound,
  successSound,
  backBtnSound,
  lightOnSound,
  lightOffSound,
} from "../assets/sounds";

export function playSuccessSound() {
  const sound = localStorage.getItem("sound");
  if (!sound) {
    new Audio(successSound).play();
  }
}

export function playErrorSound() {
  const sound = localStorage.getItem("sound");
  if (!sound) {
    new Audio(errorSound).play();
  }
}

export function playTapSound() {
  const sound = localStorage.getItem("sound");
  if (!sound) {
    new Audio(backBtnSound).play();
  }
}

export function playLightOnSound() {
  const sound = localStorage.getItem("sound");
  if (!sound) {
    new Audio(lightOnSound).play();
  }
}

export function playLightOffSound() {
  const sound = localStorage.getItem("sound");
  if (!sound) {
    new Audio(lightOffSound).play();
  }
}
