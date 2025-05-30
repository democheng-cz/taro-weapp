import type { PickerOption } from "@nutui/nutui-react-taro"
import { useState } from "react"
import { DatePicker, Cell, Input, Button } from "@nutui/nutui-react-taro"
import "./index.scss"
import { ShiftCalculator } from "@/utils/shiftCalculactor"
import { exportExcel } from "@/utils/xlsx/excelUtils"
import dayjs from "dayjs"

const shiftCalculator = new ShiftCalculator()
function Index() {
	const [show, setShow] = useState(false)
	const startDate = new Date(2000, 1, 1)
	const endDate = new Date(2100, 12, 31)
	const defaultValue = new Date()
	const handleConfirmSelectDate = (values: PickerOption[]) => {
		const date = values
			.slice(0, 3)
			.map(value => value.value)
			.join("-")
		const time = values
			.slice(3)
			.map(value => value.value)
			.join(":")
		const dateTime = dayjs(`${date} ${time}`)
		setStartTime(dateTime.format("YYYY-MM-DD HH:mm:ss"))
	}

	// cycle
	const [cycle, setCycle] = useState("10")
	const [startTime, setStartTime] = useState("")

	// 计算并下载数据
	const handleComputed = () => {
		const result = shiftCalculator.calculateOverlap(startTime, Number(cycle))

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
			const { workeTimes, month, year } = item
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
				const findItem = acc[key2]?.find(
					item => item.日期 === dKey.format("DD")
				)
				if (findItem) {
					findItem[`${value.start}-${value.end}`] = `上班`
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
								[curr]: res[curr] ? "上班" : "",
							}
						}, {}),
					})
				}
			})
			return acc
		}, {})

		console.log("data2", data, data2)
		// return
		exportExcel(data2, "小唐的排班表")
	}
	return (
		<>
			<Cell title="日期时间选择" onClick={() => setShow(true)} />
			<DatePicker
				title="日期时间选择"
				startDate={startDate}
				endDate={endDate}
				defaultValue={defaultValue}
				visible={show}
				type="datetime"
				onClose={() => setShow(false)}
				onConfirm={values => handleConfirmSelectDate(values)}
			/>
			<Cell className="bg-slate-400">
				<Input
					value={cycle}
					type="number"
					placeholder="请输入数字"
					onChange={e => setCycle(e)}
				/>
				<Button type="info" onClick={() => handleComputed()}>
					开始计算
				</Button>
			</Cell>
		</>
	)
}

export default Index
