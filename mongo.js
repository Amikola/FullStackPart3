const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://atteikola:${password}@clusterkoulu.jcbhc6v.mongodb.net/peoples?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const peopleSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const People = mongoose.model('People', peopleSchema)


if (process.argv[3] && process.argv[4]) {

  const person = new People({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log(`added ${result.name} number ${person.number} added to phonebook`)
    mongoose.connection.close()
  })
}else{
  console.log('Phonebook: ')
  People.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

}