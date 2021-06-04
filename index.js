const fs = require("fs")
const Datastore = require("nedb")
const random = require("random")

// Johnny-Five framework to use Raspberry Pi GPIO in NodeJS
const { RaspiIO } = require("raspi-io")
const five = require("johnny-five")

// ESC/POS USB Thermal Printer
const escpos = require("escpos")
escpos.USB = require("escpos-usb")

// Setup Thermal Printer
const device  = new escpos.USB()
const options = { encoding: "utf8", width: 32, lineWidth: 32 }
const printer = new escpos.Printer(device, options)

// Setup NeDB datastore 
let db = new Datastore({ filename: 'data/stories.db', autoload: true})
let nbStories = 23
db.count({}, (err, count) => nbStories = count)

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let isPrinting = false

// Setup Johnny-Five for GPIO access
const board = new five.Board({
    io: new RaspiIO(),
})

board.on("ready", async () => {
  // Push button to randomly print a story
  const btn = new five.Button({
      pin: "P1-13", //GPIO02
      isPullup: true
  })

  btn.on("down", async () => {
    if (isPrinting) await sleep(5000)

    // Pick a random story
    let rdNb = Math.ceil(Math.random() * nbStories)
    db.findOne({_id: rdNb}, async (err, doc) => {
      if (err) return
      // Print the story
      isPrinting = true
      printStory(doc.story)
      // Increment the print counter for this story
      doc.countPrint++
      db.update({_id: doc._id}, doc)
      await sleep(2000)
    })
  })

  board.repl.inject({
    counters: () => viewCounters()
  })
})

board.on("exit", () => {
  console.log("leaving now...")
});

// const pickAStory = async () => {
  // let rdNb = Math.ceil(Math.random() * nbStories)
  // let rdNb = random.int((min = 1), (max = nbStories))
  // console.log(rdNb)
  // await db.findOne({_id: rdNb}, (err, doc) => {return doc})
  // return stories[rdNb]
  // if (rdNb.toString().length == 1) {
  //   rdNb = "0" + rdNb
  // }  
  // let rawdata = fs.readFileSync(`stories/story-${rdNb}.json`)
  // let story = JSON.parse(rawdata)
  // return story
// }

const printStory = async (story) => { //should return a Promise?
  device.open((error) => {
    if (error) {
      console.log(error)
      return
    }
    printer
    // .feed()
    .font('A')
    .align('ct')
    .style('normal')
    .size(0.5, 1)
    .text(story.title)
    .newLine()
    .size(0, 0)
    .text(`by ${story.author}`)
    .text(story.graduating)
    .drawLine()
    .align('lt')
    .text(`...${story.text}...`)
    .newLine()
    .align('ct')
    .text("<<Scan to read the full story>>")
    .qrimage(story.URL, (err) => { //{ type: 's8', mode: 's8'},
      if (err) {
        console.log(err)
        return
      }
      printer.cut().close()
      isPrinting = false
    })
  })
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


