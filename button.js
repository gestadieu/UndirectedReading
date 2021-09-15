const five = require("johnny-five");
const Raspi = require("raspi-io").RaspiIO;
const board = new five.Board({
  io: new Raspi()
});

board.on("ready", () => {
  const btn = new five.Button({
      pin: "P1-15", 
      isPullup: true
  })

  btn.on("press", () => {
    console.log("pressed...")
  })

  btn.on("hold", () => () => {
    console.log("hold....")
  });

  btn.on("release", () => {
    console.log("released....")
  })

  board.on("exit", () => {
    console.log("leaving now...")
  })
})

