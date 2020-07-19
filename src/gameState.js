import { modifyFox, modifyScene, togglePoopBag, writeModal } from "./ui";
import {
  RAIN_CHANCE,
  SCENES,
  DAY_LENGTH,
  NIGHT_LENGTH,
  getNextHungerTime,
  getNextDieTime,
  getNextPoopTime,
} from "./constants";

const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1, // keeping attribute in the same type (typescript); not undefined, but a numeric value that means it's not current
  sleepTime: -1,
  hungryTime: -1,
  dieTime: -1,
  poopTime: -1,
  timeToStartCelebrating: -1,
  timeToEndCelebrating: -1,
  scene: 0,
  tick() {
    this.clock++;
    console.log(this.clock, this);

    if (this.clock === this.wakeTime) {
      this.wake();
    } else if (this.clock === this.sleepTime) {
      this.sleep();
    } else if (this.clock === this.hungryTime) {
      this.getHungry();
    } else if (this.clock === this.dieTime) {
      this.die();
    } else if (this.clock === this.timeToStartCelebrating) {
      this.startCelebrating();
    } else if (this.clock === this.timeToEndCelebrating) {
      this.endCelebrating();
    } else if (this.clock === this.poopTime) {
      this.poop();
    }
    return this.clock;
  },
  startGame() {
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    modifyFox("egg");
    modifyScene("day");
    writeModal();
  },
  clearTimes() {
    this.wakeTime = -1;
    this.sleepTime = -1;
    this.hungryTime = -1;
    this.dieTime = -1;
    this.poopTime = -1;
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = -1;
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modifyScene(SCENES[this.scene]);

    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);

    this.determineFoxState();
  },
  sleep() {
    this.current = "SLEEP";
    modifyFox("sleep");
    modifyScene("night");
    this.clearTimes();
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  getHungry() {
    this.current = "HUNGRY";
    this.hungryTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modifyFox("hungry");
  },
  poop() {
    this.current = "POOPING";
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modifyFox("pooping");
  },
  startCelebrating() {
    this.current = "CELEBRATING";
    modifyFox("celebrate");
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 3;
  },
  endCelebrating() {
    this.timeToEndCelebrating = -1;
    this.current = "IDLING";
    this.determineFoxState();
    togglePoopBag(false);
  },
  determineFoxState() {
    if (this.current === "IDLING") {
      if (SCENES[this.scene] === "rain") {
        modifyFox("rain");
      } else {
        modifyFox("idling");
      }
    }
  },
  die() {
    this.current = "DEAD";
    modifyScene("dead");
    modifyFox("dead");
    this.clearTimes();
    writeModal("The fox died :( <br/> Press the middle button to start again.");
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
    this.scene = (this.scene + 1) % SCENES.length;
    modifyScene(SCENES[this.scene]);
    this.determineFoxState();
  },
  cleanUpPoop() {
    console.log("cleaning up poop");
    if (this.current !== "POOPING") {
      //do nothing
      return;
    }
    this.dieTime = -1;
    togglePoopBag(true);
    this.startCelebrating();
    this.hungryTime = getNextHungerTime(this.clock);
  },
  feed() {
    console.log("feeding the hungry fox");
    if (this.current !== "HUNGRY") {
      //do nothing
      return;
    }
    this.current = "FEEDING";
    modifyFox("eating");
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    this.timeToCelebrate = this.clock + 4;
  },
};

export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
