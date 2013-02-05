/***
 * Perform shallow copy of obj2 to obj1
 * @param obj1 copy target
 * @param obj2 object to be copied
 */
var merge =  function(obj1, obj2){
    if (obj1 && obj2) {
        for (var key in obj2) {
            obj1[key] = obj2[key];
        }
    }
};



exports.extends = function(obj1, obj2, obj3){

    if(obj1 && obj2)
    {
        merge(obj1, obj2);
        if(obj3)
            merge(obj1, obj3);
    }

    return obj1;
};
