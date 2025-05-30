import { useState } from "react"
import dayjs from "dayjs"
import type { PickerOption } from "@nutui/nutui-react-taro"

interface UseDateTimePickerProps {
	startDate?: Date
	endDate?: Date
	initValue?: Date
}

export const useDateTimePicker = (options?: UseDateTimePickerProps) => {
	const { startDate, endDate, initValue } = options || {}
	// 当前时间的五年前
	const start = startDate || dayjs().subtract(5, "year").toDate()
	// 当前时间的五年后
	const end = endDate || dayjs().add(5, "year").toDate()

	// 选择的开始上班时间描述
	const [value, setValue] = useState(initValue || new Date())
	// 选择的开始上班时间描述
	// 选择开始上班时间
	const confirmSelectDate = (values: PickerOption[]) => {
		const date = values
			.slice(0, 3)
			.map(value => value.value)
			.join("-")
		const time = values
			.slice(3)
			.map(value => value.value)
			.join(":")
		const dateTime = dayjs(`${date} ${time}`)
		setValue(dateTime.toDate())
	}

	return {
		value,
		start,
		end,
		confirmSelectDate,
	}
}
