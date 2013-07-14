define([], function(){

	var UtilityFunctions = {

		toTitleCase: function(str) {
		    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		},
		appendTextToMain: function(str) {
			$('#main').append('<p>'+str+'</p>');
		},
		getLongDate: function(date) {
			var d_names = new Array("Sunday", "Monday", "Tuesday",
			"Wednesday", "Thursday", "Friday", "Saturday");

			var m_names = new Array("January", "February", "March", 
			"April", "May", "June", "July", "August", "September", 
			"October", "November", "December");

			var d =date;
			var curr_day = d.getDay();
			var curr_date = d.getDate();
			var sup = "";
			if (curr_date == 1 || curr_date == 21 || curr_date ==31)
			   {
			   sup = "st";
			   }
			else if (curr_date == 2 || curr_date == 22)
			   {
			   sup = "nd";
			   }
			else if (curr_date == 3 || curr_date == 23)
			   {
			   sup = "rd";
			   }
			else
			   {
			   sup = "th";
			   }
			var curr_month = d.getMonth();
			var curr_year = d.getFullYear();

			return (d_names[curr_day] + " " + curr_date + "<SUP>"
			+ sup + "</SUP> " + m_names[curr_month] + " " + curr_year);
		}
	};
	return UtilityFunctions;
});
	

