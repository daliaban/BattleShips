/**
 * Created by dalia on 01/08/16.
 */
'use strict';

describe('controller:battleCtrl', function() {

    var scope, controller;

    beforeEach(function () {
        module('BattleShips');

        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();

            controller = $controller('battleCtrl', {
                $scope: scope
            });
        });

        scope.board = {
            width: 10,
            height: 10
        };

        scope.createBattleBoard();
    });

    it('should be able to hit a ship', inject(function(battleFactory){
        var Ship, position, newship;
        scope.battleBoard[0][3] = 1;
        Ship = [{start:{parent:0, index: 0}, end: {parent: 0, index: 5}, length: 6, hit: 0, status: 'New'}];
        position = {parent: 0, index: 3};
        newship = battleFactory.hitOrMissShip(scope.battleBoard,position, Ship );
        expect(newship[0].hit).toBe(1);

        scope.battleBoard[3][0] = 1;
        Ship = [{start:{parent:0, index: 0}, end: {parent: 5, index: 0}, length: 6, hit: 0, status: 'New'}];
        position = {parent: 3, index: 0};
        newship = battleFactory.hitOrMissShip(scope.battleBoard,position, Ship );
        expect(newship[0].hit).toBe(1);
    }));

});