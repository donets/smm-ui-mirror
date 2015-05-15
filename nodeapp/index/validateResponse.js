

module.exports = function(response) {
  if (!response.guessedCity) {
    console.error('guessedCity property missing');
    return false;
  }
  if (!response.country) {
    console.error('country property missing');
    return false;
  }
  if (!response.country.defaultDomain) {
    console.error('country.defaultDomain property missing');
    return false;
  }
  if (!response.country.defaultDomain.absUrlBase) {
    console.error('country.defaultDomain.absUrlBase property missing');
    return false;
  }
  return true;
};
