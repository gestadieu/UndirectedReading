const fs = require("fs")
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const Datastore = require("nedb")
const random = require("random")

// Johnny-Five framework to use Raspberry Pi GPIO in NodeJS
const { RaspiIO } = require("raspi-io")
const five = require("johnny-five")

// Setup Johnny-Five for RPi GPIO access
const board = new five.Board({
  io: new RaspiIO(),
})

const SerialPort = require('serialport'),
	serialPort = new SerialPort('/dev/ttyUSB0', {
		baudRate: 9600,
		charset: 0
	}),
	Printer = require('thermalprinter');

serialPort.on('open',() => {
  printer = new Printer(serialPort)
  printer.on('ready', () => {
    console.log('we are all ready...')
  })
})

// Setup NeDB datastore 
let db = new Datastore({ filename: 'data/stories.db', autoload: true})
let nbStories = 23
db.count({}, (err, count) => nbStories = count) //count actual number of stories

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let isPrinting = false

board.on("ready", async () => {
  const btn = new five.Button({
      pin: "P1-15", 
      isPullup: true
  })

  const btnLed = new five.Led("P1-11")
  btnLed.blink()
  await sleep(3000)
  btnLed.stop().off()

  btn.on("press", async () => {
    if (isPrinting) return
    console.log("pressed...")
    btnLed.on()

    // Pick a random story
    let rdNb = Math.ceil(Math.random() * nbStories)
    db.findOne({_id: rdNb}, async (err, doc) => {
      if (err) return
      // Print the story
      isPrinting = true
      await printStory(doc)
      
      doc.countPrint++
      db.update({_id: doc._id}, doc)
      btnLed.off()
      isPrinting = false;
    })
  })

  board.repl.inject({
    counters: () => viewCounters()
  })

  board.on("exit", () => {
    btnLed.off()
    console.log("LED off, leaving now...")
  })
})

// const pickAStory = async () => {
//   let rdNb = Math.ceil(Math.random() * nbStories)
//   // let rdNb = random.int((min = 1), (max = nbStories))
//   await db.findOne({_id: rdNb}, (err, doc) => {return doc})
// }

const qrcode = async (doc) => {
  // let cmd = `qrencode -s 6 -l H -o - "${doc.story.URL}" | lp -o fit-to-page`
  let id = (doc._id < 10) ? `0${doc._id}` : doc._id
  let cmd = `lp data/qrcodes/story-${id}.png`
  const { stdout, stderr } = await exec(cmd);
}

const printStory = async (doc) => { 
  printer.reset()
  let story = doc.story
  // fix special characters
  story.title = story.title.replaceAll('’','\047')
  story.text = story.text.replaceAll('’','\047')
  story.text = story.text.replaceAll('“', '\042')
  story.text = story.text.replaceAll('”', '\042')

  // await printer
  //   .printLine('')
  //   .bold(true)
  //   .center()
  //   .printLine(story.title)
  //   .bold(false)
  //   .printLine(`by ${story.author}`)
  //   .print()

  // await qrcode(doc)

  await printer
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
      // process.exit();
    })
  await sleep(20000)
}

// temporary migration
// let { stories } = require('./data/stories.json')
// stories.forEach((story, idx) => {
//   db.insert({...{_id: idx+1},...{countPrint: 0},...{story}})
// })

const viewCounters = (isReset = false) => {
  db.find({}, (err, docs) => {
    docs.forEach(doc => {
      console.log(doc._id, doc.countPrint)
      if (isReset) {
        console.log("resetting counters...")
        doc.countPrint = 0;
        db.update({_id: doc._id}, doc)
      }
    })
  })
}