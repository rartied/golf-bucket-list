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

export function regionFromCountryCode(code) {
  return COUNTRY_TO_REGION[code?.toLowerCase()] ?? null
}
