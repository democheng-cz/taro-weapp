import * as XLSX from "xlsx"
import Taro from "@tarojs/taro"
interface ExcelData {
	[key: string]: any[]
}

class BaseDealXls {
	private wb: XLSX.WorkBook
	private data: ExcelData
	constructor() {
		this.wb = XLSX.utils.book_new()
	}
	dealData(): void {
		// 将数据转换为工作表
		Object.entries(this.data).forEach(([sheetName, sheetData]) => {
			const ws = XLSX.utils.json_to_sheet(sheetData)
			XLSX.utils.book_append_sheet(this.wb, ws, sheetName)
		})
	}

	// 写入文件
	writeFileToBase64(type: "base64" | "binary" = "base64"): string {
		const wbout = XLSX.write(this.wb, {
			bookType: "xlsx",
			type,
		})
		return wbout
	}

	// 生成xlsx文件的buffer
	generateXlsxBuffer(data: ExcelData): ArrayBuffer {
		this.data = data
		this.dealData()
		const wbout = this.writeFileToBase64()
		this.clearData()
		return this.toArrayBuffer(wbout)
	}

	// 生成xlsx文件的blob
	generateXlsxBlob(data: ExcelData): Blob {
		this.data = data
		this.dealData()
		const wbout = this.writeFileToBase64()
		const buffer = this.toArrayBuffer(wbout)
		this.clearData()
		return new Blob([buffer], { type: "application/octet-stream" })
	}

	// 清除数据
	clearData(): void {
		this.data = {}
		this.wb = XLSX.utils.book_new()
	}

	// 将字符串转换为 ArrayBuffer
	toArrayBuffer(str: string): ArrayBuffer {
		return Taro.base64ToArrayBuffer(str)
	}
}

export default BaseDealXls
