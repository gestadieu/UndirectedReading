const fs = require("fs");

const { RaspiIO } = require("raspi-io")
const five = require("johnny-five");

const escpos = require('escpos');
escpos.USB = require('escpos-usb')

// Setup Thermal Printer
const device  = new escpos.USB()
const options = { encoding: "GB18030" }
const printer = new escpos.Printer(device, options)

// Setup Johnny-Five for GPIO access
const board = new five.Board({
    io: new RaspiIO(),
})


board.on("ready", () => {
  // Push button to start the print
  const btn = new five.Button({
      pin: "P1-18",
      isPullup: true
  })

  // LED Matrix
  const mtx = new five.Led.Matrix({
    pins: {
      data: 2,
      clock: 3,
      cs: 4
    },
    devices: 1
  })

  btn.on("down", () => {
    // Animate the LED Matrix
    ledMatrixTest(mtx)

    // Pick a random story
    let story = pickAStory()

    // Print on the thermal printer
    printStory(story)

    // Stop the LED Matrix
    mtx.off()
  })
})

board.on("exit", () => {
  console.log("leaving now...")
  // clear LED Matrix
  // clear printer?
});

const pickAStory = () => {
  const nbStories = fs.readdirSync('stories').length
  let rdNb = Math.ceil(Math.random() * nbStories)
  if (rdNb.toString().length == 1) {
    rdNb = "0" + rdNb
  }
  let rawdata = fs.readFileSync(`stories/text-${rdNb}.json`)
  let story = JSON.parse(rawdata)
  console.log(nbStories, story)
  return story
}

const printStory = (story) => {
  device.open(function(error){
    printer
    .font('a')
    .align('ct')
    .style('bu')
    .size(1, 1)
    .text(story.title)
    .text(story.author)
    .text(story.text)
    .qrimage(story.URL, (err) => {
      this.cut()
      this.close()
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


