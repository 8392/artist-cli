'use strict';
const axios = require('axios')
const urlJoin = require('url-join')
const semver = require('semver')

async function getNpmInfor (npmName, registry) {
  if (!npmName) {
    return null
  }
  const registryUrl = registry || getDefaultRegistry()
  const npmInforUrl = urlJoin(registryUrl, npmName)
  const response = await axios.get(npmInforUrl)
  if (response.status === 200) {
    return response.data
  }
  return null
}

function getDefaultRegistry (isOriginal) {
  return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org'
}

async function getNpmVersions (npmName, registry) {
  const data = await getNpmInfor(npmName, registry)
  if (data) {
    return Object.keys(data.versions)
  } else {
    return []
  }
}

function getSemverVersions (baseVersion, versions) {
  return versions
    .filter(version => semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => semver.gt(b, a))
}

async function getNpmServerVersion (baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry)
  const newVersion = getSemverVersions(baseVersion, versions)
  if (newVersion && newVersion.length > 0) {
    return newVersion[0]
  }
  return null
}


module.exports = {
  getNpmInfor,
  getNpmVersions,
  getDefaultRegistry,
  getNpmServerVersion
}
