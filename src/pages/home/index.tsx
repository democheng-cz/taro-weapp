import React from "react"
import Taro from "@tarojs/taro"
import "./index.scss"
import { View } from "@tarojs/components"

const Home: React.FC = () => {
	const functionalItems = [
		{
			icon: "https://ai-public.mastergo.com/ai/img_res/ef385b237df82bd1fcde492b0f5dc1f2.jpg",
			text: "排班计算",
			path: "/pages/calculateShift/index",
		},
		{
			icon: "https://ai-public.mastergo.com/ai/img_res/25ee17b7e93d030e350e09644aefec64.jpg",
			text: "健康监测",
		},
		{
			icon: "https://ai-public.mastergo.com/ai/img_res/e01fdda13082dcc442bd20969bf800d8.jpg",
			text: "智慧支付",
		},
		{
			icon: "https://ai-public.mastergo.com/ai/img_res/bc6f35a16ef9d6f9b68a898cd807865c.jpg",
			text: "智慧出行",
		},
	]

	const recommendItems = [
		{
			title: "智能家居套装",
			desc: "一键控制全屋智能设备",
			image:
				"https://ai-public.mastergo.com/ai/img_res/92247e8051d11cd33fa6ab855e838368.jpg",
		},
		{
			title: "健康检测服务",
			desc: "24小时健康数据监测",
			image:
				"https://ai-public.mastergo.com/ai/img_res/ae9ba7a2dddaba2d3dc46463a08b26fd.jpg",
		},
	]

	// 跳转
	const handleClickNavigete = (path?: string) => {
		path &&
			Taro.navigateTo({
				url: path,
			})
	}

	return (
		<View className="relative w-full min-h-screen bg-white">
			{/* 主要内容区域 */}
			<View className="pt-4">
				{/* Banner图 */}
				<View className="px-4 mb-6">
					<View className="relative w-full h-[160px] rounded-lg overflow-hidden">
						<img
							src="https://ai-public.mastergo.com/ai/img_res/483371fe89945c977e6605c9b072ff99.jpg"
							alt="banner"
							className="w-full h-full object-cover"
						/>
					</View>
				</View>

				{/* 功能区域 */}
				<View className="px-4 mb-8">
					<View className="grid grid-cols-4 gap-4">
						{functionalItems.map((item, index) => (
							<View
								key={index}
								className="flex flex-col items-center"
								onClick={() => handleClickNavigete(item.path)}
							>
								<View className="w-16 h-16 rounded-full overflow-hidden mb-2">
									<img
										src={item.icon}
										alt={item.text}
										className="w-full h-full object-cover"
									/>
								</View>
								<span className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
									{item.text}
								</span>
							</View>
						))}
					</View>
				</View>

				{/* 推荐服务 */}
				<View className="px-4">
					<h2 className="text-lg font-medium mb-4">推荐服务</h2>
					<View className="space-y-4">
						{recommendItems.map((item, index) => (
							<View
								key={index}
								className="bg-white rounded-lg shadow-sm overflow-hidden"
							>
								<View className="h-[160px] overflow-hidden">
									<img
										src={item.image}
										alt={item.title}
										className="w-full h-full object-cover"
									/>
								</View>
								<View className="p-4">
									<h3 className="text-base font-medium mb-1">{item.title}</h3>
									<p className="text-sm text-gray-500">{item.desc}</p>
								</View>
							</View>
						))}
					</View>
				</View>
			</View>
		</View>
	)
}

export default Home
