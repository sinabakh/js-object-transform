'use strict';

function subTransform(object, transformer) {
  var subObject = {};
  var properties = Object.keys(transformer);
  properties.forEach(function (property) {
    if (transformer[property].constructor === String) {
      var res = object[transformer[property]];
      if (!res) {
        res = object;
        transformer[property].split('.').forEach(function (nElement) {
          res = res[nElement];
        });
      }
      subObject[property] = res;
    } else if (transformer[property].constructor === Object) {
      subObject[property] = subTransform(object, transformer[property]);
    } else if (transformer[property].constructor === Function) {
      subObject[property] = transformer[property](object);
    } else if (transformer[property].constructor === Number) {
      subObject[property] = transformer[property];
    }
  });
  return subObject;
}

exports.transform = function transform(object, transformer) {
  var transformed = subTransform(object, transformer);
  return transformed;
};