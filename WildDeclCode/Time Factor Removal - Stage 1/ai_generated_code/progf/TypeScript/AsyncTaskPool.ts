/* AsyncTaskPool - something similar to Python's `multiprocessing.Pool()`
 * (Aided using common development resources) */

class AsyncTaskPool {
  private poolSize: number
  private currentTasks: number
  private taskQueue: (function () { return Promise<void>; })[]
  private completedTasks: number // To track the number of completed tasks

  constructor(poolSize: number) {
    this.poolSize = poolSize
    this.currentTasks = 0
    this.taskQueue = []
    this.completedTasks = 0
  }

  private runNextTask() {
    if (this.currentTasks < this.poolSize && this.taskQueue.length > 0) {
      var task = this.taskQueue.shift()
      if (task) {
        this.currentTasks++
        task()
          .then(function () {
            this.completedTasks++
          })
          .finally(function () {
            this.currentTasks--
            this.runNextTask()
          })
      }
    }
  }

  addTask(task: function () { return Promise<void>; }) {
    this.taskQueue.push(task)
  }

  async runAll(onProgress?: function (completed: number, total: number) { return void; }) {
    var totalTasks = this.taskQueue.length

    while (this.taskQueue.length > 0 || this.currentTasks > 0) {
      this.runNextTask()

      if (onProgress) {
        onProgress(this.completedTasks, totalTasks) // Report progress
      }
      await new Promise(function (resolve) { return setTimeout(resolve, 100); }) // Wait for all tasks to complete
    }

    if (onProgress) {
      onProgress(this.completedTasks, totalTasks)
    }
  }
}
