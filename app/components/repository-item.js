import Ember from 'ember';

export default Ember.Component.extend({
	loadingBranch : false,
	loadingLanguages : false,

	//This is an observer attribute, that will listen on item and be triggered when it is changed
	itemObserver : Ember.observer('item', (self) => {
		self.updateAttr();
	}),

	//It is listening on the loadingLanguages and loadingBranch and return a boolean to indicate ifany of the attribute is still being loaded
	isLoadingItem : function(){
		return !this || this.get('loadingBranch') || this.get('loadingLanguages');
	}.property('loadingLanguages', 'loadingBranch'),

	//Is right after all the element are inserted in the DOM
	didInsertElement(){
		this.updateAttr();
	},

	//Function that will be called to get and set the branchNbr and languages attributes.
	updateAttr(){
		var tmpArray = [],
			self = this;

		if(this.get('loadingBranch') || this.get('loadingLanguages')){
			return;
		}

		this.setProperties({
			'loadingBranch': true,
			'loadingLanguages': true,
		});

		Ember.$.get(this.item.branches_url.replace('{/branch}', '')).then(data => {
			self.setProperties({
				'branchesNbr' : data.length,
				'loadingBranch' : false
			});
		}, function() {
			self.setProperties({
				'branchesNbr' : 0,
				'loadingBranch' : false
			});
		});

		Ember.$.get(this.item.languages_url).then(data => {
			for (let property in data) {
				if (data.hasOwnProperty(property)) {
					tmpArray.push(property);
				}
			}

			self.setProperties({
				'languages' : tmpArray.toString() || 'none',
				'loadingLanguages' : false
			});
		}, () => {
			self.set('loadingLanguages', false);
		});
	},
});
