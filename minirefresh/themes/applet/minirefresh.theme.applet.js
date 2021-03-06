/*!
 * minirefresh v2.0.2
 * (c) 2017-2018 dailc
 * Released under the MIT License.
 * https://github.com/minirefresh/minirefresh
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.MiniRefresh = factory());
}(this, (function () { 'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BaseTheme = MiniRefreshTools.theme.defaults;
var version = MiniRefreshTools.version;
var extend = MiniRefreshTools.extend;
var namespace = MiniRefreshTools.namespace;

/**
 * ?????????????????????CSS??????????????????????????????????????????????????????
 * theme??????????????????????????????????????????
 */
var CLASS_THEME = 'minirefresh-theme-applet';
var CLASS_DOWN_WRAP = 'minirefresh-downwrap';
var CLASS_HARDWARE_SPEEDUP = 'minirefresh-hardware-speedup';

/**
 * ????????????????????????
 */
var CLASS_DOWN_LOADING = 'loading-applet';
var CLASS_STATUS_DEFAULT = 'status-default';
var CLASS_STATUS_PULL = 'status-pull';
var CLASS_STATUS_LOADING = 'status-loading';
var CLASS_STATUS_SUCCESS = 'status-success';
var CLASS_STATUS_ERROR = 'status-error';

/**
 * ????????????
 */
var DEFAULT_DOWN_HEIGHT = 50;

var defaultSetting = {
    down: {
        successAnim: {
            // ?????????????????????successAnim ?????????????????????
            isEnable: false
        },
        // ?????????default???downWrap?????????????????????????????????
        isWrapCssTranslate: true
    }
};

var MiniRefreshTheme = function (_BaseTheme) {
    _inherits(MiniRefreshTheme, _BaseTheme);

    function MiniRefreshTheme(options) {
        _classCallCheck(this, MiniRefreshTheme);

        var newOptions = extend(true, {}, defaultSetting, options);

        return _possibleConstructorReturn(this, (MiniRefreshTheme.__proto__ || Object.getPrototypeOf(MiniRefreshTheme)).call(this, newOptions));
    }

    /**
     * ????????????????????????????????????????????????????????????
     */


    _createClass(MiniRefreshTheme, [{
        key: '_initDownWrap',
        value: function _initDownWrap() {
            var container = this.container;
            var contentWrap = this.contentWrap;
            var downWrap = document.createElement('div');

            downWrap.className = CLASS_DOWN_WRAP + ' ' + CLASS_HARDWARE_SPEEDUP;
            downWrap.innerHTML = ' \n            <div class="downwrap-content ball-beat">\n                <div class="dot"></div>\n                <div class="dot"></div>\n                <div class="dot"></div>\n            </div>\n        ';
            container.insertBefore(downWrap, contentWrap);

            // ?????????????????????default????????????????????????default??????????????????????????????????????????
            container.classList.add(CLASS_THEME);

            this.downWrap = downWrap;
            // ?????????????????????????????????pull??????????????????
            this.isCanPullDown = false;
            // ?????????????????????????????????????????????????????????
            this.downWrapHeight = this.downWrap.offsetHeight || DEFAULT_DOWN_HEIGHT;
            this._transformDownWrap(-1 * this.downWrapHeight);
            BaseTheme._changeWrapStatusClass(this.downWrap, CLASS_STATUS_DEFAULT);
        }
    }, {
        key: '_transformDownWrap',
        value: function _transformDownWrap(offset, duration) {
            _get(MiniRefreshTheme.prototype.__proto__ || Object.getPrototypeOf(MiniRefreshTheme.prototype), '_transformDownWrap', this).call(this, offset, duration);
        }

        /**
         * ????????????????????????
         * @param {Number} downHight ?????????????????????
         * @param {Number} downOffset ???????????????
         */

    }, {
        key: '_pullHook',
        value: function _pullHook(downHight, downOffset) {
            if (downHight < downOffset) {
                var rate = downHight / downOffset;
                var offset = this.downWrapHeight * (-1 + rate);

                this._transformDownWrap(offset);
                if (this.isCanPullDown) {
                    this.isCanPullDown = false;
                    BaseTheme._changeWrapStatusClass(this.downWrap, CLASS_STATUS_DEFAULT);
                }
            } else {
                this._transformDownWrap(0);
                if (!this.isCanPullDown) {
                    this.isCanPullDown = true;
                    BaseTheme._changeWrapStatusClass(this.downWrap, CLASS_STATUS_PULL);
                }
            }
        }

        /**
         * ??????????????????
         */

    }, {
        key: '_downLoaingHook',
        value: function _downLoaingHook() {
            this.downWrap.classList.add(CLASS_DOWN_LOADING);
            BaseTheme._changeWrapStatusClass(this.downWrap, CLASS_STATUS_LOADING);
        }

        /**
         * ??????success ?????????????????????
         */

    }, {
        key: '_downLoaingSuccessHook',
        value: function _downLoaingSuccessHook(isSuccess) {
            // ???????????????
            BaseTheme._changeWrapStatusClass(this.downWrap, isSuccess ? CLASS_STATUS_SUCCESS : CLASS_STATUS_ERROR);
        }

        /**
         * ????????????end
         */

    }, {
        key: '_downLoaingEndHook',
        value: function _downLoaingEndHook() {
            this.downWrap.classList.remove(CLASS_DOWN_LOADING);
            this._transformDownWrap(-1 * this.downWrapHeight, this.options.down.bounceTime);
            // ??????????????????
            this.isCanPullDown = false;
            BaseTheme._changeWrapStatusClass(this.downWrap, CLASS_STATUS_DEFAULT);
        }

        /**
         * ??????loading?????????
         */

    }, {
        key: '_cancelLoaingHook',
        value: function _cancelLoaingHook() {
            this._transformDownWrap(-1 * this.downWrapHeight, this.options.down.bounceTime);
            BaseTheme._changeWrapStatusClass(this.downWrap, CLASS_STATUS_DEFAULT);
        }
    }]);

    return MiniRefreshTheme;
}(BaseTheme);

MiniRefreshTheme.sign = 'applet';
MiniRefreshTheme.version = version;
namespace('theme.applet', MiniRefreshTheme);

return MiniRefreshTheme;

})));
