const PREFIX = { plain: 'cv0$', sealed: 'cv1$' }
const PBKDF2_ITERATIONS = 210_000

function b64url(buf: ArrayBuffer | Uint8Array<ArrayBuffer>): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromB64url(s: string): Uint8Array<ArrayBuffer> {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

async function deflate(json: string): Promise<Uint8Array<ArrayBuffer>> {
  const stream = new Blob([json]).stream().pipeThrough(new CompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function inflate(bytes: Uint8Array<ArrayBuffer>): Promise<string> {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  return new Response(stream).text()
}

async function deriveKey(passphrase: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const passBytes = new TextEncoder().encode(passphrase)
  const base = await crypto.subtle.importKey(
    'raw',
    passBytes as Uint8Array<ArrayBuffer>,
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encodeCv(cv: unknown, passphrase = ''): Promise<string> {
  const json = JSON.stringify(cv)
  const raw = await deflate(json)
  if (!passphrase) return PREFIX.plain + b64url(raw)

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(passphrase, salt)
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, raw))
  const packed = new Uint8Array(salt.length + iv.length + ciphertext.length)
  packed.set(salt, 0)
  packed.set(iv, salt.length)
  packed.set(ciphertext, salt.length + iv.length)
  return PREFIX.sealed + b64url(packed)
}

export async function decodeCv(str: string, passphrase = ''): Promise<unknown> {
  let payload: string
  let sealed: boolean
  if (str.startsWith(PREFIX.plain)) {
    payload = str.slice(PREFIX.plain.length)
    sealed = false
  } else if (str.startsWith(PREFIX.sealed)) {
    payload = str.slice(PREFIX.sealed.length)
    sealed = true
  } else {
    throw new Error('Unknown CV string format')
  }
  if (!payload) throw new Error('Invalid CV string')
  const bytes = fromB64url(payload)

  if (!sealed) {
    return JSON.parse(await inflate(bytes))
  }
  if (!passphrase) throw new Error('This CV string is encrypted — enter the passphrase')
  const salt = new Uint8Array(bytes.buffer.slice(0, 16))
  const iv = new Uint8Array(bytes.buffer.slice(16, 28))
  const ciphertext = new Uint8Array(bytes.buffer.slice(28))
  const key = await deriveKey(passphrase, salt)
  let plain: ArrayBuffer
  try {
    plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  } catch {
    throw new Error('Wrong passphrase')
  }
  return JSON.parse(await inflate(new Uint8Array(plain)))
}
