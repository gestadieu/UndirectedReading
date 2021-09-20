const Datastore = require("nedb")
let db = new Datastore({ filename: 'data/stories.db', autoload: true})
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const SerialPort = require('serialport'),
	serialPort = new SerialPort('/dev/ttyUSB0', {
		baudRate: 9600,
		charset: 0
	}),
	Printer = require('thermalprinter')


const qrcode = async (doc) => {
  // let cmd = `qrencode -s 6 -l H -o - "${doc.story.URL}" | lp -o fit-to-page`
  let id = (doc._id < 10) ? `0${doc._id}` : doc._id
  let cmd = `lp data/qrcodes/story-${id}.png`
  const { stdout, stderr } = await exec(cmd);
}

serialPort.on('open',() => {
  printer = new Printer(serialPort)
  printer.reset()
  printer.on('ready', () => {
    console.log('we are all ready...')

    // printer.hasPaper((paper) => {
    //   console.log(paper)
    //   process.exit()
    // })
    // PROBLEME: 16
    db.find({_id: 1}, async (err, docs) => {
      if (err) return
      docs.forEach(doc => {
        console.log(`printing ${doc._id}...`)
        let story = doc.story
        // fix special characters
        story.title = story.title.replaceAll('’','\047')
        story.text = story.text.replaceAll('’','\047')
        story.text = story.text.replaceAll('“', '\042')
        story.text = story.text.replaceAll('”', '\042')

        printer
          .printLine('')
          .bold(true)
          .center()
          .printLine(story.title)
          .bold(false)
          .printLine(`by ${story.author}`)
          .left()
          .printLine('')
          .printLine(`...${story.text}...`)
          .printLine('')
          .center()
          .printLine("<<Scan to read the full story>>")
          .printLine('')
          .left()
          // .printImage(qrcode)
          .print(async () => {
            await qrcode(doc)
            process.exit()
          })
      })
    })


    // let title = 'Erasmos` Blues'
    // title = title.replace('`','\047')
    // let qrcode = 'data/qrcodes/story-01.png'

    // printer
    //   .printLine('')
		// 	.printLine(title)
    //   .printLine('')
    //   .barcode(Printer.BARCODE_TYPES.UPCA, '123456789012')
    //   .printLine('fr text - éü')
    //   .printImage(qrcode)
    //   .printLine('')
		// 	.print(async () => {
    //     console.log("printing done...")
		// 		process.exit();
		// 	})
  })
})



