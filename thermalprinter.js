const SerialPort = require('serialport'),
	serialPort = new SerialPort('/dev/ttyUSB0', {
		baudRate: 9600,
		charset: 1
	}),
	Printer = require('thermalprinter')

serialPort.on('open',() => {
  printer = new Printer(serialPort)
  printer.on('ready', () => {
    console.log('we are all ready...')
    // printer.hasPaper((paper) => {
    //   console.log(paper)
    //   process.exit()
    // })
    let title = 'Erasmos` Blues'
    title = title.replace('`','\047')
    let qrcode = 'data/qrcodes/story-01.png'

    printer
      .printLine('')
			.printLine(title)
      .printLine('')
      .barcode(Printer.BARCODE_TYPES.UPCA, '123456789012')
      .printLine('fr text - éü')
      .printImage(qrcode)
      .printLine('')
			.print(async () => {
        console.log("printing done...")
				process.exit();
			})
  })
})


