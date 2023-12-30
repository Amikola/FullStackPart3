const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    result
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const peopleSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    require: true, },
  number: {
    type: String,
    minlength: 8,
    require: true,
    validate: {
      validator: function(arr) {
        return arr.split('-').length === 2 &&
          (arr.split('-')[0].length === 2  || arr.split('-')[0].length === 3) &&
          (arr.split('-')[0].match(/^[0-9]+$/) !== null && arr.split('-')[1].match(/^[0-9]+$/) !== null   )
      },
      message: 'Must have one - (rest are numbers) symbol and first part be 2 or 3 numbers long'


    }, }
})

peopleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('People', peopleSchema)