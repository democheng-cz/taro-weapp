import * as XLSX from "xlsx"
import Taro from "@tarojs/taro"

interface ExcelData {
	[key: string]: any[]
}

/**
 * 生成并下载 Excel 文件
 * @param data 要导出的数据
 * @param fileName 文件名（不包含扩展名）
 */
export const generateAndDownloadExcel = (
	data: ExcelData,
	fileName: string = "export"
) => {
	// 创建工作簿
	const wb = XLSX.utils.book_new()

	// 将数据转换为工作表
	Object.entries(data).forEach(([sheetName, sheetData]) => {
		const ws = XLSX.utils.json_to_sheet(sheetData)
		XLSX.utils.book_append_sheet(wb, ws, sheetName)
	})

	console.log("wb", wb)
	// 生成二进制数据
	const wbout = XLSX.write(wb, {
		bookType: "xlsx",
		type: "binary",
	})

	// 转换为 Blob
	const blob = new Blob([s2ab(wbout)], {
		type: "application/octet-stream",
	})

	// 在小程序环境中
	if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
		const fs = Taro.getFileSystemManager()
		const filePath = `${Taro.env.USER_DATA_PATH}/${fileName}.xlsx`

		// 写入文件
		fs.writeFileSync(filePath, wbout, "binary")

		// 保存文件
		Taro.saveFile({
			tempFilePath: filePath,
			success: function (res) {
				Taro.openDocument({
					filePath: res.savedFilePath,
					showMenu: true,
					success: function () {
						console.log("打开文档成功")
					},
				})
			},
		})
	} else {
		// 在 H5 环境中
		const url = URL.createObjectURL(blob)
		const link = document.createElement("a")
		link.href = url
		link.download = `${fileName}.xlsx`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)
	}
}

// 字符串转 ArrayBuffer
function s2ab(s: string) {
	const buf = new ArrayBuffer(s.length)
	const view = new Uint8Array(buf)
	for (let i = 0; i < s.length; i++) {
		view[i] = s.charCodeAt(i) & 0xff
	}
	return buf
}
