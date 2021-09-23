const path = require('path')
const escpos = require('escpos')
escpos.USB = require('escpos-usb')
const device  = new escpos.USB()
// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');

// const options = { encoding: "GB18030" }
const printer = new escpos.Printer(device)

const Datastore = require("nedb")
let db = new Datastore({ filename: 'data/stories.db', autoload: true})

device.open(function(error){

  db.findOne({_id: 16}, async (err, doc) => {
    if (err) return
    let story = doc.story
    // fix special characters
    // story.title = story.title.replaceAll('’','\047')
    // story.text = story.text.replaceAll('’','\047')
    // story.text = story.text.replaceAll('“', '\042')
    // story.text = story.text.replaceAll('”', '\042')

    const qrcode = path.join(__dirname, `/data/qrcodes/story-${doc._id}.png`)
    escpos.Image.load(qrcode, function(image){

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
    // .qrimage(story.URL, (err) => {
    //   printer.cut();
    //   printer.close();
    // })
  })  
})

  // printer
  // .font('a')
  // .align('ct')
  // .style('bu')
  // .size(1, 1)
  // .text('The quick brown fox jumps over the lazy dog')
  // .text('敏捷的棕色狐狸跳过懒狗')
  // .barcode('1234567', 'EAN8')
  // .table(["One", "Two", "Three"])
  // .tableCustom(
  //   [
  //     { text:"Left", align:"LEFT", width:0.33, style: 'B' },
  //     { text:"Center", align:"CENTER", width:0.33},
  //     { text:"Right", align:"RIGHT", width:0.33 }
  //   ],
  //   { encoding: 'cp857', size: [1, 1] } // Optional
  // )
  // .qrimage('https://github.com/song940/node-escpos', function(err){
  //   this.cut();
  //   this.close();
  // });