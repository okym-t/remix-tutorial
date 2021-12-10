import bcrypt from 'bcrypt'
import { createCookieSessionStorage, redirect } from 'remix'
import { db } from './db.server'

type LoginForm = {
  username: string
  password: string
}

export async function login({ username, password }: LoginForm) {
  let user = await db.user.findUnique({
    where: { username }
  })
  if (!user) return null
  let isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isCorrectPassword) return null
  return user
}

let sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

let storage = createCookieSessionStorage({
  cookie: {
    name: 'RJ_session',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
})

export async function createUserSession(userId: string, redirectTo: string) {
  let session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session)
    }
  })
}
