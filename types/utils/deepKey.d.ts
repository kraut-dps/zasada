/**
 * по массиву или объекту ключей из всех источников собрать конечный объект
 * example:
 * deepKey( [ 'prop1', 'prop2' ], { prop1: 10 }, { prop2: 20 } ) =
 * { prop1: 10, prop2: 20 }
 * @param {Object|Array} mKeys
 * @param {...object} aSources
 */
export function deepKey(mKeys: any | any[], ...aSources: object[]): {};
