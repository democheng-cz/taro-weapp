import { View } from "@tarojs/components"
import { Image, ConfigProvider, Cell } from "@nutui/nutui-react-taro"
import "./index.scss"

function Index() {
	return (
		<ConfigProvider>
			<View className="nutui-react-demo">
				<Image src="https://storage.360buyimg.com/imgtools/e067cd5b69-07c864c0-dd02-11ed-8b2c-d7f58b17086a.png" />
				<view className="text-red-500 font-bold">process.env</view>
				<Cell.Group>
					<Cell className="text-red-500">process.env</Cell>
					<Cell>NODE_ENV={process.env.NODE_ENV}</Cell>
					<Cell>TARO_ENV={process.env.TARO_ENV}</Cell>
					<Cell>TARO_APP_NAME={process.env.TARO_APP_NAME}</Cell>
					<Cell>TARO_APP_ENCRYPT={process.env.TARO_APP_ENCRYPT}</Cell>
					<Cell>TARO_APP_API={process.env.TARO_APP_API}</Cell>
				</Cell.Group>
			</View>
		</ConfigProvider>
	)
}

export default Index
