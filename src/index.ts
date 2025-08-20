import express from "express"

//njfdnfdwjfi
const app = express()
const port: number = 3000

app.get("/", (req, res) => {
  res.status(200).send("Hello World!")
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
