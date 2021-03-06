const path = require('path')
const semver = require('semver')
const log = require('artist-cli-log')
const colors = require('colors')
const userHome = require('user-home')
const dotenv = require('dotenv')
const pathExist = require('path-exists')
const pkgDir = require('pkg-dir');
const init = require('artist-cli-init')
const exec = require('artist-cli-exec')
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
    getUserName()
    // chenckInputArgs()
    checkEnv()
    checkGlobalUpdate()
    registerCommander()
    log.verbose('debug', 'test debug')
  } catch (e) {
    log.error(e.message)
  }
}

async function getUserName () {
  const res = await pkgDir(__dirname)
  // console.log('用户目录', res)
}


function registerCommander () {
  const { Command } = require('commander')
  const program = new Command()

  program
    .name(Object.keys(pkg.bin)[0])
    .usage('command [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件', '')


  program
    .command('init [projectName]')
    .option('-f --force', '是否强制初始化')
    .action(exec)

  // 指定targetPath
  program.on('option:targetPath', () => {
    process.env.CLI_TARGET_PATH = program.opts().targetPath
  })

  program.on('option:debug', () => {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose'
    } else {
      process.env.LOG_LEVEL = 'info'
    }
    console.log("process.env.LOG_LEVEL", process.env.LOG_LEVEL)
    log.level = process.env.LOG_LEVEL
    // log.verbose()
    log.verbose('环境变量AAA', process.env.LOG_LEVEL)
  })


  program.on('command:*', (obj) => {
    const availableCommands = program.commands.map(cmd => cmd._name)
    console.log(colors.red('未知的命令：' + obj[0]))
    if (availableCommands.length > 0) {
      console.log(colors.green('可用命令：' + availableCommands.join('，')))
    }
  })


  program.parse(process.argv)

  if (program.args && program.args.length < 1) {
    program.outputHelp()
    console.log()
  }


  /*
    写在最下面，初始化commander
  */

}

async function checkGlobalUpdate () {
  // 1.获取当前版本号，和模块名
  const currentVersion = pkg.version
  const npmName = pkg.name
  // 2.调用npm API,获取所有的版本号
  // 3.提取所有版本号，比对那些版本号大于当前版本号
  // 4.对比
  const { getNpmServerVersion } = require('artist-cli-npminfor')
  const lastVersion = await getNpmServerVersion(currentVersion, npmName)
  // console.log(lastVersion)
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(colors.yellow(`请手动更新 ${npmName}，当前版本：${currentVersion}，最新版本：${lastVersion}
                  更新命令：npm install -g ${npmName}`))
  }

}

function checkEnv () {
  const dotenvPath = path.resolve(userHome, '.env')
  dotenv.config({
    path: dotenvPath
  })

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
  // console.log(pkg.version)
  // log.success('成功日志信息')
}

function checkNodeVersion (params) {
  const currentVersion = process.version
  const lowestVersion = content.LOWEST_NODE_VERSION
  if (!semver.gt(currentVersion, lowestVersion)) {
    throw new Error(colors.red(`artist-cli 需要安装v${lowestVersion}以上版本的 Node.js`))
  }
}

function checkRoot () {
  const rootCheck = require('root-check')
  rootCheck()
  // console.log("root", process.geteuid)
}

async function getUserHome () {
  if (!userHome || ! await pathExist(userHome)) {
    throw new Error(colors.red('当前登录用户目录不存在！'))
  }
}

function chenckInputArgs () {
  const minimist = require('minimist')
  args = minimist(process.argv.slice(2))
  // console.log("args", args)
  checkArgs(args)
}

function checkArgs (args) {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose'
  } else {
    process.env.LOG_LEVEL = 'info'
  }
  log.level = process.env.LOG_LEVEL
}