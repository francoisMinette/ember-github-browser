import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
	userNotfound : false,
	listRepo : [],
	isLoadingList : false,

	didInsertElement(){
	},

	actions:{
		submitUserName() {
			var self = this;

			this.isLoading = true;
			
			console.log('in submit username');

			if(!Ember.$('#username-input').val().length){
				Ember.$('#username-input').val('francoisminette');
			}

			Ember.$.get(config.apiUrl + "/users/" + Ember.$('#username-input').val()).then(function(response){
				self.set('userNotfound', false);
				self.set('isLoadingList', false);
				console.log('in promise success', response);
				
				if(!response && !response.repos_url){
					return;
				}

				Ember.$.get(response.repos_url).then(function(list){
					console.log('in promise success', list);
					self.set('listRepo', list);
				}, function(list) {
				});


			}, function(response) {
				self.set('userNotfound', true);
				self.set('isLoadingList', false);
			});
		},

		selectRepo(value) {
			var selectedRepo = Ember.$.grep(this.listRepo, function(item){ console.log('supposed to loop', item); return item.id == value; })[0];
			console.log('in selectRepo', value, selectedRepo);

			this.set('activeItem', selectedRepo);
		}
	},
});
