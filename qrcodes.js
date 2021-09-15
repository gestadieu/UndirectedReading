const fs = require("fs")
const Datastore = require("nedb")
const QRCode = require('qrcode')
// import QRCode from 'qrcode'
var SerialPort = require('serialport'),
	serialPort = new SerialPort('/dev/ttyUSB0', {
		baudRate: 9600
	}),
	Printer = require('thermalprinter');


// Setup NeDB datastore 
let db = new Datastore({ filename: 'data/stories.db', autoload: true})
let nbStories = 23
db.count({}, (err, count) => nbStories = count) //count actual number of stories

serialPort.on('open', () => {
  let printer = new Printer(serialPort)
  printer.on('ready', () => {

  })

  db.find({}, (err, docs) => {
    if (err) return
    console.log(docs.length)
    docs.forEach( async doc => {
      let id = await generateQRCode(doc)
      let qrcode = __dirname + `/data/qrcodes/story-${id}.png`
      // printer
      // .printImage(qrcode)
      // .print(() => {
      //   console.log(`done printing ${id}...`)
      //   // process.exit()
      // })
    })
  })
})

const generateQRCode = async doc => {
  try {
    let id = (doc._id < 10) ? `0${doc._id}` : doc._id
    filename = `data/qrcodes/story-${id}.png`
    await QRCode.toFile(filename, doc.story.URL, { type: "png", margin: 4, width: 384})
    return id
  } catch (err) {
    console.error(err)
  }
}
