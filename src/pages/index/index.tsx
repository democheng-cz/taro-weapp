import { useState } from "react"
import { DatePicker, Cell, Input, Button } from "@nutui/nutui-react-taro"
import "./index.scss"
import { ShiftCalculator } from "@/utils/shiftCalculactor"
import { exportExcel } from "@/utils/xlsx/excelUtils"
import dayjs from "dayjs"
import { useDateTimePicker } from "@/hooks"

const shiftCalculator = new ShiftCalculator()
function Index() {
	// 是否显示日期选择
	const [show, setShow] = useState(false)
	// 用于日期时间选择器的hook
	const {
		value: startTime,
		confirmSelectDate,
		start: startDate,
		end: endDate,
	} = useDateTimePicker()
	// 输入的周期
	const [cycle, setCycle] = useState("10")
	// 周期输入框改变
	const handleChangeCycle = (val: string) => {
		// 如果输入的不是正整数
		if (/^\d+$/.test(val) || val === "") {
			setCycle(val)
		}
	}

	// 是否正在计算
	const [isLoading, setIsLoading] = useState(false)

	// 每日工作时间段
	const dayWorkTimes = [
		"00:00-02:00",
		"02:00-04:00",
		"04:00-06:00",
		"06:00-08:00",
		"08:00-10:00",
		"10:00-12:00",
		"12:00-14:00",
		"14:00-16:00",
		"16:00-18:00",
		"18:00-20:00",
		"20:00-22:00",
		"22:00-00:00",
	]

	// 计算并下载数据
	const handleComputed = async () => {
		try {
			setIsLoading(true)
			const result = shiftCalculator.calculateOverlap(
				dayjs(startTime).format("YYYY-MM-DD HH:mm:ss"),
				Number(cycle)
			)
			console.log("result", result)
			const data = result.reduce((acc, item) => {
				const { month, year } = item
				const key = `${year}年-${month}月`
				if (!acc[key]) {
					acc[key] = []
				}
				acc[key].push({
					周期: item.cycle,
					工作时间: item.workPeriod,
					休息时间: item.restPeriod,
					周末重叠数: item.weekendOverlap,
					是否全周末: item.isFullWeekend ? "是" : "否",
				})
				return acc
			}, {})

			// 生成有具体时间的排班表
			const data2 = result.reduce((acc, item) => {
				const { workeTimes, month, year, resetTimes } = item
				const key = `${year}年-${month}月`
				if (!acc[key]) {
					acc[key] = []
				}
				Array.from(workeTimes.entries()).forEach(([dayKey, value]) => {
					let dKey = dayjs(dayKey)
					let key2 = `${dKey.year()}年-${dKey.month() + 1}月`
					if (!acc[key2]) {
						dKey = dKey.add(1, "month")
						key2 = `${dKey.year()}年-${dKey.month()}月`
						acc[key2] = []
					}

					const findItem = acc[key2]?.find(
						item => item.日期 === dKey.format("DD")
					)
					if (findItem) {
						const key = `${value.start}-${value.end}`
						if (key === "14:00-16:00") {
							findItem[key] = "放假"
						} else findItem[`${value.start}-${value.end}`] = `上班`
					} else {
						const map = dayWorkTimes.reduce((prev, curr) => {
							if (curr === `${value.start}-${value.end}`) {
								prev.set(curr, `${value.start}-${value.end}`)
							}
							return prev
						}, new Map())
						let res = {}
						for (const [key, value] of map.entries()) {
							res[key] = value
						}
						acc[key2].push({
							日期: dKey.format("DD"),
							...dayWorkTimes.reduce((prev, curr) => {
								return {
									...prev,
									[curr]: res[curr]
										? curr === "14:00-16:00"
											? "放假"
											: "上班"
										: "",
								}
							}, {}),
						})
					}
				})

				Object.values(resetTimes).forEach(val => {
					acc[key].push(val)
				})

				return acc
			}, {})

			// 生成放假休息时间与上班时间包含在同一张日期表中
			const data3 = result.reduce((acc, item) => {
				const { fullTimes, month, year, workeTimes, resetTimes } = item
				const key = `${year}年-${month}月`
				if (!acc[key]) {
					acc[key] = []
				}
				fullTimes.forEach(time => {
					let dKey = dayjs(time)
					let key2 = `${dKey.year()}年-${dKey.month() + 1}月`
					if (!acc[key2]) {
						dKey = dKey.add(1, "month")
						key2 = `${dKey.year()}年-${dKey.month()}月`
						acc[key2] = []
					}
					const findItem = acc[key2]?.find(
						item => item.日期 === dKey.format("DD")
					)
					if (!findItem) {
						acc[key2].push({
							日期: dKey.format("DD"),
						})
					}
				})
				Array.from(workeTimes.entries()).forEach(([key, value]) => {
					const workeDayObj = dayjs(key)
					const { start, end } = value
					const workeKey = `${workeDayObj.year()}年-${
						workeDayObj.month() + 1
					}月`
					const findItem = acc[workeKey]?.find(
						item => item.日期 === workeDayObj.format("DD")
					)
					if (findItem) {
						dayWorkTimes.forEach(workTime => {
							findItem[workTime] =
								workTime === `${start}-${end}`
									? workTime === "14:00-16:00"
										? "放假"
										: "上班"
									: findItem[workTime] || ""
						})
					}
				})

				resetTimes.forEach((value, index) => {
					const resetDayObj = dayjs(value)
					const resetKey = `${resetDayObj.year()}年-${
						resetDayObj.month() + 1
					}月`
					const findItem = acc[resetKey]?.find(
						item => item.日期 === resetDayObj.format("DD")
					)

					dayWorkTimes.forEach(workTime => {
						const [, endTime] = workTime.split("-") // 使用更有意义的变量名
						const currentDate = resetDayObj.format("YYYY-MM-DD") // 预格式化日期部分

						// 创建比较日期对象
						const workEndDateTime =
							workTime === "22:00-00:00"
								? dayjs(`${currentDate} ${endTime}`).add(1, "day")
								: dayjs(`${currentDate} ${endTime}`)
						const newResetDatObj =
							index === 1 ? resetDayObj.add(1, "day") : resetDayObj
						const isBeforeReset =
							index === 0
								? !newResetDatObj.isAfter(workEndDateTime)
								: !newResetDatObj.isBefore(workEndDateTime)
						findItem[workTime] =
							findItem[workTime] || (isBeforeReset ? "休息" : "")
					})
				})

				return acc
			}, {})
			console.log("data2", data, data2, data3)
			// return
			// 等待5秒
			await new Promise(resolve => setTimeout(resolve, 3000))
			await exportExcel(data3, "小唐的排班表")
		} catch (error) {
			console.log("error", error)
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<>
			<Cell
				title="请选择开始上班时间"
				description={dayjs(startTime).format("YYYY-MM-DD HH:mm:ss")}
				onClick={() => setShow(true)}
			/>
			<DatePicker
				startDate={startDate}
				endDate={endDate}
				visible={show}
				value={startTime}
				type="datetime"
				onClose={() => setShow(false)}
				onConfirm={values => confirmSelectDate(values)}
			/>
			<Cell className="bg-slate-400">
				<Input
					value={cycle}
					type="number"
					placeholder="请输入周期"
					onChange={e => handleChangeCycle(e)}
				/>
				<Button
					type="info"
					loading={isLoading}
					onClick={() => handleComputed()}
				>
					开始计算
				</Button>
			</Cell>
		</>
	)
}

export default Index
