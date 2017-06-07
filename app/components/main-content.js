import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
	userNotfound : false,
	listRepo : [],
	filteredList : [],
	isLoadingList : false,
	languagesList : ['JavaScript', 'Ruby', 'D', 'Julia', 'Rust', 'Java', 'Scala', 'Elixir', 'Objective-C', 'C', 'LiveScript', 'Haskell', 'Scheme', 'CoffeeScript', 'Nim', 'Racket', 'Erlang', 'Go', 'Dylan', 'Frege', 'Dart', 'Chapel', 'C#', 'Red', 'C++', 'OCaml', 'Haxe', 'Gosu', 'Crystal', 'TypeScript', 'Factor', 'Perl6', 'Python', 'F#'],

	actions:{
		submitUserName() {
			var self = this,
				apiUrl = config.apiUrl + "/search/repositories",
				selectedLanguages = Ember.$('#select-language').val(),
				username = Ember.$('#username-input').val();

			const defaultName = 'defunkt';

			this.set('isLoading', true);
			
			//this is to always look for user if no username has been input
			if(!username.length){
				Ember.$('#username-input').val(defaultName);
				username = defaultName;
			}

			apiUrl += '?q=user:' + username;

			for(let i = 0; i < selectedLanguages.length; i++){
				apiUrl += '+language:' + selectedLanguages[i].toLowerCase();
			}

			Ember.$.get(apiUrl).then(response => {
				self.set('isLoadingList', false);
				
				if(!response){
					return;
				}
				
				self.set('listRepo', response.items);
				self.updateFilteredList(Ember.$('#select-privacy').val());
			}, () => {
				self.setProperties({
					'isLoadingList' : false,
					'activeItem' : null,
					'listRepo' : [],
					'filteredList' : []
				});
			});
		},

		selectRepo(value) {
			this.set('activeItem', Ember.$.grep(this.listRepo, item => {return item.id == value;})[0]);
		},

		changePrivacy(value) {
			this.updateFilteredList(value);
		},
	},

	updateFilteredList : function(value) {
		var newList = Ember.$.grep(this.listRepo, 
			item => {
				switch(parseInt(value, 10)){
					case 0:
						return true;
						break;
					case 1:
						return item.private == true;
						break;
					case 2:
						return item.private == false;
				}
			});

		this.set('filteredList', newList);
		this.removeCurrentItem();
	},

	removeCurrentItem : function(){
		var self = this;

		if(this.activeItem && !Ember.$.grep(this.filteredList, item => {return item.id == self.activeItem.id}).length){
			this.set('activeItem', null);
		}
	}
});
