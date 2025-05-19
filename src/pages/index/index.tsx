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
			const { month } = item
			const key = `${month}月`
			if (!acc[key]) {
				acc[key] = []
			}
			acc[key].push({
				周期: item.cycle,
				工作时间: item.workPeriod,
				休息时间: item.restPeriod,
				休息天数: item.restDays,
				周末重叠: item.weekendOverlap,
				是否全周末: item.isFullWeekend,
			})
			return acc
		}, {})

		exportExcel(data, "小唐的排班表")
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
