define(['backbone','models/auth','views/auth','vent'], function(Backbone,auth,authView,vent) {
  
  var _instance = null;

  var Router = Backbone.Router.extend({

  routes: {
    "":                  "index",    
    /*"revenue":          "revenue",
    "submit":           "submit",  
    "logout":           "logout"*/
  },

  index: function(){
        
    vent.trigger('CDF.Router:index');
  }

});

function getInstance() {
  if(_instance === null) _instance = new Router();
  return _instance;
}

  return  getInstance();
});