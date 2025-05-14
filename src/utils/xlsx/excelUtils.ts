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
export const generateExcelForWeapp = async (
	data: ExcelData,
	fileName: string = "export"
) => {
	try {
		const buffer = baseDealXls.generateXlsxBuffer(data)
		// 获取可写入的文件路径
		const fs = Taro.getFileSystemManager()
		const filePath = `${Taro.env.USER_DATA_PATH}/${fileName}.xlsx`
		fs.writeFileSync(filePath, buffer)
		fs.saveFile({
			tempFilePath: filePath,
			success: res => {
				console.log("保存成功", res)
				Taro.showModal({
					title: "提示",
					content: "文件已保存到本地，是否要打开?",
					showCancel: false,
					success: modalRes => {
						if (modalRes.confirm) {
							Taro.openDocument({
								filePath: res.savedFilePath,
								fileType: "xlsx",
								showMenu: true,
							})
						}
					},
				})
			},
			fail: err => {
				console.error("保存失败", err)
			},
		})
	} catch (error) {
		console.error("导出失败", error)
	}
}

/**
 * 在 H5 环境下生成并下载 Excel 文件
 * @param data 要导出的数据
 * @param fileName 文件名（不包含扩展名）
 */
export const generateAndDownloadExcel = (
	data: ExcelData,
	fileName: string = "export"
) => {
	try {
		const blob = baseDealXls.generateXlsxBlob(data)
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
