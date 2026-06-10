import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Parse .env
const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

const COUNTRY_TO_REGION = {
  us: 'North America', ca: 'North America', mx: 'North America',
  gb: 'United Kingdom & Ireland', ie: 'United Kingdom & Ireland',
  de: 'Europe', fr: 'Europe', es: 'Europe', it: 'Europe', pt: 'Europe',
  nl: 'Europe', be: 'Europe', ch: 'Europe', at: 'Europe', se: 'Europe',
  no: 'Europe', dk: 'Europe', fi: 'Europe', pl: 'Europe', cz: 'Europe',
  sk: 'Europe', hu: 'Europe', ro: 'Europe', hr: 'Europe', gr: 'Europe',
  lu: 'Europe', is: 'Europe', ee: 'Europe', lv: 'Europe', lt: 'Europe',
  jp: 'Asia Pacific', kr: 'Asia Pacific', cn: 'Asia Pacific', th: 'Asia Pacific',
  sg: 'Asia Pacific', ph: 'Asia Pacific', tw: 'Asia Pacific', hk: 'Asia Pacific',
  id: 'Asia Pacific', my: 'Asia Pacific', vn: 'Asia Pacific', in: 'Asia Pacific',
  au: 'Australia & New Zealand', nz: 'Australia & New Zealand',
  cu: 'Caribbean', bs: 'Caribbean', jm: 'Caribbean', bb: 'Caribbean',
  tt: 'Caribbean', do: 'Caribbean', pr: 'Caribbean', ky: 'Caribbean',
  ae: 'Middle East', sa: 'Middle East', qa: 'Middle East', bh: 'Middle East',
  om: 'Middle East', kw: 'Middle East', jo: 'Middle East', il: 'Middle East',
  za: 'Africa', ke: 'Africa', ma: 'Africa', eg: 'Africa', ng: 'Africa',
  gh: 'Africa', tz: 'Africa', mu: 'Africa',
  br: 'South America', ar: 'South America', cl: 'South America', co: 'South America',
  pe: 'South America', uy: 'South America', py: 'South America',
}

async function geocode(location) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1&addressdetails=1`
  const res = await fetch(url, { headers: { 'User-Agent': 'GolfBucketList/1.0' } })
  const data = await res.json()
  if (!data.length) return null
  const addr = data[0].address || {}
  const cc = addr.country_code
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    region: COUNTRY_TO_REGION[cc?.toLowerCase()] ?? null,
    state: addr.state || addr.province || addr.region || null,
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function main() {
  const { data: courses, error } = await supabase
    .from('golf_courses')
    .select('id, name, location')
    .not('location', 'is', null)

  if (error) { console.error('Failed to fetch courses:', error.message); process.exit(1) }
  if (!courses.length) { console.log('No courses with a location found.'); return }

  console.log(`Re-geocoding ${courses.length} course(s)...\n`)

  for (const course of courses) {
    process.stdout.write(`  ${course.name} (${course.location}) ... `)
    try {
      const result = await geocode(course.location)
      if (result) {
        const { error: updateError } = await supabase
          .from('golf_courses')
          .update({ lat: result.lat, lng: result.lng, region: result.region, state: result.state })
          .eq('id', course.id)
        if (updateError) {
          console.log(`DB error: ${updateError.message}`)
        } else {
          const parts = [result.region, result.state].filter(Boolean)
          console.log(`✓ ${parts.join(' / ') || 'located, no region mapped'}`)
        }
      } else {
        console.log('✗ not found')
      }
    } catch (e) {
      console.log(`✗ error: ${e.message}`)
    }
    await sleep(1200) // Nominatim rate limit: 1 req/sec
  }

  console.log('\nDone.')
}

main()
