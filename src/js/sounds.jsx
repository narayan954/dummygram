import { errorSound, successSound, backBtnSound } from "../assets/sounds";;


export function playSuccessSound() {
  const sound = localStorage.getItem("sound")
  if (!sound) {
    new Audio(successSound).play();
  }
}

export function playErrorSound() {
  const sound = localStorage.getItem("sound")
  if (!sound) {
    new Audio(errorSound).play();
  }
}

export function playTapSound() {
  const sound = localStorage.getItem("sound")
  if (!sound) {
    new Audio(backBtnSound).play();
  }
}

