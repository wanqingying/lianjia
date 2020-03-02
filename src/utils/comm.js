"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Deferred {
    constructor() {
        this.resolve = (args) => {
            this._resolve.call(this.promise, args);
        };
        this.reject = (args) => {
            this._reject.call(this.promise, args);
        };
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
}
exports.Deferred = Deferred;
Deferred.runAsync = function (taskList, option) {
    let taskCompleteList;
    let innerTaskList = Array.from(taskList);
    if (taskList.every(tk => tk.index)) {
        taskCompleteList = {};
    }
    else {
        innerTaskList = taskList.map((t, i) => ({
            task: t,
            index: i
        }));
        taskCompleteList = [];
    }
    const limit = (option === null || option === void 0 ? void 0 : option.limit) || 10;
    let deem = new Deferred();
    let taskQueue = [];
    for (let i = 0; i < limit && i < taskList.length; i++) {
        let mission = innerTaskList.shift();
        taskQueue.push(runTask(mission, new Deferred()));
    }
    function runTask(mission, def) {
        let asyncTask = mission.task;
        let index = mission.index;
        asyncTask()
            .then(res => {
            let nextTask = innerTaskList.shift();
            taskCompleteList[index] = res;
            if (nextTask) {
                return runTask(nextTask, def);
            }
            else {
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
function timeoutFn(m) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(0);
        }, m);
    });
}
exports.timeoutFn = timeoutFn;
function getID() {
    return Date.now().toString(36) + '_' + Math.random().toString(36);
}
exports.getID = getID;
//# sourceMappingURL=comm.js.map