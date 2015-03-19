//General functions for a lot of plugins
//Returns true if the email is well formed
function check_email( cadena ) {
	var answer=false;
	var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
	if (filter.test(cadena)) {
		answer=true;
	}
	return answer;
}

//Returns true if there is an email is in the text	
function email_intext ( cadena ) {
	var answer=false;
	var emailsArray = cadena.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
	if (emailsArray)
		answer=true;
	return answer;
}
