import { watch } from 'chokidar';

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var ChokidarPlugin = /*#__PURE__*/function () {
  function ChokidarPlugin(options) {
    this.PluginName = 'ChokidarPlugin';
    this.options = options;
    this.listening = false;
  }

  var _proto = ChokidarPlugin.prototype;

  _proto.apply = function apply(compiler) {
    var _this = this;

    compiler.hooks.watchRun.tapAsync(this.PluginName, function (compilation, callback) {
      if (_this.listening) callback();
      var _this$options$chokida = _this.options.chokidarConfigList,
          chokidarConfigList = _this$options$chokida === void 0 ? [] : _this$options$chokida;

      var _loop = function _loop() {
        var _ret = _step.value;
        var file = _ret.file,
            opt = _ret.opt,
            actions = _ret.actions;
        if (!actions || !Object.keys(actions).length) return "continue";
        var watcher = watch(file, opt);
        Object.entries(actions).forEach(function (action) {
          var listen = action[0],
              cbs = action[1];

          if (listen === 'on') {
            Object.entries(cbs).forEach(function (_ref) {
              var name = _ref[0],
                  cb = _ref[1];
              watcher[listen](name, function () {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                cb.apply(void 0, [{
                  compiler: compiler,
                  compilation: compilation,
                  watcher: watcher
                }].concat(args));
              });
            });
          }
        });
      };

      for (var _iterator = _createForOfIteratorHelperLoose(chokidarConfigList), _step; !(_step = _iterator()).done;) {
        var _ret2 = _loop();

        if (_ret2 === "continue") continue;
      }

      _this.listening = true;
      callback();
    });
  };

  return ChokidarPlugin;
}();

module.exports = ChokidarPlugin;
//# sourceMappingURL=webpack-plugin-chokidar.esm.js.map
