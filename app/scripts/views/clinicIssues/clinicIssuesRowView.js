define([
	'backbone',
	'jquery',
	'underscore',
	'utility',
	'collections/people/persons',
	'models/clinicIssues/clinicIssuesRow',
	'vent',
	'text!templates/clinicIssuesRow.html',
	'text!templates/yesNo.html',
	'bootstrap',
	
	], function(Backbone,$,_,utility,Persons,ClinicIssues,vent,template,yesNoTemplate){

	var ClinicIssuesRowView = Backbone.View.extend({
		//model: new ClinicIssues(),
		className: 'clinicIssuesRow row-fluid',
		events: {
			'click button.yesOption': 'addNewDoctor',
			'click button.noOption' : 'hidePopover',	
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
		},
		doctorsMap:  {},
		initialize: function() {
			this.yesNoTemplate = _.template(yesNoTemplate);
			this.template = _.template(template);
			//this.listenTo(this.model,'remove',this.delete);
			this.listenTo(this.model,'validated:valid',this.onValid);
			this.listenTo(this.model,'validated:invalid',this.onInvalid);
			Backbone.Validation.bind(this);
		},
		onClose: function(){
		},
		edit: function(ev) {
			ev.preventDefault();
			var targetClass = ev.currentTarget.className.split(" ")[0];
			var el = this.$('.'+targetClass);
			var valueId = el.attr('valueId');
			var value = el.val();
			if(el.attr('valueId') === 'null'
			&& el.val().length > 0 ) {
				this.whenValueIsNotSelected(targetClass,this.$('.'+targetClass).attr("value"));
			}

		
		},
		exitColumn: function(ev) {
			var targetClass = ev.currentTarget.className.split(" ")[0];
			switch(targetClass){
				case "doctor":
					this.model.set(targetClass,this.$('.doctor').attr("value"));
					var propertyValue = this.$('.doctor').attr("valueId");
					if(propertyValue !== "null") {
						this.model.set('doctor', parseInt(propertyValue,10));
					} 
					this.model.isValid(true);
					break;
				case "issue":
					this.model.set('issue',this.$('.issue').attr("value"));
				    this.model.isValid(true);
					break;
			}

		},
		whenValueIsNotSelected : function(targetClass,value){
			this.$("."+targetClass).tooltip('destroy');
			var yesNoTemplate = this.yesNoTemplate({message:'Add new '+targetClass+'?',id:targetClass});
			
			this.$("."+targetClass).popover({html: true, placement:'top',content:yesNoTemplate});
			this.$("."+targetClass).popover('show');
		},
    	hidePopover: function(ev){
			ev.preventDefault();
			this.$('.'+ev.currentTarget.parentElement.id).popover('destroy');
		},
		addNewDoctor: function(ev){
			ev.preventDefault();
			var targetClass = ev.currentTarget.parentElement.id;
			this.$('.'+targetClass).popover('destroy');
			var value =  this.$('.'+targetClass).val();
			var self = this;
				function newDoctorAdded(doctorModel) {
					self.$('.doctor').val(utility.toTitleCase(doctorModel.get('firstName')+" "+doctorModel.get('lastName')));
					self.$('.doctor').attr('valueId',doctorModel.get('_id'));
					self.model.set('doctor',doctorModel.get('_id'));
					self.model.set('doctorName',doctorModel.get('firstName')+" "+doctorModel.get('lastName')); 
					self.model.isValid(true);
				}

				vent.trigger('CDF.Views.ClinicIssues.ClinicIssuesRowView:addNewDoctor',{doctorNameString:value,callback:newDoctorAdded});
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.exitColumn(ev);
			}else{
				switch(ev.currentTarget.className.split(" ")[0]){
				case "doctor":
					//this.$('.removeAttr').doctorName('readonly').focus();
					this.$('.doctor').attr("valueId", "null");
					this.model.set("doctor","null");
					//this.$('.doctorName').val("");
					break;
				case "issue":
					//this.$('.issue').removeAttr('readonly', true).focus();
					break;
				}
				
			}
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.ClinicIssues.ClinicIssuesRowView:delete');			
			this.close();
		},
		onValid: function(view,errors){
			var self = this;
			vent.trigger('CDF.Views.ClinicIssues.ClinicIssuesRowView:onValid');
			_.each(this.model.attributes,function(value,key){
				this.$('.'+key).popover('destroy');
				self.$("."+key).tooltip('destroy');
				self.$('.'+key).removeClass('input-validation-error');
			});
		},
		onInvalid: function(view,errors){
		    var self = this;
			_.each(this.model.attributes,function(value,key){
				self.$("."+key).tooltip('destroy');
				self.$('.'+key).removeClass('input-validation-error');
			});
			_.each(errors,function(value,key){
				self.$("."+key).tooltip({placement:'top',title:value,trigger:'focus hover'});
				self.$('.'+key).addClass('input-validation-error');
			});
		},
		render: function() {
			this.model.set("rowId",this.model.cid,{silent:true});
			this.$el.html(this.template(this.model.toJSON()));
			this.model.isValid(true);
			function source(collection,roles) {

				return function(query,process){
					var map = this.options.map;
					collection.fetch({data:{searchString:query,roles:roles},success: function(){
						var result = [];
						var data = collection.toJSON();								
						 _.each(data,function(element,index,data){
						 var name = utility.toTitleCase(element.firstName+" "+element.lastName)+' # '+element._id;
							 result.push(name);
						 map[name] = (element._id);
						});

						process(result);
					}});
			}

			};
			
			function updater(item){
				 
			 	 $( "#"+this.options.id ).attr("valueId", this.options.map[ item ] );
				 return item;
		 
			};
			this.$('.doctor').typeahead({source:source(new Persons(),[1,2]),updater:updater,minLength:3,id:"doctor"+this.model.cid,map:this.doctorsMap});
			return this;
		}
	
	});

	return ClinicIssuesRowView;

});