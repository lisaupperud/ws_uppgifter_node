import express from "express"

const app = express()
const port: number = 3000

app.get("/", (req, res) => {
  res.status(200).send("Hello World!") // automatically converts to datatypes
  res.json() // manually converts to JSON
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
