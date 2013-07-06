define([
	'backbone',
	'jquery',
	'underscore',
	'utility',
	'collections/formCollections/people/persons',
	'models/formModels/bankDeposit/bankDepositRow',
	'vent',
	'text!templates/bankDepositsRow.html',
	'text!templates/yesNo.html',
	'bootstrap'	
	], function(Backbone,$,_,utility,Persons,BankDepositsRow,vent,template,yesNoTemplate){

	var BankDepositsRowView = Backbone.View.extend({
		model: new BankDepositsRow(),
		className: 'bankDepositsRow row-fluid',
		events: {
			'click button.yesOption': 'addNewPerson',
			'click button.noOption' : 'hidePopover',	
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
		},
		personsMap:  {},
		initialize: function() {
			this.template = _.template(template);
			this.yesNoTemplate = _.template(yesNoTemplate);
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
			ev.preventDefault();
			var targetClass = ev.currentTarget.className.split(" ")[0];
			switch(targetClass){
				case "person":
					element = this.$('.person');
					var textFieldText = this.$('.person').attr("value").trim();
					var propertyValue = this.$('.person').attr("valueId");
					this.model.set('personName',textFieldText);	
					
					if(propertyValue !== "null"){
						this.model.set('person',parseInt(propertyValue,10) );
					} 		
					this.model.isValid(true);
					break;
				case "amount":
					this.model.set(targetClass,parseInt(this.$('.amount').attr('value'),10));
					this.model.isValid(true);
					vent.trigger('CDF.Views.BankDeposits.BankDepositsRowView:exitColumn:amount');
					break;
			}
		},
		whenValueIsNotSelected : function(targetClass,value){			
			this.$("."+targetClass).tooltip('destroy');
			this.$("."+targetClass).popover('destroy');
			var yesNoTemplate = this.yesNoTemplate({message:'Add new '+targetClass+'?',id:targetClass});
			
			this.$("."+targetClass).popover({html: true, placement:'top',content:yesNoTemplate});
			this.$("."+targetClass).popover('show');
		},
		hidePopover: function(ev){
			ev.preventDefault();
			this.$('.'+ev.currentTarget.parentElement.id).popover('destroy');
		},
		addNewPerson: function(ev){
			ev.preventDefault();
			var propertyName = ev.currentTarget.parentElement.id;
			this.$('.'+propertyName).popover('destroy');
			var value =  this.$('.'+propertyName).val();
			var self = this;
				function newPersonAdded(personModel) {
					self.$('.person').val(personModel.get('firstName')+" "+personModel.get('lastName'));
					self.$('.person').attr('valueId',personModel.get('_id'));
					self.model.set('person',personModel.get('_id'));
					self.model.set('personName',personModel.get('firstName')+" "+personModel.get('lastName')); 
					self.model.isValid(true);
				}
			vent.trigger('CDF.Views.BankDeposits.BankDepositsRowView:addNewPerson',{personNameString:value,callback:newPersonAdded});
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.edit(ev);				
			} else {
				var targetClass = ev.currentTarget.className.split(" ")[0];
				switch(targetClass){
				case "person":
					//this.$('.personName').removeAttr('readonly').focus();
					this.$('.'+targetClass).attr("valueId", "null");	
					this.model.set("person","null");
					//this.$('.personName').val("");				
					break;
				case "amount":
					//this.$('.amount').removeAttr('readonly').focus();
					break;
				}
			}
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.BankDeposits.BankDepositsRowView:delete');
			this.close();
		},	
		onValid: function(view,errors){
			var self = this;
			vent.trigger('CDF.Views.BankDeposits.BankDepositsRowView:onValid');
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
			this.$('.person').typeahead({source:source(new Persons(),[1,2,3,4]),updater:updater,minLength:3,id:"person"+this.model.cid,map:this.personsMap});
			return this;
		}
	
	});

	return BankDepositsRowView;

});