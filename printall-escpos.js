const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const device  = new escpos.USB();
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

const options = { encoding: "GB18030" }
// const options = { encoding: '860' } //for UTF8 encoding
const printer = new escpos.Printer(device, options);

const Datastore = require("nedb")
let db = new Datastore({ filename: 'data/stories.db', autoload: true})

device.open(async (error) => {

  db.find({_id: 16}, async (err, docs) => {
    if (err) return
    docs.forEach(async (doc) => {
      console.log(`printing ${doc._id}...`)
      let story = doc.story
      // fix special characters
      story.title = story.title.replaceAll('’','\047')
      story.text = story.text.replaceAll('’','\047')
      story.text = story.text.replaceAll('“', '\042')
      story.text = story.text.replaceAll('”', '\042')

      printer
        .font('B')
        .align('ct')
        .style('b')
        .size(0.5,0.5)
        .text(story.title)
        .size(0.5,0.5)
        .style('')
        .newLine()
        .text(`by ${story.author}`)
        .newLine()
        .size(0.5, 0.5)
        .align('lt')
        .text(`... ${story.text} ...`)
        .text("<<Scan to read the full story>>")
        .image(__dirname + '/data/qrcodes/story-01.png', 'd24')
        // .qrcode(story.URL)
        .qrimage(story.URL, (err) => {
          printer.cut().close()
        })
      // await printer.image('data/qrcodes/story-01.png', 's8') //'d24'
      // const qr = await printer.qrimage(story.URL)
      // printer.beep(1,100).close()
        // .then(() => { 
        //   printer.cut().close().beep(1, 100)
        // })
        // .qrimage(story.URL, (err) => {
        //   printer.beep(1,100).close()
        // })
    })
  })  
})
