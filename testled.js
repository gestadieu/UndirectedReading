// Johnny-Five framework to use Raspberry Pi GPIO in NodeJS
const { RaspiIO } = require("raspi-io")
const five = require("johnny-five")

// Setup Johnny-Five for GPIO access
const board = new five.Board({
    io: new RaspiIO(),
})

board.on("ready", async () => {
  const btn = new five.Button({
    pin: "P1-11", 
    isPullup: true
  })  
  // LED inside the arcade button (btn)
  // const led = new five.Led("P1-11")
  // led.on()



  btn.on('down', async () => {
    console.log('button down...')
  })

  btn.on('up', async () => {
    console.log('button up....')
  })

  board.repl.inject({
    btn: btn
  })

  board.on("exit", () => {
    // led.off()
    console.log("leaving now...")
  });
})





