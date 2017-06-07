import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
	userNotfound : false,
	listRepo : [],
	filteredList : [],
	isLoadingList : false,
	languagesList : ['JavaScript', 'Ruby', 'D', 'Julia', 'Rust', 'Java', 'Scala', 'Elixir', 'Objective-C', 'C', 'LiveScript', 'Haskell', 'Scheme', 'CoffeeScript', 'Nim', 'Racket', 'Erlang', 'Go', 'Dylan', 'Frege', 'Dart', 'Chapel', 'C#', 'Red', 'C++', 'OCaml', 'Haxe', 'Gosu', 'Crystal', 'TypeScript', 'Factor', 'Perl6', 'Python', 'F#'],

	actions:{
		submitUserName() {//?q=user:francoisminette+language:javascript
			var self = this,
				apiUrl = config.apiUrl + "/search/repositories",
				selectedLanguages = Ember.$('#select-language').val(),
				username = Ember.$('#username-input').val();

			this.set('isLoading', true);
			
			//this is to always look for user if no username has been input
			if(!username.length){
				Ember.$('#username-input').val('francoisminette');
				username = 'francoisminette';
			}

			apiUrl += '?q=user:' + username;

			for(var i = 0; i < selectedLanguages.length; i++){
				apiUrl += '+language:' + selectedLanguages[i].toLowerCase();
			}

			Ember.$.get(apiUrl).then(function(response){
				self.setProperties({
					'userNotfound' : false,
					'isLoadingList' : false
				});
				console.log('in promise success', response);
				
				if(!response){
					return;
				}
				
				self.setProperties({
					'listRepo' : response.items,
					'filteredList' : response.items
				});
			}, function(response) {
				self.setProperties({
					'userNotfound' : true,
					'isLoadingList' : false
				});
				
			});
		},

		selectRepo(value) {
			this.set('activeItem', null);
			var selectedRepo = Ember.$.grep(this.listRepo, function(item){return item.id == value;})[0];
			console.log('in selectRepo', value, selectedRepo);
			this.set('activeItem', selectedRepo);
		},

		changePrivacy(value) {
			var self = this,
				newList = Ember.$.grep(this.listRepo, 
				function(item){
					switch(parseInt(value, 10)){
						case 0:
							return true;
						break;
						case 1:
							return item.private == true;
						break;
						case 2:
							return item.private == false;
						break;
					}
				});

			console.log('in changePrivacy', value, newList);
			this.set('filteredList', newList);

			if(this.activeItem && !Ember.$.grep(newList, function(item){return item.id == self.activeItem.id}).length){
				this.set('activeItem', null);
			}
		}
	},
});
