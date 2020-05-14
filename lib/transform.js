function subTransform(object, transformer, { strict, source, actions }) {
  const subObject = source || {};
  const properties = Object.keys(transformer);

  properties.forEach(property => {
    let transformerActions = [];
    let transformerProperty = transformer[property];

    if (transformerProperty.constructor === Array) {
      // this is an array of [<property>, ...<action>]
      const firstProperty = transformerProperty.shift();
      transformerActions = transformerProperty;
      transformerProperty = firstProperty;
    }

    if (transformerProperty.constructor === String) {
      let res = object ? object[transformerProperty] : undefined;
      if (!res) {
        res = object;
        transformerProperty.split('.').forEach(nElement => {
          if (res) {
            res = res[nElement];
          }
        });
        if (strict && res === undefined) {
          res = null;
        }
      }
      subObject[property] = res;
    } else if (transformerProperty.constructor === Object) {
      subObject[property] = subTransform(object, transformerProperty, { strict });
    } else if (transformerProperty.constructor === Function) {
      subObject[property] = transformerProperty(object);
      if (strict && subObject[property] === undefined) {
        subObject[property] = null;
      }
    } else if (transformerProperty.constructor === Boolean) {
      subObject[property] = transformerProperty;
    } else if (transformerProperty.constructor === Number) {
      subObject[property] = transformerProperty;
    }

    // now we process actions, if there are any
    if (Array.isArray(transformerActions) && transformerActions.length > 0) {
      subObject[property] = transformerActions.reduce((current, action) => {
        if (action && actions[action]) {
          return actions[action](current);
        }
        console.warn('action "%s" not found', action);
        return current;
      }, subObject[property]);
    }
  });
  return subObject;
}

exports.transform = function transform(object, transformer, options = {}) {
  const { strict = false, source = undefined, actions = {} } = options;
  return subTransform(object, transformer, { strict, source, actions });
};