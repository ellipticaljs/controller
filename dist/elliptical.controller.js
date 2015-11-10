
/*
 * =============================================================
 * elliptical.Controller
 * =============================================================
 *
 * Controller factory for an expressJS style application function/object
 * var Controller = new elliptical.Controller(app,'controllerName');
 *
 * For HTTP Get only
 * Controller('/@action/:id',f1,...fn,{
 *   Action1:function(req,res,next){},
 *   ActionN:function(req,res,next){},
 * });
 *
 * or:
 *   all HTTP methods
 * Controller('/@action/:id',f1,...fn,{
 *   Get:{
 *      Action1:function(req,res,next){},
 *      ActionN:function(req,res,next){},
 *   },
 *   Post:{
 *      Action1:function(req,res,next){},
 *      ActionN:function(req,res,next){},
 *   },
 *   Put:{
 *      Action1:function(req,res,next){},
 *      ActionN:function(req,res,next){},
 *   },
 *   Delete:{
 *      Action1:function(req,res,next){},
 *      ActionN:function(req,res,next){},
 *   },
 * });
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-utils'], factory);
    } else {
        root.elliptical=root.elliptical || {};
        root.elliptical.Controller = factory(root.elliptical.utils);
        root.returnExports = root.elliptical.Controller;
    }
}(this, function (utils) {


    /* Controller is a factory for the app function.
     * Example:
     * var Controller=new elliptical.Controller(app,'Company');
     * Controller('/@action',{
     *   Get:{
     *      Index:function(req,res,next){},
     *      About:function(req,res,next){},
     *      Contact:function(req,res,next){},
     *   },
     *   Post:{
     *      Contact:function(req,res,next){}
     *   }
     * }
     *
     * instead of app.get('/Company/Home',function(req,res,next){}),app.get('/Company/About',function(req,res,next){})
     *            app.get('/Company/Contact',function(req,res,next){}),app.post('/Company/Contact',function(req,res,next){})
     *
     * */
    var array=utils.array;
    var Controller;
    Controller = function (app, name) {
        this.app = app;
        this.name = name;
        /**
         * @param route {String}
         * @param obj {Object}
         * @returns {Function}
         */
        return function (route, obj) {
            var args = [].slice.call(arguments);
            var route_ = args[0];
            if (typeof route_ !== 'string') {
                throw "Controller requires a route string with an '@action' placeholder  as the first parameter";
            }
            var obj_ = args.pop();
            if (typeof obj_ === 'object') {
                if (!(obj_.Get || obj_.Post || obj_.Put || obj_.Delete )) {
                    iterateControllerActions(args, obj_, 'get', app, name);
                } else {
                    ['Get', 'Post', 'Put', 'Delete'].forEach(function (v) {
                        if (obj_[v] && typeof obj_[v] === 'function') {
                            throw "Controller requires an @action param";

                        } else {
                            iterateControllerActions(args, obj_[v], v, app, name);
                        }
                    });
                }

            } else {
                throw 'Controller requires the last function parameter to be an object';
            }
        }
    };

    function iterateControllerActions(args,obj,v,app,name){
        var length;
        for(var prop in obj){
            if(obj.hasOwnProperty(prop)){
                var clonedArgs_=array.clone(args);
                if (prop === 'Index' && !testIndexProp(clonedArgs_[0])) { //e.g.,: "/Home/Index" =>"/Home", "/Product/Index/1" => "/Product/Index/1"
                    clonedArgs_[0] = clonedArgs_[0].replace(/@action/g, '');
                }else{
                    var prop_=prop.replace(/_/g,'-'); //ex: '/Sign-In' ---> Sign_In:fn()
                    clonedArgs_[0]=clonedArgs_[0].replace(/@action/g,prop_);
                }
                length=clonedArgs_[0].length;
                if(name.toLowerCase() !=='home'){
                    clonedArgs_[0] =(length>1) ? '/' + name  + clonedArgs_[0] : '/' + name;
                }
                obj[prop].__name=name;
                obj[prop].__action=prop;
                clonedArgs_.push(obj[prop]);
                app[v.toLowerCase()].apply(app,clonedArgs_);
            }
        }
    }

    function testIndexProp(args) {
        var str = args.split('@action');
        return (str[1] && str[1].length > 1);
    }

    return Controller;
}));