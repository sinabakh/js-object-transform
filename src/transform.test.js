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
});
