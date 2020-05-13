function subTransform(object, transformer, { strict, source = null }) {
  const subObject = source || {};
  const properties = Object.keys(transformer);
  properties.forEach(property => {
    if (transformer[property].constructor === String) {
      let res = object ? object[transformer[property]] : undefined;
      if (!res) {
        res = object;
        transformer[property].split('.').forEach(nElement => {
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

exports.transform = function transform(object, transformer, options = {}) {
  const { strict = false, source = undefined } = options;
  return subTransform(object, transformer, { strict, source });
};