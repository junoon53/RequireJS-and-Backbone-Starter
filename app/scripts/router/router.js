define(['backbone','models/auth','views/auth','vent','utility'], function(Backbone,auth,authView,vent,utility) {
  
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
    utility.appendTextToMain('launching application...');
    vent.trigger('CDF.Router:index:appInitSucceeded');
  },
  onLogout: function(){
    vent.trigger('CDF.Router:index:onLogout');
    //utility.appendTextToMain('logging out...');
  },
  onAppInitFailure: function(){
    utility.appendTextToMain('initialization failed. halting...');
    vent.trigger('CDF.Router:index:appInitFailed');
  }

});

function getInstance() {
  if(_instance === null) _instance = new Router();
  return _instance;
}

  return  getInstance();
});