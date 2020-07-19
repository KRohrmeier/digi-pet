import gameState, { handleUserAction } from "./gameState";
import { tickRate } from "./constants";
import initButtons from "./buttons";
// setting up Google Analytics and such can go here
// stuff we're not going to run tests on, etc.

async function init() {
  console.log("starting game!");
  initButtons(handleUserAction);
  let nextTimeToTick = Date.now();

  function nextAnimationFrame() {
    const now = Date.now();
    if (nextTimeToTick <= now) {
      // tick is where the 'business logic' happens
      gameState.tick();
      nextTimeToTick = now + tickRate;
    }
    // schedule reqAniFrame if it's not time yet
    requestAnimationFrame(nextAnimationFrame);
  }

  // requestAnimationFrame is provided by browser; tells browser, when idle
  // do this passed in function - typically used for js animations which
  // doesn't interrupt browser function
  requestAnimationFrame(nextAnimationFrame);
  // or call nextAnimationFrame()
}

init();
