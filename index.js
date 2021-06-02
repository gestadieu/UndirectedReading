const fs = require("fs")
// import random from 'random'

// Johnny-Five framework to use Raspberry Pi GPIO in NodeJS
const { RaspiIO } = require("raspi-io")
const five = require("johnny-five");

// ESC/POS USB Thermal Printer
const escpos = require("escpos")
escpos.USB = require("escpos-usb")

// Setup Thermal Printer
const device  = new escpos.USB()
const options = { encoding: "GB18030", width: 32, lineWidth: 32 }
const printer = new escpos.Printer(device, options)


// const Datastore = require('nedb')
// let db = {}
// db.stories = new Datastore('data/stories.db');
// db.stats = new Datastore('data/stats.db');
let { stories } = require('./data/stories.json')
const nbStories = stories.length;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let isPrinting = false

// Setup Johnny-Five for GPIO access
const board = new five.Board({
    io: new RaspiIO(),
})

board.on("ready", () => {
  // Push button to randomly print a story
  const btn = new five.Button({
      pin: "P1-13", //GPIO02
      isPullup: true
  })

  // // LED Matrix
  // const mtx = new five.Led.Matrix({
  //   pins: {
  //     data: 2,
  //     clock: 3,
  //     cs: 4
  //   },
  //   devices: 1
  // })

  btn.on("down", async () => {
    if (isPrinting) await sleep(2000)
    // Animate the LED Matrix
    // ledMatrixTest(mtx)

    // Pick a random story
    let story = pickAStory()

    // Print on the thermal printer
    isPrinting = true
    printStory(story)
    await sleep(3000)
    // Stop the LED Matrix
    // mtx.off()
  })
})

board.on("exit", () => {
  console.log("leaving now...")
  // clear LED Matrix
  // clear printer?
});

const pickAStory = () => {
  let rdNb = Math.ceil(Math.random() * nbStories)
  // let rdNb = random.int((min = 1), (max = nbStories))
  return stories[rdNb]
  // if (rdNb.toString().length == 1) {
  //   rdNb = "0" + rdNb
  // }  
  // let rawdata = fs.readFileSync(`stories/story-${rdNb}.json`)
  // let story = JSON.parse(rawdata)
  // return story
}

const printStory = async (story) => { //should return a Promise?
  device.open((error) => {
    if (error) {
      console.log(error)
      return
    }
    printer
    .feed()
    .font('A')
    .align('ct')
    .style('normal')
    .size(1, 1)
    .text(story.title)
    .newLine()
    .size(0, 0)
    .text(`by ${story.author}`)
    .text(story.graduating)
    .drawLine()
    .align('lt')
    .text(`...${story.text}...`)
    .qrimage(story.URL, (err) => {
      if (err) {
        console.log(err)
        return
      }
      printer.cut().close()
      isPrinting = false
    })
  })
}

const ledMatrixTest = (mtx) => {
  var heart = [
    "01100110",
    "10011001",
    "10000001",
    "10000001",
    "01000010",
    "00100100",
    "00011000",
    "00000000"
  ];
  mtx.draw(heart);
}


