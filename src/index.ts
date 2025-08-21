import express, { type Request, type Response } from "express"
import "dotenv/config" // oneliner for config
import { closeDB, runDB } from "./db/database.js"

const app = express()
const port: number = 3000

// middleware to parse JSON request bodies
// app.use(express.json())

// define a User interface
interface User {
  id: number
  name: string
  email: string
}

// GET endpoint
app.get("/:id", (req: Request, res: Response) => {
  const id: number = Number(req.params.id) // casting

  if (isNaN(id)) {
    res.status(400).send("Not a Number")
    return
  }

  res.send({ id: id })
})

// POST endpoint
app.post("/user", (req: Request, res: Response) => {
  const { name, email } = req.body

  if (!name || !email) {
    res.status(400).send({ message: "Name and email are required " })
    return
  }

  const newUser: User = {
    id: Math.floor(Math.random() * 1000),
    name,
    email,
  }

  res.status(201).send(newUser)
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
