class TimerWorker {
  constructor() {
    this.timers = {};
  }
  registerTimer(timerId, timeout) {
    console.log('register timer ' + timerId + '(' + timeout + ')');
    if (this.timers[timerId]) {
      clearTimeout(this.timers[timerId]);
    }

    this.timers[timerId] = setTimeout(() => {
      postMessage({
        timerId
      });
    }, timeout);
  }

  unregisterTimer(timerId) {
    clearTimeout(this.timers[timerId]);
    delete this.timers[timerId];
  }
}

const worker = new TimerWorker();

onmessage = (message) => {
  if (message.data instanceof Object && message.data.hasOwnProperty('method') && message.data.hasOwnProperty('args')) {
    worker[message.data.method].apply(worker, message.data.args);
  }
};
