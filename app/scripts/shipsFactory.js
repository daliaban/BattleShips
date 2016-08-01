/**
 * Created by dalia on 29/07/16.
 */
'use strict';
angular.module('BattleShips')
    .factory('shipsFactory', function(boardFactory){

        var userShips = [], AIships = [];

        var randomFirstSelection = function(board){
            var position = {};
            var randomPindex = Math.floor(Math.random() * board.length);
            var randomIndex = Math.floor(Math.random() * board[0].length);
            var counter = 10;
            while (board[randomPindex][randomIndex] != 0 && counter > 0){
                randomPindex = Math.floor(Math.random() * board.length);
                randomIndex = Math.floor(Math.random() * board[0].length);
                counter--;
            }
            if (board[randomPindex][randomIndex] != 0) {
                return false;
            }else {
                board[randomPindex][randomIndex] = 3;
                position.parent = randomPindex;
                position.index = randomIndex;
                return position;
            }
        };

        var getRandomInt = function(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        };

        var randomSecondSelection = function(start,board){
            var parent = start.parent;
            var index = start.index;
            var xLen = board.length-1;
            var yLen = board[0].length-1;
            var i, direction='', wayX='', wayY='';

            if ((parent == 0 || parent == yLen) && index == 0 && board[parent][index+1] != 0) wayX = 'NA';
            else if ((parent == 0 || parent == yLen) && index == xLen && board[parent][index-1] != 0) wayX = 'NA';
            else if ((index == 0 || index == xLen) && parent ==0 && board[parent+1][index] != 0) wayY = 'NA';
            else if ((index == 0 || index == xLen) && parent == yLen && board[parent-1][index] != 0) wayY = 'NA';
            else if((index!=0 && board[parent][index-1] != 0) || (index != xLen && board[parent][index+1] != 0 )) wayX = 'NA';
            else if((parent != 0 && board[parent-1][index] != 0 )|| (parent != yLen && board[parent+1][index] != 0 )) wayY = 'NA';

            if (wayX == 'NA' && wayY == 'NA') return false;
            else if( wayY == 'NA') return selectAxis(parent, index, board, xLen, 'X');
            else if(wayX == 'NA') return selectAxis(parent, index, board, yLen, 'Y');
            else {
                direction = "XY".charAt(Math.floor(Math.random() * 2));
                if (direction == 'X') return selectAxis(parent, index, board,xLen, 'X');
                else if (direction == 'Y') return selectAxis(parent, index, board, yLen, 'Y');
            }

        };

        var selectDecrease = function(fixed, fluid, board, axis){
            var max = fluid-1, randomIndex, position={}, block=0, result={};
            for(var min = fluid-1; min >= 0; min--){
                if (axis == 'X'){
                    if (board[fixed][min] != 0) {
                        block =1;
                        break;
                    }
                }else {
                    if (board[min][fluid] != 0) {
                        block = 1;
                        break;
                    }
                }
            }
            if(min < 0) min = 0;
            if(block == 1) min = min+1;
            randomIndex = getRandomInt(min,max);
            for(var j = randomIndex; j <= max; j++) {
                if (axis == 'X') board[fixed][j] = 3;
                else board[j][fixed] = 3;
            }

            if(axis == 'X') {
                position.parent = fixed;
                position.index = randomIndex;
            }else {
                position.parent = randomIndex;
                position.index = fixed;
            }
            result.position = position;
            result.length = max - randomIndex + 2;
            return result;
        };


        var selectIncrease = function(fixed, fluid, board, Len, axis){
            var min = fluid+1, randomIndex, position={}, block= 0, result={};
            for(var max = fluid+1; max <= Len; max++){
                if (axis == 'X'){
                    if (board[fixed][max] != 0){
                        block =1;
                        break;
                    }
                }else {
                    if (board[max][fixed] != 0){
                        block =1;
                        break;
                    }
                }
            }
            if (max > Len) max = Len;
            if(block == 1) max = max -1;
            randomIndex = getRandomInt(min,max);
            for(var j = min; j <= randomIndex; j++) {
                if (axis == 'X') board[fixed][j] = 3;
                else board[j][fixed] = 3;
            }
            if(axis == 'X'){
                position.parent = fixed;
                position.index = randomIndex;
            }else {
                position.parent = randomIndex;
                position.index = fixed;
            }
            result.position = position;
            result.length = randomIndex - min + 2;
            return result;
        };


        var selectAxis = function(parent, index, board, Len, axis){
            var wayDecrease, wayIncrease, way, fixed, fluid;
            if (axis == 'X'){
                if (index == 0) wayDecrease = 'NA';
                else if (index == Len) wayIncrease = 'NA';
                else if (index != 0 && index != Len && board[parent][index+1] != 0) wayIncrease = 'NA';
                else if (index != 0 && index != Len && board[parent][index-1] != 0) wayDecrease = 'NA';
                fixed = parent;
                fluid = index;
            }else {
                if (parent == 0) wayDecrease = 'NA';
                else if (parent == Len) wayIncrease = 'NA';
                else if (parent != 0 && parent != Len && board[parent+1][index] != 0) wayIncrease = 'NA';
                else if (parent != 0 && parent != Len && board[parent-1][index] != 0) wayDecrease = 'NA';
                fixed = index;
                fluid = parent;
            }

            if(wayIncrease == 'NA' && wayDecrease == 'NA') return false;
            else if(wayIncrease == 'NA') return selectDecrease(fixed, fluid, board, axis);
            else if(wayDecrease == 'NA') return selectIncrease(fixed, fluid, board, Len, axis);
            else {
                way = "ID".charAt(Math.floor(Math.random() * 2));
                if (way == 'D') return selectDecrease(fixed, fluid, board, axis);
                else if (way == 'I') return selectIncrease(fixed, fluid, board, Len, axis);
            }

        };

        return {
            reset: function(){
                userShips = [];
                AIships = [];
            },
            addUserShip: function(ship){
                ship.hit = 0;
                ship.status = 'New';
                userShips.push(ship);
            },
            addAIShip: function(ship){
                ship.hit = 0;
                ship.status = 'New';
                ship.name = Math.random().toString(36).substring(2, 5);
                AIships.push(ship);
            },
            getLastUserShip: function(){
                return userShips[userShips.length-1];
            },
            getUserShips: function(){
                return userShips;
            },
            choseRandomShip: function(battleBoard){
                var ship = {}, position;
                position = randomFirstSelection(battleBoard);
                if (position == false){
                    ship.finish = 1;
                    return ship;
                }
                battleBoard = boardFactory.adjustBoard(ship,position);
                if (battleBoard[position.parent][position.index] == 2){
                    ship.finish = 1;
                    return ship;
                }
                ship.start = position;
                position = randomSecondSelection(ship.start, battleBoard);
                if (position == false){
                    battleBoard[ship.start.parent][ship.start.index] = 2;
                    ship.finish = 1;
                    return ship;
                }
                ship.length = position.length;
                ship.end = position.position;
                ship.finish = 0;

                return ship;
            },
            getAIShips: function(){
                return AIships;
            },
            getactiveAIShips: function(){
                return AIships.filter(function(ship){
                    return ship.status != 'Destroyed';
                });
            },
            getactiveUserShips: function(){
                return userShips.filter(function(ship){
                    return ship.status != 'Destroyed';
                });
            },
            checkShipName: function(name){
                return userShips.filter(function(ship){
                    return ship.name == name;
                })
            }
        }
});