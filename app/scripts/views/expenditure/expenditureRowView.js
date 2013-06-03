define([
	'backbone',
	'jquery',
	'underscore',
	'collections/people/persons',
	'models/expenditure/expenditureRow',
	'vent',
	'text!templates/expenditureRow.html',
	'text!templates/yesNo.html',
	'bootstrap',
	
	], function(Backbone,$,_,Persons,ExpenditureRow,vent,template,yesNoTemplate){

	var ExpenditureRowView = Backbone.View.extend({
		//model: new ExpenditureRow(),
		className: 'expenditureRow',
		events: {
			'click button.yesOption': 'addNewPerson',
			'click button.noOption' : 'hidePopover',
			'click .column': 'edit',
			'click .delete': 'delete',
			'blur .column': 'exitColumn',
			'keypress .column': 'onEnterUpdate',
		},
		receivedByMap:  {},
        sanctionedByMap:  {},
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
			var element = null;
			var targetClass = ev.currentTarget.className.split(" ")[0];
			switch(targetClass){
				case "item":
					this.model.set('item',this.$('.item').attr("value"));
					this.model.isValid(true);
					break;
				case "qty":
					this.model.set('qty',this.$('.qty').attr("value"));
					this.model.isValid(true);
					break;
				case "amount":
					this.model.set('amount',this.$('.amount').attr("value"));
					vent.trigger('CDF.Views.Expenditure.ExpenditureRowView:exitColumn:amount');
					this.model.isValid(true);
					break;
				case "receivedBy":
					setModelProperties.call(this,'receivedBy','receivedByName');
					break;
				case "sanctionedBy":
					setModelProperties.call(this,'sanctionedBy','sanctionedByName');
					break;
				
			}

			function setModelProperties(property,propertyName){				
				this.model.set(propertyName,this.$('.'+property).attr("value"));
				
				var propertyValue = this.$('.'+property).attr("valueId");
				if(propertyValue !== "null") {
					this.model.set(property, parseInt(propertyValue,10));
				} 
				this.model.isValid(true);
			};

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
		addNewItem : function(ev){
			ev.preventDefault();
			var targetClass = ev.currentTarget.parentElement.id;
			this.$('.'+targetClass).popover('destroy');
			var value =  this.$('.'+targetClass).val();
			this.addNewPerson(value,targetClass);
		},
		addNewPerson: function(ev){
			ev.preventDefault();
			var targetClass = ev.currentTarget.parentElement.id;
			this.$('.'+targetClass).popover('destroy');
			var value =  this.$('.'+targetClass).val();
			var self = this;

				function newPersonAdded(personModel) {
					self.$('.'+targetClass).val(personModel.get('firstName')+" "+personModel.get('lastName'));
					self.$('.'+targetClass).attr('valueId',personModel.get('_id'));
					self.model.set(targetClass,personModel.get('_id'));
					self.model.set(targetClass+'Name',personModel.get('firstName')+" "+personModel.get('lastName')); 
					self.model.isValid(true);
				};
	
			vent.trigger('CDF.Views.Expenditure.ExpenditureRowView:addNewPerson',{personNameString:value,callback:newPersonAdded});
		},
		onEnterUpdate: function(ev) {
			var self = this;
			if (ev.keyCode === 13) {
				this.edit(ev);
			}else{ 

				switch(ev.currentTarget.className.split(" ")[0]){
					case "receivedBy":
						//this.$('.removeAttr').receivedBy('readonly').focus();
						this.$('.receivedBy').attr("valueId", "null");
						this.model.set("receivedBy","null");
						//this.$('.receivedBy').val("");
						break;
					case "sanctionedBy":
						//this.$('.sanctionedByName').removeAttr('readonly').focus();
						this.$('.sanctionedBy').attr("valueId", "null");	
						this.model.set("sanctionedBy","null");
						//this.$('.sanctionedBy').val("");				
						break;
					case "amount":
						//this.$('.amount').removeAttr('readonly').focus();
						break;
					case "qty":
						//this.$('.qty').removeAttr('readonly', true).focus();
						break;
					}
				}				
		},
		delete: function(ev) {
			if(ev.preventDefault) ev.preventDefault();			
			vent.trigger('CDF.Views.Expenditure.ExpenditureRowView:delete');			
			this.close();
		},
		onValid: function(view,errors){
			var self = this;
			vent.trigger('CDF.Views.Expenditure.ExpenditureRowView:onValid');

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
						 var name = element.firstName+" "+element.lastName+' # '+element._id;
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
			this.$('.receivedBy').typeahead({source:source(new Persons(),[1,2,3,4]),updater:updater,minLength:3,id:"receivedBy"+this.model.cid,map:this.receivedByMap});
			this.$('.sanctionedBy').typeahead({source:source(new Persons(),[1,2,3,4]),updater:updater,minLength:3,id:"sanctionedBy"+this.model.cid,map:this.sanctionedByMap});
			
			return this;
		}
	
	});

	return ExpenditureRowView;

});