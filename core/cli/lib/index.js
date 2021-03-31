const sermer = require('semver')
const log = require('artist-cli-log')
const colors = require('colors')
const pkg = require('../package.json')
const content = require('./const')
module.exports = core

function core () {
  try {
    checkPkgVersion()
    checkRoot()
    checkNodeVersion()
  } catch (e) {
    log.error(e.message)
  }
}

function checkPkgVersion () {
  console.log(pkg.version)
  log.success('成功日志信息')
}

function checkNodeVersion (params) {
  const currentVersion = process.version
  const lowestVersion = content.LOWEST_NODE_VERSION
  if (!sermer.gt(currentVersion, lowestVersion)) {
    throw new Error(colors.red(`artist-cli 需要安装v${lowestVersion}以上版本的 Node.js`))
  }
}

function checkRoot () {
  console.log("root", process.geteuid)
}