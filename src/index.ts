import express from "express"
import "dotenv/config" // oneliner for config
import { closeDB, runDB } from "./db/database.js"

const app = express()
const port: number = 3000

app.get("/", (req, res) => {
  res.status(200).send("Hello World!") // automatically converts to datatypes
  res.json() // manually converts to JSON
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

async function startServer() {
  try {
    await runDB()
    app.listen(port, () => {
      console.log(`Listening to port ${port}`)
      console.log(`Start the app: http://localhost:${port}`)
    })
    process.on("SIGINT", async () => {
      console.log("Cleaning up...")
      await closeDB()
      process.exit(0)
    })
  } catch (error) {
    console.log(error)
  }
}

startServer()
