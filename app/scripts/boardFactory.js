/**
 * Created by dalia on 29/07/16.
 */
'use strict';
angular.module('BattleShips')
    .factory('boardFactory', function(){

        var tiles, xLength, yLength;

        var getWhiteBoard = function(){
            for (var x=0; x< xLength; x++){
                for (var y=0; y<yLength; y++ ){
                    if (!tiles[x]) tiles[x] = [];
                    tiles[x][y] = 0;
                }
            }
            return tiles;
        };

        var reset = function(){
            tiles = [];
        };

        var disableSelection = function(){
            for (var x=0; x< xLength; x++){
                for (var y=0; y<yLength; y++ ){
                    if (tiles[x][y] == 0){
                        tiles[x][y] = 2;
                    }
                }
            }
            return tiles;
        };

        var enableSelection = function(){
            for (var x=0; x< xLength; x++){
                for (var y=0; y<yLength; y++ ){
                    if (tiles[x][y] == 2){
                        tiles[x][y] = 0;
                    }
                }
            }
            return tiles;
        };

        var showAvailablePositions = function(selectedPosition){
            var parent = selectedPosition.parent;
            var index = selectedPosition.index;
            var i, available = 0;

            if(parent != 0){
                for(i = parent-1; i >=0; i--){
                    if (tiles[i][index] == 1 || tiles[i][index] == 3) break;
                    tiles[i][index] = 0;
                    available = 1;
                }
            }

            if(parent != xLength){
                for(i = parent+1; i < xLength; i++){
                    if (tiles[i][index] == 1 || tiles[i][index] == 3) break;
                    tiles[i][index] = 0;
                    available = 1;
                }
            }

            if(index != 0){
                for(i = index-1; i >=0; i--){
                    if (tiles[parent][i] == 1 || tiles[parent][i] == 3) break;
                    tiles[parent][i] = 0;
                    available = 1;
                }
            }

            if(index != yLength){
                for(i = index+1; i < yLength; i++){
                    if (tiles[parent][i] == 1 || tiles[parent][i] == 3) break;
                    tiles[parent][i] = 0;
                    available = 1;
                }
            }

            if (available == 0) {
                tiles[parent][index] = 2;
            }
            return tiles;
        };

        var selectShip = function(ship, selectedPosition){
            var start, end;
            if (selectedPosition.parent != ship.start.parent){
                if (selectedPosition.parent < ship.start.parent){
                    start = selectedPosition.parent;
                    end = ship.start.parent;
                }else {
                    start = ship.start.parent;
                    end = selectedPosition.parent;
                }
                for (var i = start; i <= end; i++) {
                    tiles[i][selectedPosition.index] = 1;
                }
            }else {
                if (selectedPosition.index < ship.start.index){
                    start = selectedPosition.index;
                    end  = ship.start.index;
                }else {
                    start = ship.start.index;
                    end  = selectedPosition.index;
                }
                for (var j = start; j <= end; j++){
                    tiles[selectedPosition.parent][j] = 1;
                }
            }
            ship.length = Math.abs(start - end) + 1;

            return tiles;
        };


        return {
            gameBoard: function(board){
                yLength = board.width;
                xLength = board.height;
                reset();
                return getWhiteBoard();
            },
            adjustBoard: function(ship, selectedPosition){
                if(ship.start){
                    selectShip(ship, selectedPosition);
                    return disableSelection();
                }else {
                    disableSelection();
                    return showAvailablePositions(selectedPosition);
                }

            },
            resetBoard: function(){
                reset();
                return getWhiteBoard();
            },
            normalizeBoard: function(){
                return enableSelection();
            },
            placeUserSelection: function(selectedPosition){
                if (selectedPosition){
                    tiles[selectedPosition.parent][selectedPosition.index] = 1;
                }
                return tiles;
            },
            lockBoard: function(){
                return disableSelection();
            },
            damageBoard: function(position, enemy){
                if (position){
                    if (enemy == "AI") tiles[position.parent][position.index] = 4;
                    if (enemy == "User") tiles[position.parent][position.index] = 5;
                }
                return tiles;
            }
        }

    });