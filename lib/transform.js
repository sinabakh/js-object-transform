'use strict';

function subTransform(object, transformer, _ref) {
  var strict = _ref.strict;

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
        if (strict && res === undefined) {
          res = null;
        }
      }
      subObject[property] = res;
    } else if (transformer[property].constructor === Object) {
      subObject[property] = subTransform(object, transformer[property], { strict: strict });
    } else if (transformer[property].constructor === Function) {
      subObject[property] = transformer[property](object);
      if (strict && subObject[property] === undefined) {
        subObject[property] = null;
      }
    } else if (transformer[property].constructor === Boolean) {
      subObject[property] = transformer[property];
    } else if (transformer[property].constructor === Number) {
      subObject[property] = transformer[property];
    }
  });
  return subObject;
}

exports.transform = function transform(object, transformer, options) {
  var strict = false;
  if (options && options.strict) {
    strict = true;
  }
  var transformed = subTransform(object, transformer, { strict: strict });
  return transformed;
};