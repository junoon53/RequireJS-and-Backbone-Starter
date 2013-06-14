define(['backbone','jquery', 'underscore','models/app','views/app','views/auth','models/auth','vent','image!../resources/images/cdf_blur_Bg.png'],
 function(Backbone,$,_,App,AppView,AuthView,Auth,vent,loginBg){
    var _instance = null;

    var MainView = Backbone.View.extend({
        el:  $('#main'),
        initialize: function(){
            this.listenTo(vent,'CDF.Router:index',this.addAuthView);
            this.listenTo(vent,'CDF.Models.Auth:login:success',this.createAndAddAppView);
        },
        addView: function(view,background){
            
            var self = this;
            if (this.currentView){
                
                 $('html').fadeOut(1000, function () {             
                        self.currentView.close();
                        self.currentView = view;
                        self.currentView.render();
                        self.$el.html(self.currentView.el);
                        self.currentView.$el.show();
                        document.body.background = background;
                        $('html').fadeIn(1000, function(){
                            self.currentView.$el.show();
                           
                        });
                        
                  });
            }else {
                this.currentView = view;
                this.currentView.render();
                this.$el.html(this.currentView.el);
                this.currentView.$el.show();
                document.body.background = background;
                $('html').fadeIn(1000, function(){
                    self.currentView.$el.show();                   
                });
            }
              
        },
        addAuthView: function(){
            //document.body.background = '../resources/images/cdf_blur_Bg.png';
            var bg = loginBg;
            this.addView(new AuthView(),'../resources/images/cdf_blur_Bg.png');
        },
        createAndAddAppView: function(){
                //$('body').css('background','none');
                //document.body.background = '';
                var person = this.currentView.model.get('person');
                var appView = new AppView();
                appView.model.set({

                    "clinicName":person.clinics[0].name,
                    "clinic":person.clinics[0]._id,
                    "clinics":person.clinics,
                    "userFullname":person.firstName+" "+person.lastName,
                    "user":person._id,
                    "date": new Date(),
                    "role":person.roles[person.roles.length - 1]._id,
                    "roleName":person.roles[person.roles.length - 1].name
            });

           this.addView(appView,'');
        }


    });

    function getInstance() {
        if(_instance === null) _instance = new MainView();
        return _instance;
    }

    return getInstance();

});