export default class Event {
  constructor(timer, onDone, repeats = false, startPaused = false) {
    this.initial = timer;
    this.timer = timer;
    this.onDone = onDone;
    this.repeats = repeats;

    this.paused = startPaused;
    this.tickHandle = setInterval(() => this.tick(), 1000);
  }

  toggle() {
    this.paused = !this.paused;
  }

  tick() {
    if (!this.paused) {
      this.timer -= 1;

      if (this.timer <= 0) {
        this.onDone();
        this.toggle();

        if (this.repeats) {
          this.reset();
          this.toggle();
        }
      }
    }
  }

  add(amount) {
    this.timer += amount;
  }

  subtract(amount) {
    this.timer -= amount;
  }

  reset() {
    this.timer = this.initial;
  }
}
