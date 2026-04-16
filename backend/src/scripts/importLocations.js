import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'
import slugify from 'slugify'
import prisma from '../config/prisma.db.js'

const filePath = path.join(process.cwd(), 'prisma/data/locations.csv')

const run = async () => {
  console.log('Reading CSV...')

  // CSV raw content padho aur \r\n aur \r ko \n se replace karo
  const rawContent = fs.readFileSync(filePath, 'utf8')
  
  // state_code ke baad aane wale newlines fix karo
  // Problem: "01\n2" — yahan 01 state_code hai aur 2 agla row ka _id
  const cleanedContent = rawContent
    .replace(/\r\n/g, '\n')  // Windows line endings fix
    .replace(/\r/g, '\n')     // Old Mac line endings fix

  const rows = await new Promise((resolve, reject) => {
    const results = []
    const parser = parse(cleanedContent, {
      columns: true,
      trim: true,
      skip_empty_lines: true,
      relax_column_count: false,
      from_line: 1
    })
    parser.on('data', (row) => results.push(row))
    parser.on('end', () => resolve(results))
    parser.on('error', (err) => {
      console.log('Parse error at line, skipping:', err.message)
      resolve(results)
    })
  })

  console.log(`Total rows: ${rows.length}`)

  if (rows.length === 0) {
    console.log('No rows found! Check CSV file.')
    process.exit(1)
  }

  // ── STATES ──
  const stateNames = [...new Set(rows.map(r => r.state_name?.trim()).filter(Boolean))]
  console.log(`States found: ${stateNames.length}`)

  await prisma.state.createMany({
    data: stateNames.map(name => ({
      name,
      slug: slugify(name, { lower: true, strict: true })
    })),
    skipDuplicates: true
  })

  const allStates = await prisma.state.findMany()
  const stateMap = new Map(allStates.map(s => [s.name, s.id]))
  console.log('States done!')

  // ── DISTRICTS ──
  const districtSet = new Map()
  for (const row of rows) {
    const stateName = row.state_name?.trim()
    const districtName = row.district_name?.trim()
    if (!stateName || !districtName) continue
    const key = `${stateName}||${districtName}`
    if (!districtSet.has(key)) {
      districtSet.set(key, {
        name: districtName,
        slug: slugify(districtName, { lower: true, strict: true }),
        stateId: stateMap.get(stateName)
      })
    }
  }

  const districtData = [...districtSet.values()].filter(d => d.stateId)
  console.log(`Districts found: ${districtData.length}`)

  await prisma.district.createMany({
    data: districtData,
    skipDuplicates: true
  })

  const allDistricts = await prisma.district.findMany()
  const districtMap = new Map(allDistricts.map(d => [`${d.stateId}||${d.name}`, d.id]))
  console.log('Districts done!')

  // ── SUB DISTRICTS ──
  const subDistrictSet = new Map()
  for (const row of rows) {
    const stateName = row.state_name?.trim()
    const districtName = row.district_name?.trim()
    const subDistrictName = row.sub_district_name?.trim()
    if (!stateName || !districtName || !subDistrictName) continue

    const stateId = stateMap.get(stateName)
    const districtId = districtMap.get(`${stateId}||${districtName}`)
    if (!districtId) continue

    const key = `${districtId}||${subDistrictName}`
    if (!subDistrictSet.has(key)) {
      subDistrictSet.set(key, {
        name: subDistrictName,
        slug: slugify(subDistrictName, { lower: true, strict: true }),
        districtId
      })
    }
  }

  const subDistrictData = [...subDistrictSet.values()]
  console.log(`Sub-districts found: ${subDistrictData.length}`)

  const chunkSize = 500
  for (let i = 0; i < subDistrictData.length; i += chunkSize) {
    const chunk = subDistrictData.slice(i, i + chunkSize)
    await prisma.subDistrict.createMany({
      data: chunk,
      skipDuplicates: true
    })
    console.log(`Inserted: ${Math.min(i + chunkSize, subDistrictData.length)}/${subDistrictData.length}`)
  }

  console.log('✓ All location data imported!')
  await prisma.$disconnect()
}

run().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})