// define a User interface
export interface User {
  id?: string // MongoDB uses 'id' of type 'ObjectId' -> not a number
  name: string
  email: string
}
