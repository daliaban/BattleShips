/**
 * Created by dalia on 29/07/16.
 */
'use strict';
angular.module('BattleShips')
    .factory('battleFactory', function(){

        var fireRandom = function(board, enemy){
            var position = {};
            var randomPindex = Math.floor(Math.random() * board.length);
            var randomIndex = Math.floor(Math.random() * board[0].length);
            var counter = 10;
            while ( ((enemy== 'AI' && board[randomPindex][randomIndex] == 1) || (enemy== 'User' && board[randomPindex][randomIndex] == 3)  || board[randomPindex][randomIndex] == 4 || board[randomPindex][randomIndex] == 5) && counter > 0){
                randomPindex = Math.floor(Math.random() * board.length);
                randomIndex = Math.floor(Math.random() * board[0].length);
                counter--;
            }
            if (((enemy== 'AI' && board[randomPindex][randomIndex] != 1) || (enemy== 'User' && board[randomPindex][randomIndex] != 3)) && board[randomPindex][randomIndex] != 4 && board[randomPindex][randomIndex] != 5) {
                position.parent = randomPindex;
                position.index = randomIndex;
                return position;
            }else {
                return false;
            }
        };

        var hitOrMissShip = function(board, position, Ships){
            if (position && (board[position.parent][position.index] == 3 || board[position.parent][position.index] == 1)){
                return Ships.filter(function(ship){
                    var condition;
                    if(ship.start.parent == position.parent && ship.end.parent == position.parent){
                        condition = (position.index >= ship.start.index && position.index <= ship.end.index) || (position.index <= ship.start.index && position.index >= ship.end.index);
                        if (condition){
                            ship.hit = ship.hit+1;
                            return condition;
                        }
                    }else if (ship.start.index == position.index && ship.end.index == position.index){
                        condition = (position.parent >= ship.start.parent && position.parent <= ship.end.parent) || (position.parent <= ship.start.parent && position.parent >= ship.end.parent);
                        if (condition){
                            ship.hit = ship.hit+1;
                            return condition;
                        }
                    }
                });
            }
            return false;
        };


        return {
            fireRandom: fireRandom,
            hitOrMissShip: hitOrMissShip
        }

});