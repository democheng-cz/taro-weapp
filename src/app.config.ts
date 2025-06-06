export default defineAppConfig({
	pages: [
		"pages/home/index",
		"pages/my/index",
		"pages/functional/index",
		"pages/calculateShift/index",
	],
	tabBar: {
		color: "#000000",
		position: "bottom",
		selectedColor: "#339AF0",
		backgroundColor: "#ffffff",
		list: [
			{
				pagePath: "pages/home/index",
				text: "首页",
				iconPath: "assets/images/tab-icons/home.png",
				selectedIconPath: "assets/images/tab-icons/home-fill.png",
			},
			{
				pagePath: "pages/functional/index",
				text: "功能",
				iconPath: "assets/images/tab-icons/functionality.png",
				selectedIconPath: "assets/images/tab-icons/functionality-fill.png",
			},
			{
				pagePath: "pages/my/index",
				text: "我的",
				iconPath: "assets/images/tab-icons/my.png",
				selectedIconPath: "assets/images/tab-icons/my-fill.png",
			},
		],
	},
	window: {
		backgroundColor: "#b3b3b3",
		backgroundTextStyle: "light",
		navigationBarBackgroundColor: "#339AF0",
		navigationBarTitleText: "WeChat",
		navigationBarTextStyle: "black",
	},
})
