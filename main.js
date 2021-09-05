const { app, BrowserWindow } = require('electron')


function createWindow() {
	const win = new BrowserWindow({
		width: 1610,
		height: 910,
		useContentSize:true,
		autoHideMenuBar: true,
	//	resizable: false
	})
	win.loadFile('web/index.html')
}

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})
app.whenReady().then(() => {
	createWindow()
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})