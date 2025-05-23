import dayjs, { Dayjs } from "dayjs"
interface ShiftResult {
	cycle: number
	workPeriod: string
	restPeriod: string
	restDays: string[]
	weekendOverlap: number
	isFullWeekend: boolean
	month: number
	year: number
	workeTimes: Map<string, { start: string; end: string }>
}

export class ShiftCalculator {
	private weekdays: string[]
	private workDaysPerCycle: number
	private restDaysPerCycle: number

	constructor() {
		this.weekdays = ["日", "一", "二", "三", "四", "五", "六"]
		this.workDaysPerCycle = 5
		this.restDaysPerCycle = 2
	}

	private getDateAfterDays(startDate: Dayjs, days: number): Dayjs {
		return dayjs(startDate).add(days, "day")
	}

	private formatDate(date: Dayjs): string {
		const month = date.month() + 1
		const day = date.date()
		const weekday = this.weekdays[date.day()]
		return `${month}月${day}日(周${weekday})`
	}

	calculateOverlap(
		startTime: string,
		cyclesToCheck: number = 10
	): ShiftResult[] {
		let currentDate = dayjs(startTime)
		let results: ShiftResult[] = []
		let cycleCount = 0
		let foundFullWeekend = false

		let count = 1

		while (cycleCount < cyclesToCheck || (!foundFullWeekend && count < 20)) {
			count++
			const workStart = currentDate

			let workStartTime = currentDate

			// 工作4天
			const workEnd = this.getDateAfterDays(
				workStart,
				this.workDaysPerCycle - 1
			)

			const workeTimes: Map<string, { start: string; end: string }> = new Map()
			let index = 1
			while (workStartTime.isBefore(workEnd)) {
				const workeTime = workStartTime.add(2, "hours")
				workeTimes.set(workStartTime.format("YYYY-MM-DD HH:mm"), {
					start: workStartTime.format("HH:mm"),
					end: workeTime.format("HH:mm"),
				})
				workStartTime = workeTime.add(index % 3 === 0 ? 8 : 6, "hours")
				index++
			}
			console.log("workeTimes", workeTimes)

			// 休息2天
			const restStart = this.getDateAfterDays(workEnd, 0)
			const restEnd = this.getDateAfterDays(restStart, this.restDaysPerCycle)

			// 检查休息日是否包含周末
			const restDays: string[] = []
			let weekendOverlap = 0
			for (let d = restStart; d.isBefore(restEnd.add(1)); d = d.add(1, "day")) {
				restDays.push(this.formatDate(d))
				if (d.day() === 0 || d.day() === 5) {
					weekendOverlap++
				}
			}

			// 记录结果
			const result: ShiftResult = {
				cycle: cycleCount + 1,
				workPeriod: `${this.formatDate(workStart)} 至 ${this.formatDate(
					workEnd
				)}`,
				restPeriod: `${this.formatDate(restStart)} 至 ${this.formatDate(
					restEnd
				)}`,
				restDays,
				weekendOverlap,
				isFullWeekend:
					weekendOverlap === 2 && restStart.day() === 5 && restEnd.day() === 0,
				month: dayjs(workStart).month() + 1,
				year: dayjs(workStart).year(),
				workeTimes,
			}

			results.push(result)

			if (result.isFullWeekend && !foundFullWeekend) {
				foundFullWeekend = true
				if (cycleCount > cyclesToCheck - 3) {
					cyclesToCheck = cycleCount + 2
				}
			}

			// 移动到下一个周期
			currentDate = this.getDateAfterDays(restEnd, 0)
			cycleCount++
		}

		return results
	}
}
