
// This js file handels login & register for user and every request to cloud passes throw this js file


function register(form) { 
	username_=form.name.value;
	email_=form.email.value;
	password_=form.password.value;
  	url_register=get_right_url('register');
  	json_={
		username:username_,
		password:password_,
		email:email_
	}
	$.ajax({
	    url: url_register,
	    type: 'post',
	    crossDomain: true,
	    contentType: 'application/json',
	    processData:false,
	    data: JSON.stringify(json_),
	    dataType: 'json',
	    success: function(result) {
	    	if(has(result,'err')){ // connection to server is ok but registeration was not completed successfully
	    		alert(result.err);
	    	}
	    	else{ 
	    		//registration was completed successfully
				// result should have token attribute
				$.cookie('username', username_ ,{ path: '/' });
				$.cookie('password', password_ ,{ path: '/' });
	    		$.cookie('token',    result.token,{ path: '/' });
	    		alert('finished');
	    	}
	    },
	    error: function(xhr, ajaxOptions, thrownError) {
	    	alert('error');
	    }
	});
}

function login(form) {
	alert('aaa'); 
	username_=form.name.value;
	password_=form.password.value;
  	json_={
		"username":username_,
		"password":password_
	}
	$.ajax({
	    url: '<ENTER_YOUR_SERVER_ADDRESS>/login',
	    type: 'post',
	    crossDomain: true,
	    contentType: 'application/json',
	    processData:false,
	    data: JSON.stringify(json_),
	    dataType: 'json',
	    success: function(result) {
			alert('good');
	    },
	    error: function(xhr, ajaxOptions, thrownError) {
			console(xhr);
			console(ajaxOptions);
			console(thrownError);
	    }
	});
}

function has(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
}

function get_right_url(action){
	url='';
	switch(action) {
	    case 'register':
	        url='<ENTER_YOUR_SERVER_ADDRESS>/reg'
	        break;
	    case 'login':
	        url='<ENTER_YOUR_SERVER_ADDRESS>/login'
	        break;
	    default:
			break;
	}
	return url;
}