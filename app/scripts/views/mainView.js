define(['backbone','jquery', 'underscore','models/app','views/app','vent'], function(Backbone,$,_,Application,AppView,vent){

    var mainView = Backbone.View.extend({
        el:  $('#main'),
        initialize: function(){
            this.listenTo(vent,'CDF.Router:index',this.addView);
            this.listenTo(vent,'CDF.Models.Auth:login:success',this.createAndAddAppView);
        },
        addView: function(view){
            if (this.currentView){
              this.currentView.close();
        }
         
            this.currentView = view;
            this.currentView.render();
         
            this.$el.html(this.currentView.el);
        },
        createAndAddAppView: function(authModel){
            var application = new Application();
                application.set({"clinicName":authModel.get('primaryClinicName'),
                "clinicId":authModel.get('clinics')[0],
                "userFullname":authModel.get('firstName')+" "+authModel.get('lastName'),
                "doctorId":authModel.get('doctorId'),
                "userId":authModel.get('_id'),
                "date":new Date()
            });

           var appView = new AppView({model: application});
           this.addView(appView);
        }


    });

    return mainView;

});