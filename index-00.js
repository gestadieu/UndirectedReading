const fs = require("fs")
const Datastore = require("nedb")
const random = require("random")
const { RaspiIO } = require("raspi-io")
const five = require("johnny-five")
const escpos = require("escpos")
escpos.USB = require("escpos-usb")

// Setup ESCPOS Thermal Printer
const device  = new escpos.USB()
const options = { encoding: "utf8", width: 32, lineWidth: 32 }
const printer = new escpos.Printer(device, options)

// Setup NeDB datastore 
let db = new Datastore({ filename: 'data/stories.db', autoload: true})
let nbStories = 23
db.count({}, (err, count) => nbStories = count) //count actual number of stories

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

  // LED inside the arcade button (btn)
  const btnLed = new five.Led(11)

  btn.on("down", async () => {
    btnLed.on()
    console.log('button pressed...')
    die
    
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
      btnLed.off()
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

const printStory = async story => { //should return a Promise?
  device.open((error) => {
    if (error) {
      console.log(error)
      return
    }
    const qrcode = path.join(__dirname, `/data/qrcodes/story-${doc._id}.png`)
    escpos.Image.load(qrcode, function(image){


    })
    printer
      .font('A')
      .align('CT')
      .style('b')
      .size(1,0.5)
      .text(story.title)
      .size(1, 0.5)
      .text(`by ${story.author}`)
      .text('')
      .align('LT')
      // .font('B')
      .text(`... ${story.text} ...`)
      .align('CT')
      .text("<<Scan to read the full story>>")
      .image(image, 'd24')
      .then(() => { 
        printer.control('LF').control('LF').close(); 
      })
  })
}

// temporary migration
// let { stories } = require('./data/stories.json')
// stories.forEach((story, idx) => {
//   db.insert({...{_id: idx+1},...{countPrint: 0},...{story}})
// })




