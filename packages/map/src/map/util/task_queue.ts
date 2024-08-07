export type TaskID = number;

type Task = {
  callback: (timeStamp: number) => void;
  id: TaskID;
  cancelled: boolean;
};

export class TaskQueue {
  _queue: Array<Task>;
  _id: TaskID;
  _cleared: boolean;
  _currentlyRunning: Array<Task> | false;

  constructor() {
    this._queue = [];
    this._id = 0;
    this._cleared = false;
    this._currentlyRunning = false;
  }

  add(callback: (timeStamp: number) => void): TaskID {
    const id = ++this._id;
    const queue = this._queue;
    queue.push({ callback, id, cancelled: false });
    return id;
  }

  remove(id: TaskID) {
    const running = this._currentlyRunning;
    const queue = running ? this._queue.concat(running) : this._queue;
    for (const task of queue) {
      if (task.id === id) {
        task.cancelled = true;
        return;
      }
    }
  }

  run(timeStamp: number = 0) {
    if (this._currentlyRunning) throw new Error('Attempting to run(), but is already running.');
    const queue = (this._currentlyRunning = this._queue);

    // Tasks queued by callbacks in the current queue should be executed
    // on the next run, not the current run.
    this._queue = [];

    for (const task of queue) {
      if (task.cancelled) continue;
      task.callback(timeStamp);
      if (this._cleared) break;
    }

    this._cleared = false;
    this._currentlyRunning = false;
  }

  clear() {
    if (this._currentlyRunning) {
      this._cleared = true;
    }
    this._queue = [];
  }
}
