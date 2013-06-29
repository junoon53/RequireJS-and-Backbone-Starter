require.config({
  waitSeconds : 45, //should be enough to load images
  paths: {
    'jquery': 'vendor/jquery/jquery',
    'underscore': 'vendor/underscore-amd/underscore',
    'text': 'vendor/requirejs-text/text',
    'bootstrap' : 'vendor/bootstrap/docs/assets/js/bootstrap',
    'cryptojs':'vendor/cryptojs/rollups/aes',
    'cryptojs-enc-utf16':'vendor/cryptojs/components/enc-utf16-min',
    'datetimepicker': 'vendor/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min',
    'templates': '../templates',
    'backbone-validation':'vendor/backbone-validation/dist/backbone-validation-amd',  
    'backbone': 'vendor/backbone-amd/backbone',  
    'localStorage': 'vendor/backbone.localStorage/backbone.localStorage',
    'image' : 'vendor/requirejs-plugins/src/image',
    'img' : '../resources/images',
    'utility': 'utility',
    'config' : 'config'  
  },
  shim: {
  	'bootstrap' : {
  		deps: ['jquery']
  	},
  	'datetimepicker' : {
  		deps: ['bootstrap']
  	},
    'cryptojs': {

    },
    'cryptojs-enc-utf16': {

    }
  }
});

require(['backbone',         
         'views/mainView',
         'router/router',
         'models/client',
         'backbone-validation'
         ], 
         function(Backbone,MainView,router,client,validation) {

  Backbone.View.prototype.close = function(){
    this.remove();
    this.off();
    this.undelegateEvents();
    this.stopListening();
    this.model.off();
    this.model.stopListening();

    if (this.onClose){
      this.onClose();
      if(this.model.onClose){
          this.model.onClose();
      }
    }
  };

  //_.extend(Backbone.Model.prototype, validation.mixin);

 
  console.log('CDF Clinics Feedback System - v0.1.0');
  console.log('Designed and built by Vikram Pawar [ junoon.53@gmail.com ]');
  console.log('initializing...');

 var clientInstance = client();

 clientInstance.fetch({

    success:function(model, response,options){
      if(!model.get('clientKey')) {
        clientInstance.authenticate();
     } 
      else {
       console.log('using existing client credentials')}
       clientInstance.getStaticData();
    },
    error:function(){
      clientInstance.authenticate();
    }

});




  Backbone.history.start({pushState: true, hashChange: true });

    $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
    // Get the absolute anchor href.
    var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
    // Get the absolute root.
    var root = location.protocol + "//" + location.host + "";

    // Ensure the root is part of the anchor href, meaning it's relative.
    if (href.prop.slice(0, root.length) === root) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events. The Router's internal `navigate` method
      // calls this anyways.  The fragment is sliced from the root.
      Backbone.history.navigate(href.attr, true);
    }

 });

});