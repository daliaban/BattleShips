/**
 * Created by dalia on 01/08/16.
 */
'use strict';

describe('controller:battleCtrl', function() {

    var scope, controller;

    beforeEach(function(){
        module('BattleShips');

        inject(function($controller, $rootScope){
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

    it('should place a board of defined length', inject(function(){
        expect(scope.battleBoard[0][0]).toBe(0);
        expect(scope.battleBoard[0][9]).toBe(0);
        expect(scope.battleBoard[9][9]).toBe(0);
        expect(scope.battleBoard[9][0]).toBe(0);
        expect(scope.battleBoard[5][5]).toBe(0);

    }));

    it('should be able to select a cell', function(){
        scope.selectPosition(0,5,5);
        expect(scope.battleBoard[5][5]).toBe(1);
    });

    it('should not be able to select an unavailable cell', function(){
        scope.selectPosition(1,5,5);
        expect(scope.error).toBe('Position not available');
    });

    it('should be able to add ship after two available cell selection', inject(function(shipsFactory){
        scope.selectPosition(0,0,0);
        scope.selectPosition(0,0,3);
        expect(scope.status).toBe('finished');

        var ship = shipsFactory.getUserShips();

        expect(ship[0].length).toBe(4);
        expect(ship[0].start.parent).toBe(0);
        expect(ship[0].start.index).toBe(0);
        expect(ship[0].end.parent).toBe(0);
        expect(ship[0].end.index).toBe(3);
        expect(ship[0].hit).toBe(0);
        expect(ship[0].status).toBe('New');
    }));

    it('should be able to provide a name to the ship', inject(function(shipsFactory){
        scope.selectPosition(0,0,0);
        scope.selectPosition(0,0,3);
        scope.shipName = "abcd";
        scope.doneShip();
        expect(shipsFactory.getUserShips()[0].name).toBe('abcd');
    }));

    it('should not be able to provide duplicate ship name', inject(function(){
        scope.selectPosition(0,0,0);
        scope.selectPosition(0,0,3);
        scope.shipName = "abcd";
        scope.doneShip();
        scope.selectPosition(0,9,9);
        scope.selectPosition(0,9,5);
        scope.shipName = "abcd";
        scope.doneShip();
        expect(scope.error).toBe('Name already used. Chose another one');
    }));

    it('should be able to battle with enemy ship', function(){
        scope.selectPosition(0,0,0);
        scope.selectPosition(0,3,0);
        scope.shipName = "abcd";
        scope.doneShip();
        var cell = scope.fire();
        expect(cell).toBeTruthy();
    });

    it('should be able to reset the board', function(){
        scope.resetBoard();
        expect(scope.userShips.length).toBe(0);
        expect(scope.AIShips.length).toBe(0);
        expect(scope.msg).toBe('');
    });

});