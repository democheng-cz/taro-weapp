export default defineAppConfig({
	pages: ["pages/index/index", "pages/my/index", "pages/functional/index"],
	tabBar: {
		color: "#000000",
		position: "bottom",
		selectedColor: "#339AF0",
		backgroundColor: "#ffffff",
		list: [
			{
				pagePath: "pages/index/index",
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
