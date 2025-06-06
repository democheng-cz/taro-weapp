import * as XLSX from "xlsx"
import Taro from "@tarojs/taro"
import ExcelJs from "exceljs"
interface ExcelData {
	[key: string]: any[]
}

class BaseDealXls {
	private wb: ExcelJs.Workbook
	private data: ExcelData
	constructor() {
		this.wb = new ExcelJs.Workbook()
	}
	dealData(): void {
		this.wb = new ExcelJs.Workbook()
		Object.entries(this.data).forEach(([sheetName, sheetData]) => {
			const sheet = this.wb.addWorksheet(sheetName)

			// 确保数据是简单的字符串或数字，并记录需要填充的单元格
			const processedData = sheetData.map(row =>
				Object.entries(row).reduce((acc, [key, value]) => {
					const processedValue =
						typeof value === "object" ? String(value) : value
					return {
						...acc,
						[key]: processedValue,
					}
				}, {})
			)

			// 添加列，使用可爱的列宽
			if (processedData.length > 0) {
				sheet.columns = Object.keys(processedData[0]).map(key => ({
					header: key,
					key: key,
					width: 16, // 加宽列宽，让内容更舒适
				}))
			}
			// 添加数据并设置可爱风格
			processedData.forEach((row, rowIndex) => {
				const excelRow = sheet.addRow(row)
				// 为每个单元格设置可爱风格
				Object.entries(row).forEach(([key, value], colIndex) => {
					const cell = excelRow.getCell(colIndex + 1)
					console.log("cell", cell)
					// 设置字体
					cell.font = {
						name: "微软雅黑",
						size: 11,
						color: { argb: "FF666666" }, // 柔和的深灰色
					}

					// 如果单元格有值，设置可爱的填充色
					if (value && String(value).trim() !== "") {
						if (value === "上班") {
							// 上班用温柔的粉色
							cell.fill = {
								type: "pattern",
								pattern: "solid",
								fgColor: { argb: "FFFFD1DC" }, // 温柔粉色
							}
						} else if (value === "放假") {
							// 放假用薄荷绿色
							cell.fill = {
								type: "pattern",
								pattern: "solid",
								fgColor: { argb: "FFE0F5E6" }, // 清新的薄荷绿色
							}
						} else if (value === "休息") {
							// 休息用天空蓝
							cell.fill = {
								type: "pattern",
								pattern: "solid",
								fgColor: { argb: "FFE6F3FF" }, // 清新的天空蓝
							}
							// 设置一个零宽字符, 避免空单元格的值为空，在下方交替行中被重置背景色
							cell.value = "\u200B"
						} else {
							// 其他内容用更浅的粉色
							cell.fill = {
								type: "pattern",
								pattern: "solid",
								fgColor: { argb: "FFFFF0F5" }, // 浅粉色
							}
						}
					}

					// 设置可爱的边框
					cell.border = {
						top: {
							style: "thin",
							color: { argb: "FFFFC0CB" }, // 粉红色边框
						},
						left: {
							style: "thin",
							color: { argb: "FFFFC0CB" },
						},
						bottom: {
							style: "thin",
							color: { argb: "FFFFC0CB" },
						},
						right: {
							style: "thin",
							color: { argb: "FFFFC0CB" },
						},
					}

					// 设置居中对齐
					cell.alignment = {
						vertical: "middle",
						horizontal: "center",
						wrapText: true, // 允许文本换行
					}
				})

				// 设置行高，让内容更舒适
				excelRow.height = 25
			})

			// 设置表头可爱风格
			const headerRow = sheet.getRow(1)
			headerRow.height = 30 // 表头行高
			headerRow.eachCell(cell => {
				// 表头使用渐变粉色
				cell.fill = {
					type: "pattern",
					pattern: "solid",
					fgColor: { argb: "FFFF9999" }, // 可爱的珊瑚粉
				}

				// 表头字体
				cell.font = {
					name: "微软雅黑",
					bold: true,
					size: 12,
					color: { argb: "FFFFFFFF" }, // 白色
				}

				// 表头边框
				cell.border = {
					top: {
						style: "medium",
						color: { argb: "FFFF80AB" }, // 深一点的粉色
					},
					left: {
						style: "medium",
						color: { argb: "FFFF80AB" },
					},
					bottom: {
						style: "medium",
						color: { argb: "FFFF80AB" },
					},
					right: {
						style: "medium",
						color: { argb: "FFFF80AB" },
					},
				}

				// 表头对齐
				cell.alignment = {
					vertical: "middle",
					horizontal: "center",
				}
			})

			// 设置交替行颜色，增加可读性
			processedData.forEach((_, index) => {
				if ((index + 1) % 2 === 0) {
					// 偶数行
					const row = sheet.getRow(index + 2) // +2 因为表头占据第一行
					row.eachCell(cell => {
						if (!cell.value) {
							// 只为空单元格设置背景色
							cell.fill = {
								type: "pattern",
								pattern: "solid",
								fgColor: { argb: "FFFFF5F5" }, // 非常浅的粉色
							}
						}
					})
				}
			})

			// 冻结表头
			sheet.views = [
				{
					state: "frozen",
					xSplit: 0,
					ySplit: 1,
					topLeftCell: "A2",
					// activeCell: "A2",
				},
			]
		})

		return
	}

	// 生成xlsx文件的buffer
	async generateXlsxBuffer(data: ExcelData): Promise<ExcelJs.Buffer> {
		this.data = data
		this.dealData()
		return await this.wb.xlsx.writeBuffer()
	}

	// 生成xlsx文件的blob
	async generateXlsxBlob(data: ExcelData): Promise<Blob> {
		const buffer = await this.generateXlsxBuffer(data)
		return new Blob([buffer], { type: "application/octet-stream" })
	}

	// 清除数据
	clearData(): void {
		this.data = {}
		this.wb = new ExcelJs.Workbook()
	}
}

export default BaseDealXls
