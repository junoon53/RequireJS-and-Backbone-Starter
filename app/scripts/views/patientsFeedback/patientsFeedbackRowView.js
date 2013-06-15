define([
	'backbone',
	'jquery',
	'underscore',
	'utility',
	'collections/people/persons',
	'models/patientsFeedback/patientsFeedbackRow',
	'vent',
	'text!templates/patientsFeedbackRow.html',
	'text!templates/yesNo.html',
	'bootstrap',
	
	], function(Backbone,$,_,utility,Persons,PatientsFeedback,vent,template,yesNoTemplate){

	var PatientsFeedbackRowView = Backbone.View.extend({
		//model: new PatientsFeedback(),
		className: 'patientsFeedbackRow row-fluid',
		events: {
			'click button.yesOption': 'addNewPatient',
			'click button.noOption' : 'hidePopover',	
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
		},
		patientsMap:  {},
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
				case "patient":
				    this.model.set(targetClass,this.$('.patient').attr("value"));
						var propertyValue = this.$('.patient').attr("valueId");
						if(propertyValue !== "null") 
							this.model.set('patient', parseInt(propertyValue,10));
						this.model.isValid(true);
					break;
				case "feedback":
					this.model.set('feedback',this.$('.feedback').attr("value"));
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
		addNewPatient: function(ev){
			ev.preventDefault();
			var targetClass = ev.currentTarget.parentElement.id;
			this.$('.'+targetClass).popover('destroy');
			var value =  this.$('.'+targetClass).val();
			var self = this;
				function newPatientAdded(personModel) {
					self.$('.patient').val(utility.toTitleCase(personModel.get('firstName')+" "+personModel.get('lastName')));
					self.$('.patient').attr('valueId',personModel.get('_id'));
					self.model.set('patient',personModel.get('_id'));
					self.model.set('patientName',personModel.get('firstName')+" "+personModel.get('lastName')); 
					self.model.isValid(true);
				}
				vent.trigger('CDF.Views.PatientsFeedback.PatientsFeedbackRowView:addNewPatient',{patientNameString:value,callback:newPatientAdded});
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.edit(ev);
			}else{
  				switch(ev.currentTarget.className.split(" ")[0]){
				case "patient":
					//this.$('.removeAttr').patientName('readonly').focus();
					this.$('.patient').attr("valueId", "null");
					this.model.set("patient","null",{silent:true});
					//this.$('.patient').val("");
					break;
				case "feedback":
					//this.$('.feedback').removeAttr('readonly', true).focus();
					break;
				}
				
			}
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.PatientsFeedback.PatientsFeedbackRowView:delete');			
			this.close();
		},
		onValid: function(view,errors){
			var self = this;
			vent.trigger('CDF.Views.PatientsFeedback.PatientsFeedbackRowView:onValid');
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
			this.$('.patient').typeahead({source:source(new Persons(),[0]),updater:updater,minLength:3,id:"patient"+this.model.cid,map:this.patientsMap});
			return this;
		}
	
	});

	return PatientsFeedbackRowView;

});