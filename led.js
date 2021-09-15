const five = require("johnny-five");
const Raspi = require("raspi-io").RaspiIO;
const board = new five.Board({
  io: new Raspi()
});

board.on("ready", () => {
  const led = new five.Led("P1-11");
  led.blink(500);

  board.on("exit", () => {
    led.stop().off()
    console.log("LED off, leaving now...")
  })
});
