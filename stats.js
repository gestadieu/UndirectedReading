const Datastore = require("nedb")

let db = new Datastore({ filename: 'data/stories.db', autoload: true})

db.find({}).sort({countPrint: -1, _id: 1}).exec(async (err, docs) => {
  let tb = []
  let total = 0
  await docs.forEach(doc => {
    tb.push({'id': doc._id, 'count': doc.countPrint, 'title': doc.story.title})
    total += doc.countPrint
    // console.log(doc._id, doc.countPrint)
  })
  console.table(tb)
  console.log(`TOTAL: ${total}`)
})