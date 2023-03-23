import { toLowerCase, trim, toDate, toBoolean, toNumber } from './cast.helper';

describe('CastHelpers', () => {
  describe('toLowerCase', () => {
    it('Should transform string to lower case', () => {
      expect(toLowerCase('THIS IS UPPER CASE?')).toBe('this is upper case?');
    });

    it('Should not transform lower case', () => {
      expect(toLowerCase('this is lower case')).toBe('this is lower case');
    });
  });

  describe('trim', () => {
    it('Should trim beggning and end blank spaces', () => {
      expect(trim('     LOL    ')).toBe('LOL');
    });

    it('Should not remove middle spaces', () => {
      expect(trim('    this string is loooong      ')).toBe(
        'this string is loooong',
      );
    });
  });

  describe('toDate', () => {
    it('should return a date object from a date only format', () => {
      const spy = jest.spyOn(global, 'Date');
      const dateObj = toDate('2020-01-01');
      const dateSpy = spy.mock.instances[0];

      expect(dateObj).toEqual(dateSpy);
    });
  });

  describe('toBoolean', () => {
    it('should transform true string into a boolean true', () => {
      const flag = toBoolean('true');
      expect(typeof flag).toBe('boolean');
    });
    it('should transform 1 string into a boolean true', () => {
      const flag = toBoolean('1');
      expect(typeof flag).toBe('boolean');
    });
    it('should transform other things string into a boolean false', () => {
      const flag = toBoolean('Qwik');
      expect(typeof flag).toBe('boolean');
    });
  });

  describe('toNumber', () => {
    it('Should return valid number', () => {
      expect(toNumber('204')).toBe(204);
    });
    it('Should return valid number', () => {
      expect(toNumber('2041231231231231')).toBe(2041231231231231);
    });
    it('Should return a 0 with a non valid number', () => {
      expect(toNumber('number x')).toBe(0);
    });
  });
});
