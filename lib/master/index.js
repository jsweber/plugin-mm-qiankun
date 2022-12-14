"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMasterEnable = isMasterEnable;
exports.default = _default;

function _objectSpread2() {
  const data = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

  _objectSpread2 = function _objectSpread2() {
    return data;
  };

  return data;
}

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _umi() {
  const data = require("umi");

  _umi = function _umi() {
    return data;
  };

  return data;
}

var _constants = require("../constants");

var _modifyRoutes = _interopRequireDefault(require("./modifyRoutes"));

var _utils = require("./utils");

/* eslint-disable quotes */
// eslint-disable-next-line import/no-unresolved
const getFile = _umi().utils.getFile,
      winPath = _umi().utils.winPath;

function isMasterEnable(api) {
  var _api$userConfig, _api$userConfig$qiank;

  const masterCfg = (_api$userConfig = api.userConfig) === null || _api$userConfig === void 0 ? void 0 : (_api$userConfig$qiank = _api$userConfig.qiankun) === null || _api$userConfig$qiank === void 0 ? void 0 : _api$userConfig$qiank.master;

  if (masterCfg) {
    return masterCfg.enable !== false;
  }

  return !!process.env.INITIAL_QIANKUN_MASTER_OPTIONS;
}

function _default(api) {
  api.describe({
    enableBy: () => isMasterEnable(api)
  });
  api.addRuntimePlugin(() => '@@/plugin-qiankun/masterRuntimePlugin');
  api.modifyDefaultConfig(config => (0, _objectSpread2().default)((0, _objectSpread2().default)({}, config), {}, {
    mountElementId: _constants.defaultMasterRootId,
    disableGlobalVariables: true,
    qiankun: (0, _objectSpread2().default)((0, _objectSpread2().default)({}, config.qiankun), {}, {
      master: (0, _objectSpread2().default)((0, _objectSpread2().default)({}, JSON.parse(process.env.INITIAL_QIANKUN_MASTER_OPTIONS || '{}')), (config.qiankun || {}).master)
    })
  }));
  (0, _modifyRoutes.default)(api);
  const appFile = getFile({
    base: api.paths.absSrcPath,
    fileNameWithoutExt: 'app',
    type: 'javascript'
  });

  if (appFile) {
    const exportName = 'useQiankunStateForSlave';
    const hasExport = (0, _utils.hasExportWithName)({
      name: exportName,
      filePath: appFile.path
    });

    if (hasExport) {
      api.addRuntimePluginKey(() => exportName);
      api.register({
        key: 'addExtraModels',
        fn: () => [{
          absPath: winPath(appFile.path),
          namespace: _constants.qiankunStateForSlaveModelNamespace,
          exportName
        }]
      });
    }
  }

  api.onGenerateFiles(() => {
    var _api$config, _api$config$externals;

    const history = api.config.history;

    const _ref = ((_api$config = api.config) === null || _api$config === void 0 ? void 0 : _api$config.qiankun) || {},
          options = _ref.master;

    const masterHistoryType = history && (history === null || history === void 0 ? void 0 : history.type) || _constants.defaultHistoryType;
    const base = api.config.base || '/';
    const qiankunPath = ((_api$config$externals = api.config.externals) === null || _api$config$externals === void 0 ? void 0 : _api$config$externals.qiankun) ? 'qiankun' : winPath((0, _path().dirname)(require.resolve('qiankun/package')));
    api.writeTmpFile({
      path: 'plugin-qiankun/masterOptions.js',
      content: `
      let options = ${JSON.stringify((0, _objectSpread2().default)({
        masterHistoryType,
        base
      }, options))};
      export const getMasterOptions = () => options;
      export const setMasterOptions = (newOpts) => options = ({ ...options, ...newOpts });
      `
    });
    api.writeTmpFile({
      path: 'plugin-qiankun/MicroApp.tsx',
      content: _umi().utils.Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'MicroApp.tsx.tpl'), 'utf-8'), {
        lodashPath: winPath((0, _path().dirname)(require.resolve('lodash/package'))),
        qiankunPath
      })
    });
    api.writeTmpFile({
      path: 'plugin-qiankun/MicroAppWithMemoHistory.tsx',
      content: (0, _fs().readFileSync)((0, _path().join)(__dirname, 'MicroAppWithMemoHistory.tsx.tpl'), 'utf-8')
    });
    api.writeTmpFile({
      path: 'plugin-qiankun/masterRuntimePlugin.ts',
      content: _umi().utils.Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'masterRuntimePlugin.ts.tpl'), 'utf-8'), {
        qiankunPath
      })
    });
    const pathToRegexpPath = winPath((0, _path().dirname)(require.resolve('path-to-regexp/package')));
    api.writeTmpFile({
      path: 'plugin-qiankun/common.ts',
      content: (0, _fs().readFileSync)((0, _path().join)(__dirname, '../../src/common.ts'), 'utf-8').replace(/path-to-regexp/g, pathToRegexpPath)
    });
    api.writeTmpFile({
      path: 'plugin-qiankun/constants.ts',
      content: (0, _fs().readFileSync)((0, _path().join)(__dirname, '../../src/constants.ts'), 'utf-8')
    });
    api.writeTmpFile({
      path: 'plugin-qiankun/types.ts',
      content: (0, _fs().readFileSync)((0, _path().join)(__dirname, '../../src/types.ts'), 'utf-8')
    });
    api.writeTmpFile({
      path: 'plugin-qiankun/MicroAppLoader.tsx',
      // ????????? antd ???????????????????????? antd ??? loader ????????????????????????????????????????????????????????? loader ??????
      content: api.hasPlugins(['@umijs/plugin-antd']) ? (0, _fs().readFileSync)((0, _path().join)(__dirname, 'AntdLoader.tsx.tpl'), 'utf-8') : `export default function Loader() { console.warn(\`[@umijs/plugin-qiankun]: Seems like you'r not using @umijs/plugin-antd, you need to provide a custom loader or set autoSetLoading false to shut down this warning!\`); return null; }`
    });
    api.writeTmpFile({
      path: 'plugin-qiankun/ErrorBoundary.tsx',
      // ????????? antd ???????????????????????? antd ??? ErrorBoundary??????????????????????????????????????????????????? ErrorBoundary ??????
      content: _umi().utils.Mustache.render(api.hasPlugins(['@umijs/plugin-antd']) ? (0, _fs().readFileSync)((0, _path().join)(__dirname, 'AntdErrorBoundary.tsx.tpl'), 'utf-8') : (0, _fs().readFileSync)((0, _path().join)(__dirname, 'ErrorBoundary.tsx.tpl'), 'utf-8'), {
        enableLocale: api.hasPlugins(['@umijs/plugin-locale'])
      })
    });
    api.writeTmpFile({
      path: 'plugin-qiankun/getMicroAppRouteComponent.ts',
      content: _umi().utils.Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'getMicroAppRouteComponent.ts.tpl'), 'utf-8'), {
        runtimeHistory: api.config.runtimeHistory,
        dynamicRoot: api.config.exportStatic && api.config.exportStatic.dynamicRoot
      })
    });
  });
  api.addUmiExports(() => {
    var _api$config2;

    const pinnedExport = 'MicroApp';
    const exports = [{
      specifiers: [pinnedExport],
      source: winPath('../plugin-qiankun/MicroApp')
    }];
    const exportComponentAlias = (((_api$config2 = api.config) === null || _api$config2 === void 0 ? void 0 : _api$config2.qiankun) || {}).master.exportComponentAlias; // ??????????????????????????????????????????

    if (exportComponentAlias && exportComponentAlias !== pinnedExport) {
      exports.push({
        specifiers: [{
          local: pinnedExport,
          exported: exportComponentAlias
        }],
        source: winPath('../plugin-qiankun/MicroApp')
      });
    }

    return exports;
  });
  api.addUmiExports(() => {
    return {
      specifiers: ['getMasterOptions'],
      source: winPath('../plugin-qiankun/masterOptions.js')
    };
  });
  api.addUmiExports(() => {
    return {
      specifiers: ['MicroAppWithMemoHistory'],
      source: winPath('../plugin-qiankun/MicroAppWithMemoHistory')
    };
  });
  api.addUmiExports(() => {
    return {
      specifiers: ['getMicroAppRouteComponent'],
      source: winPath('../plugin-qiankun/getMicroAppRouteComponent')
    };
  });
  useCompatibleMode(api);
}

function useCompatibleMode(api) {
  const rootExportsJsFile = getFile({
    base: api.paths.absSrcPath,
    type: 'javascript',
    fileNameWithoutExt: 'rootExports'
  });

  if (rootExportsJsFile) {
    api.addTmpGenerateWatcherPaths(() => rootExportsJsFile.path);
  }

  api.onGenerateFiles(() => {
    const rootExports = `
    if (typeof window !== 'undefined') {
      window.g_rootExports = ${rootExportsJsFile ? `require('@/rootExports')` : `{}`};
    }
    `.trim();
    api.writeTmpFile({
      path: 'plugin-qiankun/qiankunRootExports.js',
      content: rootExports
    }); // TODO ????????????????????? defer ???????????????????????????

    api.writeTmpFile({
      path: 'plugin-qiankun/qiankunDefer.js',
      content: `
      class Deferred {
        constructor() {
          this.promise = new Promise(resolve => this.resolve = resolve);
        }
      }
      export const deferred = new Deferred();
      export const qiankunStart = deferred.resolve;
    `.trim()
    });
  });
  api.addDepInfo(() => {
    return {
      name: 'qiankun',
      range: require('../../package.json').dependencies.qiankun
    };
  }); // TODO ????????????????????? defer ???????????????????????????

  api.addUmiExports(() => [{
    specifiers: ['qiankunStart'],
    source: winPath('../plugin-qiankun/qiankunDefer')
  }]);
}