import { Db, MongoClient, ServerApiVersion } from "mongodb"
import { validateSecret } from "../security/validateEnv.js"

// runtime validation
const uri: string = validateSecret(process.env.DB_CONNECTION_STRING)
const dbName: string = validateSecret(process.env.DB_NAME)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

let isConnected = false

/** attempts to connect to database
 * returns a promise
 * throws an error at failed attempt */
export async function runDB(): Promise<void> {
  if (isConnected) return // prevent duplicate connects

  try {
    await client.connect()
    await client.db("admin").command({ ping: 1 })
    isConnected = true
    console.log("Db is up and running")
  } catch (err) {
    console.error(err)
    throw err
  }
}

export function getDB(): Db {
  if (!isConnected) {
    throw new Error("Tried to access DB before connecting")
  }

  return client.db(dbName)
}

export async function closeDB(): Promise<void> {
  await client.close()
  isConnected = false
  console.log("MOngoDb connection closed")
}
