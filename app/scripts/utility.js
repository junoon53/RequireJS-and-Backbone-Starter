define([], function(){

	var UtilityFunctions = {

		toTitleCase: function(str) {
		    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		},
		appendTextToMain: function(str) {
			$('#main').append('<p>'+str+'</p>');
		}
	};
	return UtilityFunctions;
});
	

