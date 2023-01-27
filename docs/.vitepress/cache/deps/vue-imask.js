import {
  IMask
} from "./chunk-VJIXD5RP.js";
import {
  isVue3
} from "./chunk-6NMAXBHK.js";
import {
  h,
  isRef,
  onMounted,
  onUnmounted,
  readonly,
  ref,
  toRef,
  watch
} from "./chunk-6S52NMOK.js";

// node_modules/vue-imask/esm/props.js
var props = {
  // common
  mask: {},
  prepare: Function,
  validate: Function,
  commit: Function,
  overwrite: {
    type: Boolean,
    required: false,
    default: void 0
  },
  // pattern
  placeholderChar: String,
  lazy: {
    type: Boolean,
    required: false,
    default: void 0
  },
  definitions: Object,
  blocks: Object,
  // date
  pattern: String,
  format: Function,
  parse: Function,
  autofix: {
    type: Boolean,
    required: false,
    default: void 0
  },
  // number
  radix: String,
  thousandsSeparator: String,
  mapToRadix: Array,
  scale: Number,
  signed: {
    type: Boolean,
    required: false,
    default: void 0
  },
  normalizeZeros: {
    type: Boolean,
    required: false,
    default: void 0
  },
  padFractionalZeros: {
    type: Boolean,
    required: false,
    default: void 0
  },
  min: [Number, Date],
  max: [Number, Date],
  // dynamic
  dispatch: Function
};

// node_modules/vue-imask/esm/composable.js
function useIMask(props2) {
  var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, emit = _ref.emit, onAccept = _ref.onAccept, onComplete = _ref.onComplete;
  props2 = isRef(props2) ? props2 : ref(props2);
  var el = ref();
  var mask = ref();
  var masked = ref();
  var unmasked = ref();
  var typed = ref();
  var $el;
  var $masked;
  var $unmasked;
  var $typed;
  function _onAccept2() {
    $typed = typed.value = mask.value.typedValue;
    $unmasked = unmasked.value = mask.value.unmaskedValue;
    $masked = masked.value = mask.value.value;
    if (emit) {
      emit("accept", $masked);
      emit("accept:masked", $masked);
      emit("accept:typed", $typed);
      emit("accept:unmasked", $unmasked);
    }
    if (onAccept)
      onAccept();
  }
  function _onComplete2() {
    if (emit) {
      emit("complete", $masked);
      emit("complete:masked", $masked);
      emit("complete:typed", $typed);
      emit("complete:unmasked", $unmasked);
    }
    if (onComplete)
      onComplete();
  }
  function _initMask2() {
    $el = el.value;
    var $props = props2.value;
    if (!$el || !($props !== null && $props !== void 0 && $props.mask))
      return;
    mask.value = IMask($el, $props).on("accept", _onAccept2).on("complete", _onComplete2);
    _onAccept2();
  }
  function _destroyMask2() {
    if (mask.value) {
      mask.value.destroy();
      mask.value = null;
    }
  }
  onMounted(_initMask2);
  onUnmounted(_destroyMask2);
  watch(unmasked, function() {
    if (mask.value)
      $unmasked = mask.value.unmaskedValue = unmasked.value;
  });
  watch(masked, function() {
    if (mask.value)
      $masked = mask.value.value = masked.value;
  });
  watch(typed, function() {
    if (mask.value)
      $typed = mask.value.typedValue = typed.value;
  });
  watch([el, props2], function() {
    var $newEl = el.value;
    var $props = props2.value;
    if (!($props !== null && $props !== void 0 && $props.mask) || $newEl !== $el)
      _destroyMask2();
    if ($newEl) {
      if (!mask.value) {
        _initMask2();
      } else {
        mask.value.updateOptions($props);
      }
    }
  });
  return {
    el,
    mask: readonly(mask),
    masked,
    unmasked,
    typed
  };
}

// node_modules/vue-imask/esm/component3-composition.js
var VALUE_PROPS = ["typed", "unmasked", "value", "modelValue"];
function _extractOptionsFromProps(props2) {
  props2 = Object.assign({}, props2);
  Object.keys(props2).filter(function(prop) {
    return props2[prop] === void 0;
  }).forEach(function(undefinedProp) {
    delete props2[undefinedProp];
  });
  VALUE_PROPS.forEach(function(p) {
    return delete props2[p];
  });
  return props2;
}
var Component3 = {
  name: "imask-input",
  inheritAttrs: false,
  setup: function setup(props2, _ref) {
    var attrs = _ref.attrs;
    _ref.slots;
    var emit = _ref.emit;
    var _useIMask = useIMask(_extractOptionsFromProps(props2), {
      emit,
      onAccept: function onAccept() {
        var v = masked.value;
        emit("accept:value", v);
        emit("update:value", v);
        emit("update:masked", v);
        emit("update:modelValue", v);
        emit("update:unmasked", unmasked.value);
        emit("update:typed", typed.value);
      },
      onComplete: function onComplete() {
        emit("complete:value", masked.value);
      }
    }), el = _useIMask.el;
    _useIMask.mask;
    var masked = _useIMask.masked, unmasked = _useIMask.unmasked, typed = _useIMask.typed;
    var pvalue = toRef(props2, "value");
    var pmodelValue = toRef(props2, "modelValue");
    var punmasked = toRef(props2, "unmasked");
    var ptyped = toRef(props2, "typed");
    masked.value = pmodelValue.value || pvalue.value || "";
    unmasked.value = punmasked.value;
    typed.value = ptyped.value;
    watch(pvalue, function(v) {
      return masked.value = v;
    });
    watch(pmodelValue, function(v) {
      return masked.value = v;
    });
    watch(punmasked, function(v) {
      return unmasked.value = v;
    });
    watch(ptyped, function(v) {
      return typed.value = v;
    });
    return function() {
      var data = Object.assign({}, attrs, {
        value: props2.value != null ? props2.value : props2.modelValue,
        ref: el
      });
      if (!props2.mask) {
        data.onInput = function(event) {
          emit("update:modelValue", event.target.value);
          emit("update:value", event.target.value);
        };
      }
      return h("input", data);
    };
  },
  props: Object.assign({
    // plugin
    modelValue: String,
    value: String,
    unmasked: String,
    typed: {}
  }, props),
  emits: ["update:modelValue", "update:masked", "update:value", "update:unmasked", "update:typed", "accept", "accept:value", "accept:masked", "accept:unmasked", "accept:typed", "complete", "complete:value", "complete:masked", "complete:unmasked", "complete:typed"]
};

// node_modules/vue-imask/esm/component2.js
var Component2 = {
  name: "imask-input",
  render: function render(createElement) {
    var _this = this;
    var data = {
      domProps: {
        value: this.maskRef ? this.maskRef.value : this.value
      },
      on: Object.assign({}, this.$listeners)
    };
    if (!this.$props.mask) {
      data.on.input = function(event) {
        return _this.$emit("input", event.target.value);
      };
    } else {
      delete data.on.input;
    }
    return createElement("input", data);
  },
  mounted: function mounted() {
    if (!this.$props.mask)
      return;
    this._initMask();
  },
  destroyed: function destroyed() {
    this._destroyMask();
  },
  computed: {
    maskOptions: function maskOptions() {
      return this._extractOptionsFromProps(this.$props);
    }
  },
  watch: {
    "$props": {
      handler: function handler(props2) {
        var maskOptions2 = this.maskOptions;
        if (maskOptions2.mask) {
          if (this.maskRef) {
            this.maskRef.updateOptions(maskOptions2);
            if ("value" in props2)
              this._updateValue();
          } else {
            this._initMask(maskOptions2);
            if (props2.value !== this._maskValue())
              this._onAccept();
          }
        } else {
          this._destroyMask();
          if ("value" in props2)
            this.$el.value = props2.value;
        }
      },
      deep: true
    }
  },
  methods: {
    _extractOptionsFromProps: function _extractOptionsFromProps2(props2) {
      props2 = Object.assign({}, props2);
      Object.keys(props2).filter(function(prop) {
        return props2[prop] === void 0;
      }).forEach(function(undefinedProp) {
        delete props2[undefinedProp];
      });
      delete props2.value;
      delete props2.unmask;
      return props2;
    },
    _maskValue: function _maskValue() {
      if (this.unmask === "typed")
        return this.maskRef.typedValue;
      if (this.unmask)
        return this.maskRef.unmaskedValue;
      return this.maskRef.value;
    },
    _updateValue: function _updateValue() {
      var value = this.value == null && this.unmask !== "typed" ? "" : this.value;
      if (this.unmask === "typed")
        this.maskRef.typedValue = value;
      else if (this.unmask)
        this.maskRef.unmaskedValue = value;
      else
        this.maskRef.value = value;
    },
    _onAccept: function _onAccept() {
      var val = this._maskValue();
      this.$emit("input", val);
      this.$emit("accept", val);
    },
    _onComplete: function _onComplete() {
      this.$emit("complete", this._maskValue());
    },
    _initMask: function _initMask() {
      var maskOptions2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.maskOptions;
      this.maskRef = IMask(this.$el, maskOptions2).on("accept", this._onAccept.bind(this)).on("complete", this._onComplete.bind(this));
      this._updateValue();
    },
    _destroyMask: function _destroyMask() {
      if (this.maskRef) {
        this.maskRef.destroy();
        delete this.maskRef;
      }
    }
  },
  props: Object.assign({
    value: {},
    unmask: {
      validator: function validator(value) {
        return value === "typed" || typeof value === "boolean";
      }
    }
  }, props)
};

// node_modules/vue-imask/esm/component.js
var component = isVue3 ? Component3 : Component2;

// node_modules/vue-imask/esm/_rollupPluginBabelHelpers-cf650413.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

// node_modules/vue-imask/esm/directive.js
var _name;
var directive = (_name = {
  name: "imask"
}, _defineProperty(_name, isVue3 ? "beforeMount" : "bind", function(el, _ref) {
  var options = _ref.value;
  if (!options)
    return;
  initMask(el, options);
}), _defineProperty(_name, isVue3 ? "updated" : "update", function(el, _ref2) {
  var options = _ref2.value;
  if (options) {
    if (el.maskRef) {
      el.maskRef.updateOptions(options);
      if (el.value !== el.maskRef.value)
        el.maskRef._onChange();
    } else
      initMask(el, options);
  } else {
    destroyMask(el);
  }
}), _defineProperty(_name, isVue3 ? "unmounted" : "unbind", function(el) {
  destroyMask(el);
}), _name);
function fireEvent(el, eventName, data) {
  var e = document.createEvent("CustomEvent");
  e.initCustomEvent(eventName, true, true, data);
  el.dispatchEvent(e);
}
function initMask(el, opts) {
  el.maskRef = IMask(el, opts).on("accept", function() {
    return fireEvent(el, "accept", el.maskRef);
  }).on("complete", function() {
    return fireEvent(el, "complete", el.maskRef);
  });
}
function destroyMask(el) {
  if (el.maskRef) {
    el.maskRef.destroy();
    delete el.maskRef;
  }
}
export {
  IMask,
  component as IMaskComponent,
  directive as IMaskDirective,
  props as IMaskProps,
  useIMask
};
//# sourceMappingURL=vue-imask.js.map
