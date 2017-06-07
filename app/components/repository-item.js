import Ember from 'ember';

export default Ember.Component.extend({
	loadingBranch : false,
	loadingLanguages : false,
	itemObserver : Ember.observer('item', (self) => {
		self.updateAttr();
	}),

	isLoadingItem : function() {
		return !this || this.get('loadingBranch') || this.get('loadingLanguages');
	}.property('loadingLanguages', 'loadingBranch'),

	didInsertElement : function(){
		this.updateAttr();
	},

	updateAttr : function(){
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
			self.set('branchesNbr', data.length || 0);
			self.set('loadingBranch', false);
		}, function() {
			self.set('branchesNbr', 0);
			self.set('loadingBranch', false);
		});

		Ember.$.get(this.item.languages_url).then(data => {
			for (let property in data) {
				if (data.hasOwnProperty(property)) {
					tmpArray.push(property);
				}
			}

			self.set('languages', tmpArray.toString() || 'none');
			self.set('loadingLanguages', false);
		}, () => {
			self.set('loadingLanguages', false);
		});
	},
});
