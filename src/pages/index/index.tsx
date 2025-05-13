import type { PickerOption } from "@nutui/nutui-react-taro/dist/types/index"
import { useState } from "react"
import { DatePicker, Cell } from "@nutui/nutui-react-taro"
import "./index.scss"
import { ShiftCalculator } from "@/utils/shiftCalculactor"
import { generateAndDownloadExcel } from "@/utils/xlsx/excelUtils"
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
		console.log(result)

		const data = [
			{
				cycle: "周期",
				workPeriod: "工作时间",
				restPeriod: "休息时间",
				restDays: "休息天数",
				weekendOverlap: "周末重叠",
				isFullWeekend: "是否全周末",
			},
			...result.map(item => ({
				cycle: item.cycle,
				workPeriod: item.workPeriod,
				restPeriod: item.restPeriod,
				restDays: item.restDays,
				weekendOverlap: item.weekendOverlap,
				isFullWeekend: item.isFullWeekend,
			})),
		]
		generateAndDownloadExcel(data, "测试数据")
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
