'use strict';



//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        root.elliptical = root.elliptical || {};
        root.elliptical.Controller = factory();
        root.returnExports = root.elliptical.Controller;
    }
})(this, function () {
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Controller = function Controller(app, name, route) {
        _classCallCheck(this, Controller);

        this._app = app;
        var ctrlProto = Object.getPrototypeOf(this);
        var controllerActions = [];
        //to handle possibility of inheritance, we must traverse the prototype chain to find available actions
        // use checkName to discard duplicate actions found further down the chain
        do {
            //test if we have reached the end
            var test = Object.getPrototypeOf(ctrlProto);
            if (test) {
                var actions = Object.getOwnPropertyNames(ctrlProto);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var action = _step.value;

                        var fn = ctrlProto[action];
                        var method = 'get';
                        if (action !== 'constructor') {
                            if (!(fn instanceof Function)) {
                                method = fn.method;
                                fn = fn.value;
                            }
                            if (checkName(action, controllerActions)) {
                                bindControllerAction(fn, action, method, route, name, app, this);
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        } while (ctrlProto = Object.getPrototypeOf(ctrlProto));
    };

    function checkName(action, controllerActions) {
        var isValid = true;
        controllerActions.forEach(function (a) {
            if (a.toLowerCase() === action.toLowerCase()) isValid = false;else controllerActions.push(action);
        });
        return isValid;
    }

    function bindControllerAction(actionFn, actionName, method, route, controllerName, app, controllerContext) {
        var length;
        if (actionName === 'Index' && !testIndexProp(route)) {
            //e.g.,: "/Home/Index" =>"/Home", "/Product/Index/1" => "/Product/Index/1"
            route = route.replace(/@action/g, '');
        } else {
            var actionName_ = actionName.replace(/_/g, '-'); //ex: '/Sign-In' ---> Sign_In:fn()
            route = route.replace(/@action/g, actionName_);
        }
        length = route.length;
        if (!(controllerName.toLowerCase() === 'home' && actionName.toLowerCase() === 'index')) {
            //don't rewrite '/' as '/Home/Index'
            route = length > 1 ? '/' + controllerName + route : '/' + controllerName;
        }

        //bind controller "this" context to controller action methods
        actionFn = actionFn.bind(controllerContext);
        ///private props to maintain controller name/action reference in the event of js minification
        actionFn.__name = controllerName;
        actionFn.__action = actionName;
        app[method.toLowerCase()].call(controllerContext, route, actionFn);
    }

    /**
     *
     * @param {string} args
     * @returns {boolean}
     * @private
     */
    function testIndexProp(args) {
        var str = args.split('@action');
        return str[1] && str[1].length > 1;
    }

    return Controller;
});


//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {

        root.elliptical.ControllerDecorators = factory();
        root.returnExports = root.elliptical.ControllerDecorators;
    }
}(this, function () {

    return{
        get:function(target, prop, descriptor){
            var fn=descriptor.value;
            descriptor.value={
                method:'get',
                value:fn
            }
        },
        post:function(target, prop, descriptor){
            var fn=descriptor.value;
            descriptor.value={
                method:'post',
                value:fn
            }
        },
        put:function(target, prop, descriptor){
            var fn=descriptor.value;
            descriptor.value={
                method:'put',
                value:fn
            }
        },
        delete:function(target, prop, descriptor){
            var fn=descriptor.value;
            descriptor.value={
                method:'delete',
                value:fn
            }
        }
    }

}));


