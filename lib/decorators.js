
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


