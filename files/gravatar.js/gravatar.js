var gravatar = {};
gravatar.getImage = function(email, size) {
  return '<img src="https://secure.gravatar.com/avatar/' + md5(email.trim().toLowerCase()) + '?s=' + size + '&d=mm">';
}

gravatar.getImageWithType = function(email, size, filetype) {
  return '<img src="https://secure.gravatar.com/avatar/' + md5(email.trim().toLowerCase()) + '?s=' + size + '&d=mm ' + filetype + '">';
}

gravatar.getUserProfile = function(email) {
  return 'https://secure.gravatar.com/' + md5(email.trim().toLowerCase());
}
