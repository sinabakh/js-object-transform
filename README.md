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
};


const transformed = transform(obj, transformer);

// { username: 'John Doe',
//   nestedUsername: 'Nested John Doe',
//   flatUsername: 'Flat John Doe',
//   phone: { number: '+989191331313' },
//   constantNumber: 4,
//   booleanField: true,
//   day: 3 }

```
