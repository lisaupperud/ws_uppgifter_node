import express, { type Request, type Response } from "express"
import "dotenv/config"
import { closeDB, getDB, runDB } from "./db/database.js"
import { ObjectId } from "mongodb"
import type { User } from "./types/User.js"

const app = express()
const port: number = 3000

// middleware to parse JSON bodies (requests) -> required for POST body
app.use(express.json())

// GET endpoint
app.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id

  // check to make sure id is not undefined before calling ObjectId.isValid
  if (!id) {
    res.status(400).send("ID is required")
    return
  }

  if (!ObjectId.isValid(id)) {
    res.status(400).send("Invalid ID")
    return // no retrun -> code continues executing
  }

  try {
    // establish db connection and get collection
    const db = getDB()
    const result = db.collection("users")

    // returns a single doc if it exists -> otherwise return null
    const user = await result.findOne({ _id: new ObjectId(id) })

    // if return == null -> return 404
    if (!user) {
      res.status(404).send({ message: "User not found" })
      return
    }

    res.send(user)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "Unexpected service error" })
  }
})

// POST endpoint that sends a User
app.post("/user", async (req: Request, res: Response) => {
  const { name, email } = req.body

  if (!name || !email) {
    res.status(400).send({ message: "Name and email are required " })
    return
  }

  try {
    const db = getDB() // the endpoint "/user" calls getDB() to establish the db connection
    const result = await db.collection("users").insertOne({ name, email }) // inserts a new doc (row in table) into the users collection

    const newUser: User = {
      id: result.insertedId.toString(), // converts generated MongoDB id from ObjectId to string
      name,
      email,
    }
    res.status(201).send(newUser) // returns the new user with generated 'id' from MongoDB
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "Failed to create user" })
  }
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
