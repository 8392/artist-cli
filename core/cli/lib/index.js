const path = require('path')
const sermer = require('semver')
const log = require('artist-cli-log')
const colors = require('colors')
const userHome = require('user-home')
const dotenv = require('dotenv')
const pathExist = require('path-exists')
const pkg = require('../package.json')
const content = require('./const')
module.exports = core

let args = ''
function core () {
  try {
    checkPkgVersion()
    checkRoot()
    checkNodeVersion()
    getUserHome()
    chenckInputArgs()
    checkEnv()
    // log.verbose('debug', 'test debug')
  } catch (e) {
    log.error(e.message)
  }
}

function checkEnv () {
  const dotenvPath = path.resolve(userHome, '.env')
  if (pathExist(dotenvPath)) {
    dotenv.config({
      path: dotenvPath
    })
  }
  createDefaultConfig()
  log.verbose('环境变量', process.env)
}

function createDefaultConfig () {
  const cliConfig = {
    home: userHome
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig['cliHome'] = path.join(userHome, content.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome
  return cliConfig
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
  const rootCheck = require('root-check')
  rootCheck()
  console.log("root", process.geteuid)
}

async function getUserHome () {
  if (!userHome || ! await pathExist(userHome)) {
    throw new Error(colors.red('当前登录用户目录不存在！'))
  }
}

function chenckInputArgs () {
  const minimist = require('minimist')
  args = minimist(process.argv.slice(2))
  console.log("args", args)
  checkArgs()
}

function checkArgs () {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose'
  } else {
    process.env.LOG_LEVEL = 'info'
  }
  log.level = process.env.LOG_LEVEL
}