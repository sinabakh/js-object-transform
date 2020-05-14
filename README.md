# object-transform
Transform your objects to desired rich ones using declarative rules.

```javascript
const transform = require('transformobject').transform;

const obj = {
  secret: 'Secret Data',
  username: 'John Doe',
  nested: {
    username: 'Nested John Doe',
  },
  'flat.nested.username': 'Flat John Doe',
  phoneNumber: '+989191331313',
  date: new Date(),
  nullField: null,
};

const transformer = {
  username: 'username',
  nestedUsername: 'nested.username',
  flatUsername: 'flat.nested.username',
  phone: {
    number: 'phoneNumber',
  },
  constantNumber: 4,
  booleanField: true,
  day: function (originObject) {
    return originObject.date.getDate();
  },
  nullField: 'nullField',
  undefinedField: 'unknownField',
  nonExistingNested: 'nested.username.verification.isVerified',  
};


const transformed = transform(obj, transformer);

// { username: 'John Doe',
//   nestedUsername: 'Nested John Doe',
//   flatUsername: 'Flat John Doe',
//   phone: { number: '+989191331313' },
//   constantNumber: 4,
//   booleanField: true,
//   day: 3,
//   nullField: null,
//   undefinedField: undefined,
//   nonExistingNested: undefined}




```


## Options
Using strict option, transformer changes `undefined` fields to `null` fields, so they
will not be omitted when stringified

### strict
```javascript
const transformed = transform(obj, transformer, { strict: true });

// { username: 'John Doe',
//   nestedUsername: 'Nested John Doe',
//   flatUsername: 'Flat John Doe',
//   phone: { number: '+989191331313' },
//   constantNumber: 4,
//   booleanField: true,
//   day: 3,
//   nullField: null,
//   undefinedField: null,
//   nonExistingNested: null}
```

### source
Providing a source object will write the transformed values into the source instead of  creating a new object
```javascript
const transformed = transform(obj, transformer, { source: { a: 1, b: 2, house: { name: 'Brambles'} } });

// { 
//   a: 1,
//   b: 2,
//   house: { name: 'Brambles' },
//   username: 'John Doe',
//   nestedUsername: 'Nested John Doe',
//   flatUsername: 'Flat John Doe',
//   phone: { number: '+989191331313' },
//   constantNumber: 4,
//   booleanField: true,
//   day: 3,
//   nullField: null,
//   undefinedField: null,
//   nonExistingNested: null}
```

### actions
Providing an `actions` object will allow the actions to be reused across transforms, this provides the ability to process  fields using an array syntax to share functionality.

The array syntax works as follows:

The first field is the lookup, same as before, all additional fields are executed in order passing the result along the chain.
`['username', 'undefinedIfEmptyString']`

Example
```javascript
const ucwords = require('ucwords'); // example npm install
const camelCase = require('lodash.camcelcase'); // example npm install

const obj = {
  username: 'John Doe',
  nested: {
    username: 'Nested John Doe',
  },
};

const transformer = {
  username: ['username', 'camelCase', 'undefinedIfEmptyString'],
  nestedUsername: ['nested.username', 'ucwords', 'undefinedIfEmptyString'],
};

const transformed = transform(
  obj, 
  transformer, 
  {
    actions: {
      camelCase: value => camelCase(value),
      ucwords: value => ucwords(value),
      undefinedIfEmptyString: value => value === "" ? undefined : value,
    } 
  }
);
```

Actions can be combined with both `strict` and `source`. If an action is not defined but is used, a console warning will be logged. 
