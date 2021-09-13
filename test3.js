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
		printer
			.indent(10)
			.horizontalLine(16)
			.bold(true)
			.indent(10)
			.printLine('first line')
			.bold(false)
			.inverse(true)
			.big(true)
			.right()
			.printLine('second line')
			.printImage(path)
			.print(function() {
				console.log('done');
				process.exit();
			});
	});
});