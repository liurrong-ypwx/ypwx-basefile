export class Timer {
    func: null | undefined
    timeID: NodeJS.Timeout | any
    clear: (() => void) | undefined
    repeat: ((func: any, ms: any) => void) | any
}



Timer.prototype.repeat = function (func: any, ms: any) {
    if (this.func === null) {
        this.func = func
    }

    // 确保一个 Timer 实例只能重复一个 func
    if (this.func !== func) {
        return
    }

    this.timeID = setTimeout(() => {
        func()
        this.repeat(func, ms)
    }, ms)
}

Timer.prototype.clear = function () {
    clearTimeout(this.timeID)
}