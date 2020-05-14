import { transform } from './transform';

describe('Transform', () => {
  describe('Inputs', () => {
    describe('Strict', () => {
      const user = { firstName: 'John', lastName: undefined };
      const transformer = { first: 'firstName', last: 'lastName' };
      it('defaults when not passed', () => {
        const result = transform(user, transformer);
        expect(result.last).toBeUndefined();
      });
      it('undefined when not strict', () => {
        const result = transform(user, transformer);
        expect(result.last).toBeUndefined();
      });
      it('null when strict', () => {
        const result = transform(user, transformer, { strict: true });
        expect(result.last).toBeNull();
      });
    });
    describe('Source', () => {
      const user = { firstName: 'John', lastName: 'Doe' };
      const transformer = { first: 'firstName', last: 'lastName' };
      it('New object when options not passed', () => {
        const result = transform(user, transformer);
        expect(result.addressLine1).toBeUndefined();
        expect(result.first).toEqual(user.firstName);
      });
      it('New object when empty options passed', () => {
        const result = transform(user, transformer, {});
        expect(result.addressLine1).toBeUndefined();
        expect(result.first).toEqual(user.firstName);
      });
      it('New object when empty source passed', () => {
        const result = transform(user, transformer, { source: {} });
        expect(result.addressLine1).toBeUndefined();
        expect(result.first).toEqual(user.firstName);
      });
      it('Uses source when passed', () => {
        const source = { addressLine1: 'My address', addressLine2: 'Is awesome' };
        const result = transform(user, transformer, { source });
        expect(result.addressLine1).toEqual(source.addressLine1);
        expect(result.addressLine2).toEqual(source.addressLine2);
        expect(result.first).toEqual(user.firstName);
        expect(result.last).toEqual(user.lastName);
      });
    });
  });

  // Test existing functionality before adding actions
  describe('Existing access', () => {
    const now = new Date();
    const obj = {
      secret: 'Secret Data',
      username: 'John Doe',
      nested: {
        username: 'Nested John Doe',
      },
      'flat.nested.username': 'Flat John Doe',
      phoneNumber: '+989191331313',
      date: now,
      nullField: null,
    };
    it('String lookup', () => {
      const transformer = { username: 'username' };
      const transformed = transform(obj, transformer);
      expect(transformed.username).toEqual(obj.username);
    });
    it('Nested string lookup', () => {
      const transformer = { nestedUsername: 'nested.username' };
      const transformed = transform(obj, transformer);
      expect(transformed.nestedUsername).toEqual(obj.nested.username);
    });
    it('Flat string lookup', () => {
      const transformer = { flatUsername: 'flat.nested.username' };
      const transformed = transform(obj, transformer);
      expect(transformed.flatUsername).toEqual(obj['flat.nested.username']);
    });
    it('Lookup while nested', () => {
      const transformer = { phone: { number: 'phoneNumber' } };
      const transformed = transform(obj, transformer);
      expect(transformed.phone.number).toEqual(obj.phoneNumber);
    });
    it('Constant number', () => {
      const transformer = { constantNumber: 4 };
      const transformed = transform(obj, transformer);
      expect(transformed.constantNumber).toEqual(4);
    });
    it('Constant boolean', () => {
      const transformer = { booleanField: true };
      const transformed = transform(obj, transformer);
      expect(transformed.booleanField).toEqual(true);
    });
    it('Constant boolean', () => {
      const transformer = { booleanField: false };
      const transformed = transform(obj, transformer);
      expect(transformed.booleanField).toEqual(false);
    });
    it('Executes function', () => {
      const transformer = { day: (originObject) => originObject.date.getDate() };
      const transformed = transform(obj, transformer);
      expect(transformed.day).toEqual(now.getDate());
    });
    it('Null field', () => {
      const transformer = { nullField: 'nullField' };
      const transformed = transform(obj, transformer);
      expect(transformed.nullField).toEqual(obj.nullField);
    });
    it('Undefined field', () => {
      const transformer = { undefinedField: 'unknownField' };
      const transformed = transform(obj, transformer);
      expect(transformed.undefinedField).toBeUndefined();
    });
    it('Non existing nested field', () => {
      const transformer = { nonExistingNested: 'nested.username.verification.isVerified' };
      const transformed = transform(obj, transformer);
      expect(transformed.undefinedField).toBeUndefined();
    });
  });
});
