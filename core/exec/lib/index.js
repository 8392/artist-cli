'use strict';
const path = require('path')
const Package = require('artist-cli-package')
const log = require('artist-cli-log')

const SETTINGS = {
  init: 'artist-cli-init'
}

const CACHE_DIR = 'dependencies'

async function exec () {
  let storeDir = ''
  let pkg = ''
  let targetPath = process.env.CLI_TARGET_PATH
  const homePath = process.env.CLI_HOME_PATH
  log.verbose('targetPath', targetPath)
  log.verbose('homePath', homePath)
  const cmdObj = arguments[arguments.length - 1]
  const cmdName = cmdObj._name
  const packageName = SETTINGS[cmdName]
  const packageVersion = 'latest'

  if (!targetPath) {
    targetPath = path.resolve(homePath, CACHE_DIR)
    storeDir = path.resolve(targetPath, 'node_modules')
    console.log('CCC', targetPath, storeDir)
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
      storeDir
    })
    if (pkg.exists()) {
      // 更新
    } else {
      // 安装
      await pkg.install()
    }
  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
    })
    // const rootFile = await pkg.getRootFilePath()
    // require(rootFile).apply(null, arguments)
    pkg.install()
  }




}


module.exports = exec;
