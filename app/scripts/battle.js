/**
 * Created by dalia on 29/07/16.
 */
'use strict';
angular.module('BattleShips')
    .controller('battleCtrl', function($scope, boardFactory,shipsFactory, battleFactory){
        $scope.board = {
            width: 10,
            height: 10
        };

        $scope.userShips = [];
        $scope.AIShips = [];
        var ship = {};
        $scope.msg = '';

        var reset = function(){
            ship = {};
            $scope.status = "start";
            $scope.error = '';
            $scope.shipName = '';
        };

        $scope.createBattleBoard = function(){
            reset();
            $scope.battleBoard = boardFactory.gameBoard($scope.board);
        };

        $scope.selectPosition = function(col, $parentIndex, $index){
            var selectedPosition = {
                parent: $parentIndex,
                index: $index
            };

            if (col != 0){
                $scope.error = 'Position not available';
            }else{
                $scope.error = '';
                $scope.battleBoard = boardFactory.placeUserSelection(selectedPosition);
                $scope.battleBoard = boardFactory.adjustBoard(ship, selectedPosition);
            }

            if ($scope.error == ''){
                if ($scope.status == "start"){
                    $scope.status = "building";
                    ship.start = selectedPosition;
                }else {
                    $scope.status = "finished";
                    ship.end = selectedPosition;
                    shipsFactory.addUserShip(ship);
                }
            }

        };

        $scope.resetBoard = function(){
            reset();
            $scope.userShips = [];
            $scope.AIShips = [];
            shipsFactory.reset();
            $scope.battleBoard = boardFactory.resetBoard();
            $scope.msg = '';
        };

        var getAIShip = function(){
            var ship = shipsFactory.choseRandomShip($scope.battleBoard);
            if (ship.finish != 1){
                shipsFactory.addAIShip(ship);

                $scope.battleBoard = boardFactory.normalizeBoard();
                reset();
                $scope.AIShips = shipsFactory.getAIShips();
            }
        };

        $scope.doneShip = function(){
            var ship = shipsFactory.getLastUserShip();
            var duplicate = shipsFactory.checkShipName($scope.shipName);
            if (duplicate.length){
                $scope.error = 'Name already used. Chose another one';
            }else {
                $scope.error = '';
            }
            if ($scope.error == ''){
                ship.name = $scope.shipName;
                $scope.battleBoard = boardFactory.normalizeBoard();
                reset();
                $scope.userShips = shipsFactory.getUserShips();
                getAIShip();
            }
        };

        var battleWith = function(enemy, enemyShips){
            var cell = battleFactory.fireRandom($scope.battleBoard, enemy);
            var hitShips = battleFactory.hitOrMissShip($scope.battleBoard, cell, enemyShips);
            $scope.battleBoard = boardFactory.damageBoard(cell, enemy);
            if (hitShips.length) {
                if (hitShips[0].hit == 1) hitShips[0].status = 'Hit';
                if(hitShips[0].hit == hitShips[0].length) hitShips[0].status = 'Destroyed';
            }
            return cell;
        };

        $scope.fire = function(){
            $scope.battleBoard = boardFactory.lockBoard();
            var cell = battleWith("AI", shipsFactory.getAIShips());
            if (cell) battleWith("User", shipsFactory.getUserShips());
            if (!shipsFactory.getactiveAIShips().length) $scope.msg = 'Battle Finish, YOU WIN :-) !!!';
            if (!shipsFactory.getactiveUserShips().length) $scope.msg = 'Battle Finish, ENEMY WINS :-( !';
            return cell;
        }
    });