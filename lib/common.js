"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = toArray;
exports.testPathWithPrefix = testPathWithPrefix;
exports.patchMicroAppRoute = patchMicroAppRoute;
exports.insertRoute = insertRoute;
exports.noop = exports.defaultMountContainerId = void 0;

function _slicedToArray2() {
  const data = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

  _slicedToArray2 = function _slicedToArray2() {
    return data;
  };

  return data;
}

function _objectSpread2() {
  const data = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

  _objectSpread2 = function _objectSpread2() {
    return data;
  };

  return data;
}

function _objectWithoutProperties2() {
  const data = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

  _objectWithoutProperties2 = function _objectWithoutProperties2() {
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

const _excluded = ["settings"];

/**
 * @author Kuitos
 * @since 2019-06-20
 */
const defaultMountContainerId = 'root-subapp'; // @formatter:off

exports.defaultMountContainerId = defaultMountContainerId;

const noop = () => {}; // @formatter:on


exports.noop = noop;

function toArray(source) {
  return Array.isArray(source) ? source : [source];
}

function testPathWithStaticPrefix(pathPrefix, realPath) {
  if (pathPrefix.endsWith('/')) {
    return realPath.startsWith(pathPrefix);
  }

  const pathRegex = new RegExp(`^${pathPrefix}([/?])+.*$`, 'g');
  const normalizedPath = `${realPath}/`;
  return pathRegex.test(normalizedPath);
}

function testPathWithDynamicRoute(dynamicRoute, realPath) {
  // FIXME 这个是旧的使用方式才会调到的 api，先临时这么苟一下消除报错，引导用户去迁移吧
  const pathToRegexp = require('path-to-regexp');

  return pathToRegexp(dynamicRoute, {
    strict: true,
    end: false
  }).test(realPath);
}

function testPathWithPrefix(pathPrefix, realPath) {
  return testPathWithStaticPrefix(pathPrefix, realPath) || testPathWithDynamicRoute(pathPrefix, realPath);
}

function patchMicroAppRoute(route, getMicroAppRouteComponent, masterOptions) {
  const base = masterOptions.base,
        masterHistoryType = masterOptions.masterHistoryType,
        routeBindingAlias = masterOptions.routeBindingAlias; // 当配置了 routeBindingAlias 时，优先从 routeBindingAlias 里取配置，但同时也兼容使用了默认的 microApp 方式

  const microAppName = route[routeBindingAlias] || route.microApp;
  const microAppProps = route[`${routeBindingAlias}Props`] || route.microAppProps || {};

  if (microAppName) {
    var _route$routes;

    if ((_route$routes = route.routes) === null || _route$routes === void 0 ? void 0 : _route$routes.length) {
      const childrenRouteHasComponent = route.routes.some(r => r.component);

      if (childrenRouteHasComponent) {
        throw new Error(`[@umijs/plugin-qiankun]: You can not attach micro app ${microAppName} to route ${route.path} whose children has own component!`);
      }
    }

    route.exact = false;
    const _microAppProps$settin = microAppProps.settings,
          settings = _microAppProps$settin === void 0 ? {} : _microAppProps$settin,
          componentProps = (0, _objectWithoutProperties2().default)(microAppProps, _excluded);
    const routeProps = (0, _objectSpread2().default)({
      // 兼容以前的 settings 配置
      settings: route.settings || settings || {}
    }, componentProps);
    const opts = {
      appName: microAppName,
      base,
      masterHistoryType,
      routeProps
    };
    route.component = getMicroAppRouteComponent(opts);
  }
}

const recursiveSearch = (routes, path, parentPath) => {
  for (let i = 0; i < routes.length; i++) {
    var _routes$i$routes;

    if (routes[i].path === path) {
      return [routes[i], routes, i, parentPath];
    }

    if (routes[i].routes && ((_routes$i$routes = routes[i].routes) === null || _routes$i$routes === void 0 ? void 0 : _routes$i$routes.length)) {
      const found = recursiveSearch(routes[i].routes || [], path, routes[i].path);

      if (found) {
        return found;
      }
    }
  }

  return null;
};

function insertRoute(routes, microAppRoute) {
  const mod = microAppRoute.appendChildTo || microAppRoute.insert ? 'appendChildTo' : microAppRoute.insertBefore ? 'insertBefore' : undefined;
  const target = microAppRoute.appendChildTo || microAppRoute.insert || microAppRoute.insertBefore;
  const result = recursiveSearch(routes, target, '/');

  if (result) {
    const _result = (0, _slicedToArray2().default)(result, 4),
          found = _result[0],
          _result$ = _result[1],
          foundParentRoutes = _result$ === void 0 ? [] : _result$,
          _result$2 = _result[2],
          index = _result$2 === void 0 ? 0 : _result$2,
          parentPath = _result[3];

    switch (mod) {
      case 'appendChildTo':
        if (!microAppRoute.path || !found.path || !microAppRoute.path.startsWith(found.path)) {
          throw new Error(`[plugin-qiankun]: path "${microAppRoute.path}" need to starts with "${found.path}"`);
        }

        found.exact = false;
        found.routes = found.routes || [];
        found.routes.push(microAppRoute);
        break;

      case 'insertBefore':
        if (!microAppRoute.path || !found.path || !microAppRoute.path.startsWith(parentPath)) {
          throw new Error(`[plugin-qiankun]: path "${microAppRoute.path}" need to starts with "${parentPath}"`);
        }

        foundParentRoutes.splice(index, 0, microAppRoute);
        break;
    }
  } else {
    throw new Error(`[plugin-qiankun]: path "${target}" not found`);
  }
}