'use strict';
const path = require('path')
const pkgDir = require('pkg-dir')
const npminsatall = require('npminstall')
const { isObject } = require('artist-cli-utils')
const formatpath = require('artist-cli-formatpath')
const { getDefaultRegistry } = require('artist-cli-npminfor')


class Package {
  constructor(option) {
    if (!option) {
      throw new Error('package类的option参数不能为空！')
    }
    if (!isObject(option)) {
      throw new Error('package类只能是一个对象！')
    }
    this.targetPath = option.targetPath
    // package存储路径
    this.storeDir = option.storeDir
    // package的name
    this.packageName = option.packageName
    // version
    this.packageVersion = option.packageVersion
    this.getRootFilePath()
  }

  // 判断package是否存在
  exists () {

  }

  // 更新package
  update () {

  }

  // 获取文件路径
  async getRootFilePath () {
    //1. 获取package.json所在目录 - pkg-dir
    // 2. 读取package.json -require()
    // 3. main.lib -path
    // 4.路径的兼容(macOs/windows)
    const dir = await pkgDir(this.targetPath)
    if (dir) {
      const pkgFile = require(path.resolve(dir, 'package.json'))
      if (pkgFile && pkgFile.main) {
        return formatpath(path.resolve(dir, pkgFile.main))
      }
    }
    return null
  }

  // 安装package
  install () {
    return npminsatall({
      root: this.targetPath,
      storeDir: this.storeDir,
      register: getDefaultRegistry(),
      pkg: [
        { name: this.packageName, version: this.packageVersion }
      ]
    })
  }
}


module.exports = Package;
