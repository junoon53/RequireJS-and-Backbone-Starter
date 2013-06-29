define(['backbone','models/auth','views/auth','vent'], function(Backbone,auth,authView,vent) {
  
  var _instance = null;

  var Router = Backbone.Router.extend({

  routes: {
    "":                  "index",    
    /*"revenue":          "revenue",
    "submit":           "submit",  
    "logout":           "logout"*/
  },
  initialize: function(){

  },
  index: function(){
    this.listenTo(vent, 'CDF.Client:getStaticData:success', this.onAppInitSuccess );
    this.listenTo(vent, 'CDF.Client:getStaticData:failed', this.onAppInitFailure );
    this.listenTo(vent, 'CDF.Views.AppView:handleLogoutClick', this.onLogout );
      
  },
  onAppInitSuccess: function(){
    console.log('launching application...');
    vent.trigger('CDF.Router:index:appInitSucceeded');
  },
  onLogout: function(){
    vent.trigger('CDF.Router:index:onLogout');
    console.log('logging out...');
  },
  onAppInitFailure: function(){
    console.log('initialization failed. halting...');
    vent.trigger('CDF.Router:index:appInitFailed');
  }

});

function getInstance() {
  if(_instance === null) _instance = new Router();
  return _instance;
}

  return  getInstance();
});