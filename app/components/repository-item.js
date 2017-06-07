import Ember from 'ember';

export default Ember.Component.extend({
	didInsertElement(){console.log('in didInsertElement item');
		this.updateAttr();
	},

	itemObserver : Ember.observer('item', function(){console.log('in observer item');
		this.updateAttr();
	}),

	updateAttr : function(){
		var self = this,
			tmpArray = [];
		
		Ember.$.get(this.item.branches_url.replace('{/branch}', '')).then(function(data){
			console.log('in promise success', data);
			self.set('branchesNbr', data.length || 0);
		}, function(data) {
			self.set('branchesNbr', 0);
		});

		Ember.$.get(this.item.languages_url).then(function(data){
			for (var property in data) {
				if (data.hasOwnProperty(property)) {
					tmpArray.push(property);
				}
			}

			self.set('languages', tmpArray.toString() || 'none');
			console.log('set languages', self.languages);
		});
	},
});
