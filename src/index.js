#!node --use_strict

const fs = require('fs')
const _ = require('lodash')
const semver = require('semver')
const lockfile = require('@yarnpkg/lockfile')

// Read lockfile.
const locks = lockfile.parse(fs.readFileSync('yarn.lock', 'utf-8')).object
const packages = _.groupBy(Object.keys(locks), pkg => pkg.replace(/^(.*)@.*$/, '$1'))

const {dependencies} = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
const missingVersions = Object.entries(dependencies).
  // Filter package versions that are already accounted for.
  filter(([pkg, version]) => !locks[`${pkg}@${version}`])

missingVersions.forEach(([pkg, version]) => {
  const versionGoodEnough = (packages[pkg] || []).find(versionLocked =>
    semver.satisfies(locks[versionLocked].version, version))
  if (versionGoodEnough) {
    locks[`${pkg}@${version}`] = locks[versionGoodEnough]
    return
  }
  if (packages[pkg]) {
    const oneVersion = locks[packages[pkg][0]].version
    console.log(`Package ${pkg} needs to be updated to match ${version} (found ${oneVersion})`)
  } else {
    console.log(`Package ${pkg} needs to be installed.`)
  }
})

// Save updated lockfile.
fs.writeFileSync('yarn.lock', lockfile.stringify(locks), 'utf-8')
