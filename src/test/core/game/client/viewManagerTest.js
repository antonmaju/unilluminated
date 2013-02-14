var should = require('should'),
    ViewManager = require('../../../../core/game/client/viewManager');

describe('ViewManager', function(){

    describe('#setView', function(){

        describe('can change current active view', function(){

            var manager = new ViewManager();
            var view = {
                id: 'myView'
            };
            manager.addView(view);
            manager.setView(view.id);
            manager.currentView.should.equal(view);
        });

    });

});