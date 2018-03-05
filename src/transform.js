function subTransform(object, transformer) {
  const subObject = {};
  const properties = Object.keys(transformer);
  properties.forEach((property) => {
    if (transformer[property].constructor === String) {
      let res = object[transformer[property]];
      if (!res) {
        res = object;
        transformer[property].split('.').forEach((nElement) => {
          res = res[nElement];
        });
      }
      subObject[property] = res;
    } else if (transformer[property].constructor === Object) {
      subObject[property] = subTransform(object, transformer[property]);
    } else if (transformer[property].constructor === Function) {
      subObject[property] = transformer[property](object);
    } else if (transformer[property].constructor === Boolean) {
      subObject[property] = transformer[property];
    } else if (transformer[property].constructor === Number) {
      subObject[property] = transformer[property];
    }
  });
  return subObject;
}

exports.transform = function transform(object, transformer) {
  const transformed = subTransform(object, transformer);
  return transformed;
};
