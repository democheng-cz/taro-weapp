import type { PickerOption } from "@nutui/nutui-react-taro"
import { useState } from "react"
import { DatePicker, Cell } from "@nutui/nutui-react-taro"
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
	const confirm = (values: PickerOption[]) => {
		const date = values
			.slice(0, 3)
			.map(value => value.value)
			.join("-")
		const time = values
			.slice(3)
			.map(value => value.value)
			.join(":")
		const dateTime = dayjs(`${date} ${time}`)
		const result = shiftCalculator.calculateOverlap(
			dateTime.format("YYYY-MM-DD HH:mm:ss"),
			20
		)

		const data = result.reduce((acc, item) => {
			const { month } = item
			if (!acc[month]) {
				acc[month + "月"] = []
			}
			acc[month].push({
				周期: item.cycle,
				工作时间: item.workPeriod,
				休息时间: item.restPeriod,
				休息天数: item.restDays,
				周末重叠: item.weekendOverlap,
				是否全周末: item.isFullWeekend,
			})
			return acc
		}, {})

		exportExcel(data, "测试数据5")
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
				onConfirm={values => confirm(values)}
			/>
		</>
	)
}

export default Index
