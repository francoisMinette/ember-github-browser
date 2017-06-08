import Ember from 'ember';
import config from '../config/environment';

export default Ember.Component.extend({
	userNotfound : false,
	listRepo : [],
	filteredList : [],
	isLoadingList : false,
	languagesList : ['JavaScript', 'Ruby', 'D', 'Julia', 'Rust', 'Java', 'Scala', 'Elixir', 'Objective-C', 'C', 'LiveScript', 'Haskell', 'Scheme', 'CoffeeScript', 'Nim', 'Racket', 'Erlang', 'Go', 'Dylan', 'Frege', 'Dart', 'Chapel', 'C#', 'Red', 'C++', 'OCaml', 'Haxe', 'Gosu', 'Crystal', 'TypeScript', 'Factor', 'Perl6', 'Python', 'F#'],

	//actions for the different input (organization name & username inputs, language & repo & privacy selects)
	actions:{
		submitOrganizationName(){
			var username = Ember.$('#organization-name-input').val();
			const defaultName = 'github';

			Ember.$('#username-input').val('');

			//this is to always look for user if no input value has been input
			if(!username.length){
				Ember.$('#organization-name-input').val(defaultName);
				username = defaultName;
			}

			this.getRepoList(username);
		},

		submitUserName(){
			var username = Ember.$('#username-input').val();
			const defaultName = 'defunkt';

			Ember.$('#organization-name-input').val('');

			//this is to always look for user if no input value has been input
			if(!username.length){
				Ember.$('#username-input').val(defaultName);
				username = defaultName;
			}

			this.getRepoList(username);
		},

		selectLanguage(){
			if(Ember.$('#organization-name-input').val().length){
				this.triggerAction({
					action:'submitOrganizationName',
					target: this
				});
			}else if(Ember.$('#username-input').val().length){
				this.triggerAction({
					action:'submitUserName',
					target: this
				});
			}
		},

		selectRepo(value){
			this.set('activeItem', Ember.$.grep(this.listRepo, item => {return item.id == value;})[0]);
		},

		changePrivacy(value){
			this.updateFilteredList(value);
		},
	},

	//Function used to get and set the list of repositories
	getRepoList(username){
		var self = this,
			apiUrl = config.apiUrl + "/search/repositories",
			selectedLanguages = Ember.$('#select-language').val();

		this.set('isLoading', true);

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

	//Function that will update the filtered list
	updateFilteredList(value){
		var newList = Ember.$.grep(this.listRepo, 
			item => {
				switch(parseInt(value, 10)){
					case 0:
						return true;
					case 1:
						return item.private == true;
					case 2:
						return item.private == false;
				}
			});

		this.set('filteredList', newList);
		this.removeCurrentItem();
	},

	//Function that will remove the current repository item if it does not belong to the filtered repo list
	removeCurrentItem(){
		var self = this;

		if(this.activeItem && !Ember.$.grep(this.filteredList, item => {return item.id == self.activeItem.id}).length){
			this.set('activeItem', null);
		}
	}
});
