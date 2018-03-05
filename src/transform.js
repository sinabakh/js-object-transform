function subTransform(object, transformer, { strict }) {
  const subObject = {};
  const properties = Object.keys(transformer);
  properties.forEach((property) => {
    if (transformer[property].constructor === String) {
      let res = object[transformer[property]];
      if (!res) {
        res = object;
        transformer[property].split('.').forEach((nElement) => {
          if (res) {
            res = res[nElement];
          }
        });
        if (strict && res === undefined) {
          res = null;
        }
      }
      subObject[property] = res;
    } else if (transformer[property].constructor === Object) {
      subObject[property] = subTransform(object, transformer[property], { strict });
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
  let strict = false;
  if (options && options.strict) {
    strict = true;
  }
  const transformed = subTransform(object, transformer, { strict });
  return transformed;
};
