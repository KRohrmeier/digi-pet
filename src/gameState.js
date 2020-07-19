import { modifyFox, modifyScene } from "./ui";
import { RAIN_CHANCE, SCENES } from "./constants";

const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1, // keeping attribute in the same type (typescript); not undefined, but a numeric value that means it's not current
  tick() {
    this.clock++;
    console.log("clock = ", this.clock);
    if (this.clock === this.wakeTime) {
      this.wake();
    }
    return this.clock;
  },
  startGame() {
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    modifyFox("fox-egg");
    modifyScene("day");
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    modifyFox(`${this.current.toLowerCase()}`);
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modifyScene(SCENES[this.scene]);
  },
  handleUserAction(icon) {
    if (
      ["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)
    ) {
      // do nothing, fox is busy
      return;
    }
    if (this.current === "INIT" || this.current === "DEAD") {
      this.startGame();
      return;
    }
    switch (icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanUpPoop();
        break;
      case "fish":
        this.feed();
        break;
    }
  },
  changeWeather() {
    console.log("changing weather");
  },
  cleanUpPoop() {
    console.log("cleaning up poop");
  },
  feed() {
    console.log("feeding the hungry fox");
  },
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
