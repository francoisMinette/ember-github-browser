import Ember from 'ember';

export default Ember.Component.extend({
	didInsertElement(){
		var self = this;
		
		Ember.$.get(this.item.branches_url.replace('{/branch}', '')).then(function(data){
			console.log('in promise success', data);
			self.set('branchesNbr', data.length);
		}, function(data) {
			self.set('branchesNbr', 0);
		});

		Ember.$.get(this.item.languages_url).then(function(data){
			console.log('in promise success', Ember.$.map(data, function(el) { return el }));
			self.set('languages', Ember.$.map(data, function(el) { return el }));

		}, function(data) {
		});
	},

});
