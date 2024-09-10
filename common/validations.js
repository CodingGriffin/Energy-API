const isValidEmail = (email) => {

  if (typeof email !== 'string') {
    return false;
  }

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

const isValidPasswordLength = (password) => {

  if (typeof password !== 'string') {
    return false;
  }

  if (password.length < 8) {
    return false;
  }

  return true;
}

module.exports = {
  isValidEmail,
  isValidPasswordLength
};