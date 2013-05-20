define(['backbone','models/auth','views/auth','vent'], function(Backbone,Auth,AuthView,vent) {
  var Router = Backbone.Router.extend({

  routes: {
    "":                  "index",    
    /*"revenue":          "revenue",
    "submit":           "submit",  
    "logout":           "logout"*/
  },

  index: function(){

    var authView =  new AuthView({model: new Auth()});     
      
    vent.trigger('CDF.Router:index',authView);

  }

});

  
  return  Router;
});