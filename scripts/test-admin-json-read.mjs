/**
 * Reproduces the login "body stream already read" bug and verifies the fix.
 */
async function readAdminJson(res) {
  const raw = await res.clone().text()
  if (!raw.trim()) return {}
  return JSON.parse(raw)
}

const payload = JSON.stringify({ ok: true, token: 'test-token' })

const broken = new Response(payload, { status: 200 })
await broken.json()
try {
  await broken.json()
  console.error('FAIL: expected second json() to throw')
  process.exit(1)
} catch (err) {
  const msg = String(err?.message || err)
  if (!/already read|already been read|body stream|unusable|disturbed/i.test(msg)) {
    console.error('FAIL: unexpected error', msg)
    process.exit(1)
  }
  console.log('reproduced old bug:', msg)
}

const fixed = new Response(payload, { status: 200 })
const first = await readAdminJson(fixed)
const second = await readAdminJson(fixed)
if (first.token !== 'test-token' || second.token !== 'test-token') {
  console.error('FAIL: clone parse did not return token twice')
  process.exit(1)
}
console.log('clone parse ok:', first.ok, first.token === second.token)
console.log('PASS')
