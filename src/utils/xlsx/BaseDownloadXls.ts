abstract class BaseDownloadXls {
	private path: string
	constructor(path: string) {
		this.path = path
	}
	abstract download(path: string): void
}

export default BaseDownloadXls

class DownloadXlsForWeapp extends BaseDownloadXls {
	constructor(path: string) {
		super(path)
	}
	download() {}
}

class DownloadXlsForH5 extends BaseDownloadXls {
	constructor(path: string) {
		super(path)
	}
	download(path: string) {
		console.log("download", path)
	}
}
