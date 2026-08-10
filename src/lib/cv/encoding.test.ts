import { describe, it, expect } from 'vitest'
import { encodeCv, decodeCv } from './encoding'
import { SAMPLE_CV } from './sample'

describe('cv encoding', () => {
  it('round-trips without passphrase (cv0)', async () => {
    const s = await encodeCv(SAMPLE_CV)
    expect(s.startsWith('cv0$')).toBe(true)
    expect(JSON.stringify(await decodeCv(s))).toBe(JSON.stringify(SAMPLE_CV))
  })

  it('round-trips with passphrase (cv1)', async () => {
    const s = await encodeCv(SAMPLE_CV, 'hunter2')
    expect(s.startsWith('cv1$')).toBe(true)
    expect(JSON.stringify(await decodeCv(s, 'hunter2'))).toBe(JSON.stringify(SAMPLE_CV))
  })

  it('rejects wrong passphrase', async () => {
    const s = await encodeCv(SAMPLE_CV, 'right')
    await expect(decodeCv(s, 'wrong')).rejects.toThrow(/passphrase/i)
  })

  it('cv1 output does not contain plaintext profile data', async () => {
    const s = await encodeCv(SAMPLE_CV, 'hunter2')
    expect(s).not.toContain(SAMPLE_CV.profile.email)
  })

  it('handles empty passphrase as cv0', async () => {
    const s = await encodeCv(SAMPLE_CV, '')
    expect(s.startsWith('cv0$')).toBe(true)
  })
})
