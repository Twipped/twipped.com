
/**
 * This is just here so we can eliminate the object-assign dependency from builds.
 */
module.exports = exports = function objectAssign (...args) { // eslint-disable-line
  return Object.assign(...args);
};
