import Taro from "@tarojs/taro"
import BaseDealXls from "./BaseDealXls"
interface ExcelData {
	[key: string]: any[]
}

const baseDealXls = new BaseDealXls()

/**
 * 在微信小程序环境下生成并保存 Excel 文件
 * @param data 要导出的数据
 * @param fileName 文件名（不包含扩展名）
 */
async function generateExcelForWeapp(data, fileName) {
	try {
		const buffer = (await baseDealXls.generateXlsxBuffer(data)) as Uint8Array
		// 获取可写入的文件路径
		const fs = Taro.getFileSystemManager()
		const filePath = `${Taro.env.USER_DATA_PATH}/${fileName}.xlsx`

		// 写入文件
		fs.writeFileSync(filePath, buffer.buffer)

		// 获取系统信息
		const systemInfo = await Taro.getSystemInfo()

		// iOS特殊处理
		if (systemInfo.platform === "ios") {
			const { confirm } = await Taro.showModal({
				title: "提示",
				content: "文件已保存，是否立即打开？",
				showCancel: true,
			})

			if (!confirm) return
		}

		// 打开文档
		await Taro.openDocument({
			filePath: filePath,
			fileType: "xlsx",
			showMenu: true,
		})

		Taro.showToast({
			title: "文件打开成功",
			icon: "success",
		})
	} catch (error) {
		console.error("文件操作失败:", error)
		Taro.showToast({
			title: "操作失败: " + (error.errMsg || error.message),
			icon: "none",
			duration: 3000,
		})
	}
}

/**
 * 在 H5 环境下生成并下载 Excel 文件
 * @param data 要导出的数据
 * @param fileName 文件名（不包含扩展名）
 */
export const generateAndDownloadExcel = async (
	data: ExcelData,
	fileName: string = "export"
) => {
	try {
		console.log("data", data)
		const blob = await baseDealXls.generateXlsxBlob(data)
		console.log("blob", blob)
		// H5环境下直接下载
		const url = URL.createObjectURL(blob)
		const link = document.createElement("a")
		link.href = url
		link.download = `${fileName}.xlsx`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)
	} catch (error) {
		console.error("导出失败", error)
	}
}

/**
 * 根据环境自动选择合适的导出方法
 * @param data 要导出的数据
 * @param fileName 文件名（不包含扩展名）
 */
export const exportExcel = (data: ExcelData, fileName?: string) => {
	console.log("process", process.env.TARO_ENV)
	if (process.env.TARO_ENV === "weapp") {
		return generateExcelForWeapp(data, fileName)
	} else {
		return generateAndDownloadExcel(data, fileName)
	}
}
