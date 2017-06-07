import Ember from 'ember';

export default Ember.Component.extend({
	didInsertElement : function(){
		this.updateAttr();
	},

	itemObserver : Ember.observer('item', () => {
		this.updateAttr();
	}),

	updateAttr : function(){
		var self = this,
			tmpArray = [];
		
		Ember.$.get(this.item.branches_url.replace('{/branch}', '')).then(data => {
			self.set('branchesNbr', data.length || 0);
		}, function(data) {
			self.set('branchesNbr', 0);
		});

		Ember.$.get(this.item.languages_url).then(data => {
			for (let property in data) {
				if (data.hasOwnProperty(property)) {
					tmpArray.push(property);
				}
			}

			self.set('languages', tmpArray.toString() || 'none');
		});
	},
});
