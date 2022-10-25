"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.qiankunStateFromMasterModelNamespace = exports.qiankunStateForSlaveModelNamespace = exports.defaultHistoryType = exports.defaultMasterRootId = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

const defaultMasterRootId = 'root-master';
exports.defaultMasterRootId = defaultMasterRootId;
const defaultHistoryType = 'browser';
exports.defaultHistoryType = defaultHistoryType;
const qiankunStateForSlaveModelNamespace = '@@qiankunStateForSlave';
exports.qiankunStateForSlaveModelNamespace = qiankunStateForSlaveModelNamespace;
const qiankunStateFromMasterModelNamespace = '@@qiankunStateFromMaster';
exports.qiankunStateFromMasterModelNamespace = qiankunStateFromMasterModelNamespace;