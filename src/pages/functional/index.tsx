// 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果

import React, { useState, useEffect } from "react"
import {
	ConfigProvider,
	Input,
	Cell,
	Button,
	Loading,
} from "@nutui/nutui-react-taro"
import Taro, { useDidShow, useDidHide } from "@tarojs/taro"

type ClockForCattleAndHorses = {
	salary: string
	hours: string
	workDays: string
	isRunning: boolean
	earnings: number
	startTime: number | null
}
const ClockForCattleAndHorses: React.FC = () => {
	// 薪资
	const [salary, setSalary] = useState<string>("")
	// 每月工作天数
	const [workDays, setWorkDays] = useState<string>("21.75")
	// 工时
	const [hours, setHours] = useState<string>("")
	// 今日已赚取
	const [earnings, setEarnings] = useState<number>(0)
	// 是否正在计时
	const [isRunning, setIsRunning] = useState<boolean>(false)
	// 开始计时时间
	const [startTime, setStartTime] = useState<number | null>(null)

	useEffect(() => {
		let timer: NodeJS.Timeout
		if (isRunning && startTime) {
			timer = setInterval(() => {
				const hourlyRate = Number(salary) / (Number(workDays) * Number(hours))
				const elapsedHours = (Date.now() - startTime) / (1000 * 60 * 60)
				computedEarnings(hourlyRate * elapsedHours)
			}, 1000)
		}
		return () => clearInterval(timer)
	}, [isRunning, startTime])

	// 计算实时薪资
	const computedEarnings = (currentSalary: number) => {
		const totalEarnings = Number(earnings) + currentSalary
		setEarnings(totalEarnings)
	}

	// 组件显示
	useDidShow(() => {
		const clockForCattleAndHorses: ClockForCattleAndHorses =
			Taro.getStorageSync("clockForCattleAndHorses")
		if (clockForCattleAndHorses) {
			setSalary(clockForCattleAndHorses.salary)
			setHours(clockForCattleAndHorses.hours)
			setWorkDays(clockForCattleAndHorses.workDays)
			setIsRunning(clockForCattleAndHorses.isRunning)
			setStartTime(clockForCattleAndHorses.startTime)
			setEarnings(clockForCattleAndHorses.earnings)
		}
	})

	// 组件隐藏
	useDidHide(() => {
		handleDestroy()
	})

	const handleStart = () => {
		if (!salary || !hours) return
		setIsRunning(true)
		setStartTime(Date.now())
	}

	const handleReset = () => {
		setIsRunning(false)
		setStartTime(null)
		setEarnings(0)
	}

	// 暂停计时
	const handlePause = () => {
		setIsRunning(false)
	}

	// 销毁组件要做的事
	const handleDestroy = () => {
		Taro.setStorageSync("clockForCattleAndHorses", {
			salary,
			hours,
			workDays,
			isRunning,
			startTime: Date.now(),
			earnings,
		})
	}

	return (
		<ConfigProvider
			theme={{
				"--nutui-input-border-bottom-width": "1px",
				"--nutui-input-background-color": "#f9fafb",
				"--nutui-input-border-radius": "10px",
			}}
		>
			<Cell className=" bg-gray-50 flex flex-col items-center w-full ">
				<div className="font-bold text-center  box-border text-gray-800 w-full">
					牛马时钟
				</div>

				<div className="bg-white rounded-xl shadow-lg p-3 mb-3 w-full box-border">
					<div>
						<div className="flex items-center mb-1">
							{/* <DollarCircleOutlined className="text-gray-500 mr-2" /> */}
							<span className="text-gray-700 ">月薪（元）</span>
						</div>
						<Input
							type="number"
							value={salary}
							onChange={val => setSalary(val)}
							placeholder="请输入月薪"
							disabled={isRunning}
						/>
					</div>

					<div className="my-2">
						<div className="flex items-center mb-1">
							{/* <ClockCircleOutlined className="text-gray-500 mr-2" /> */}
							<span className="text-gray-700">每日工作时长（小时）</span>
						</div>
						<Input
							type="number"
							value={hours}
							onChange={val => setHours(val)}
							placeholder="请输入工作时长"
							className="!rounded-button"
							disabled={isRunning}
						/>
					</div>
					<div>
						<div className="flex items-center mb-1">
							{/* <ClockCircleOutlined className="text-gray-500 mr-2" /> */}
							<span className="text-gray-700">每月工作天数</span>
						</div>
						<Input
							type="number"
							value={workDays}
							onChange={val => setWorkDays(val)}
							placeholder="请输入工作天数"
							className="!rounded-button"
							disabled={isRunning}
						/>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-lg p-3 mb-3 w-full box-border">
					<div className="text-center mb-4">
						<div className="text-gray-500 mb-2">今日已赚取</div>
						{earnings || earnings === 0 ? (
							<div className="text-4xl font-bold text-blue-600">
								¥ {earnings.toFixed(2)}
							</div>
						) : (
							<Loading> </Loading>
						)}
					</div>
				</div>

				<div className="flex w-full justify-around">
					{isRunning ? (
						<Button type="info" size="normal" onClick={handlePause}>
							暂停计时
						</Button>
					) : (
						<Button type="info" size="normal" onClick={handleStart}>
							开始计时
						</Button>
					)}
					<Button type="danger" size="normal" onClick={handleReset}>
						重置计时
					</Button>
				</div>
			</Cell>
		</ConfigProvider>
	)
}

export default ClockForCattleAndHorses
