// 一个 Promise 的变体用法
export class Deferred {
  private _resolve: () => void;
  private _reject: () => void;
  public promise: Promise<any>;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
  public resolve = (args?: any): void => {
    this._resolve.call(this.promise as any, args);
  };
  public reject = (args?: any): void => {
    this._reject.call(this.promise as any, args);
  };

  static runAsync = function(
    taskList: any,
    option?: { limit: number }
  ): Promise<any> {
    let taskCompleteList;
    let innerTaskList = Array.from(taskList);
    if (taskList.every(tk => tk.index)) {
      // 需求用 index 标记返回值
      taskCompleteList = {};
    } else {
      // 否则按照数组顺序返回
      (innerTaskList as any) = taskList.map((t, i) => ({
        task: t,
        index: i
      }));
      taskCompleteList = [];
    }
    const limit = option?.limit || 10;
    let deem = new Deferred();
    let taskQueue: Promise<any>[] = [];
    for (let i = 0; i < limit && i < taskList.length; i++) {
      let mission = innerTaskList.shift();
      taskQueue.push(runTask(mission, new Deferred()));
    }
    function runTask(mission, def: Deferred) {
      let asyncTask = mission.task;
      let index = mission.index;
      asyncTask()
        .then(res => {
          let nextTask = innerTaskList.shift();
          taskCompleteList[index] = res;
          if (nextTask) {
            return runTask(nextTask, def);
          } else {
            def.resolve();
          }
        })
        .catch(e => {
          taskCompleteList[index] = { error: e };
          def.resolve();
        });
      return def.promise;
    }
    Promise.all(taskQueue)
      .then(() => {
        deem.resolve(taskCompleteList);
      })
      .catch(() => {
        deem.resolve(taskCompleteList);
      });
    return deem.promise;
  };
}

// 暂停
export function timeoutFn(m: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(0);
    }, m);
  });
}

// 生成随机id
export function getID(): string {
  return Date.now().toString(36) + '_' + Math.random().toString(36);
}
