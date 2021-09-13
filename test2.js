var SerialPort = require('serialport'),
	serialPort = new SerialPort('/dev/ttyUSB0', {
		baudRate: 9600,
		charset: 0
	}),
	Printer = require('thermalprinter');

var path = __dirname + '/nodebot.png';

serialPort.on('open',function() {
	var printer = new Printer(serialPort);
	printer.on('ready', function() {
		// printer.testPage();
		// printer.hasPaper();
		// printer.lineFeed();
		printer
			// .indent(10)
			// .horizontalLine(16)
			// .bold(true)
			// .indent(10)
			// .big(true)
			.printLine('')
			// .printLine('first line and a very long first line to make sure it is long enough')
			// .bold(false).big(false)
			// // .inverse(true)
			// .center()
			// .addText('text added with addText and adding more text and again more text and text here too...')
			// .printLine('second line where I can add more text maybe? what do you think?')
			// .barcode(Printer.BARCODE_TYPES.UPCA, '123456789012')
			// .printLine('')
			// .printLine('')
			// .printLine('')
			// .printImage(path)
			.print(function() {
				console.log('done');
				process.exit();
			});
	});
});
