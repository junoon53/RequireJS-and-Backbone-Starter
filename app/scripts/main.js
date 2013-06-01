require.config({
  paths: {
    'jquery': 'vendor/jquery/jquery',
    'underscore': 'vendor/underscore-amd/underscore',
    'text': 'vendor/text/text',
    'bootstrap' : 'vendor/bootstrap/docs/assets/js/bootstrap',
    'datetimepicker': 'vendor/bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min',
    'templates': '../templates',
    'backbone-validation':'vendor/backbone-validation/dist/backbone-validation-amd',  
    'backbone': 'vendor/backbone-amd/backbone'    
  },
  shim: {
  	'bootstrap' : {
  		deps: ['jquery']
  	},
  	'datetimepicker' : {
  		deps: ['bootstrap']
  	}
  }
});

require(['backbone',         
         'views/mainView',
         'router/router',
         'models/people/roles',
         'collections/revenue/paymentOptions',
         'backbone-validation'], 
         function(Backbone,MainView,router,roles,paymentOptions,validation) {

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

  _.extend(Backbone.Model.prototype, validation.mixin);

  roles().fetch();
  paymentOptions().fetch();

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