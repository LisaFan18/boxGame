var ROW = 1;
var COL = 10; // chess board row and column
var GRID_SIZE=50; // cell's width and height
var IS_BLUE = true; // blue box
var IS_GAME_OVER = false; 
var IS_CAN_STEP = false; // not allowed to play when competitor is playing 
var COMPETITOR_NAME = '';    

var mycanvas=document.getElementById('boxboard');
var context = mycanvas.getContext('2d');
var box=document.getElementById("box");
var blue=document.getElementById("blueBall");
var red=document.getElementById("redBall");

var socket = io('http://localhost:8000');
var arrBox = new Array();

$(document).ready(function () {
    clientSocket(socket);
    bindChangeNameClick(socket);
    bindApplyGameClick(socket);
    InitMap();   
    boxClick();
});

function InitMap()
{	
	for(var i=0;i<ROW;i++)
	{
		for(var j=0;j<COL;j++)
		{
			context.drawImage(box,GRID_SIZE*j,GRID_SIZE*i,GRID_SIZE,GRID_SIZE);
			arrBox[j] = 0; 
		}
	}	
}

function boxClick(){
	 $('#boxboard').click(function (e) {
	     var x = Math.floor(e.offsetX / GRID_SIZE);
	     var y = Math.floor(e.offsetY / GRID_SIZE);
	     //alert("x=,y=" + e.offsetX + "," + e.offsetY + "r=, c=," + x + "," + y);
	     drawBox(x, y);
	 })
}

function drawBox(i, j){
	if (IS_CAN_STEP && !IS_GAME_OVER && arrBox[i] === 0) {
		
		drawNewBox(i, j, IS_BLUE);
		
		doCheck(i, j, IS_BLUE);
		
		checkIsExistEmpty();
		 
		stepPiece(i, j, IS_GAME_OVER);
	}
}

function drawNewBox(i, j, isBlue) {
	if(isBlue){
		context.clearRect(GRID_SIZE*i, GRID_SIZE*j, GRID_SIZE, GRID_SIZE);
		context.drawImage(blue,GRID_SIZE*i,GRID_SIZE*j,GRID_SIZE,GRID_SIZE);
		arrBox[i] = 1;
	} else {
		context.clearRect(GRID_SIZE*i, GRID_SIZE*j, GRID_SIZE, GRID_SIZE);
		context.drawImage(red,GRID_SIZE*i,GRID_SIZE*j,GRID_SIZE,GRID_SIZE);	
		arrBox[i] = 2;
	}	
}

function doCheck(i, j, isBlue){
	 var sum = 0;
	 for (var i = 0; i < ROW; i++) {
		for (var j = 0; j < COL; j++) {
			if (arrBox[j] != 0) {
				sum++;
			}
		}
	}
	
	isOver(i, j, sum);
}

function checkIsExistEmpty() {
    var isExistEmpty = false;
    for (var i = 0; i < ROW; i++) {
        for (var j = 0; j < COL; j++) {
            if (arrBox[j] === 0) {
                isExistEmpty = true;
                break;
            }
        }
    }
//    if (!isExistEmpty) {
//        setTimeout(function () {
//            alert('TIE!')
//        }, 0);
//    }
}

function isOver(x, y, sum) {
    if (sum === ROW*COL) {
        IS_GAME_OVER = true;
        setTimeout(function () {
            alert('Game Over!' + getWinner())
        }, 0);
    }
}

function getWinner(){
	var redPoints = 0, bluePoints = 0;
	if(IS_GAME_OVER){
		for (var i = 0; i < ROW; i++) {
			for (var j = 0; j < COL - 1; j++) {
				if (arrBox[j] == 1 &&  arrBox[j] == arrBox[j+1]) {
					bluePoints++;
				}else if  (arrBox[j] == 2 &&  arrBox[j] == arrBox[j+1]){
					redPoints++;
				}				
			}
		}
		
		alert("bluePoints=" + bluePoints + ",redPoints=" + redPoints);
		if(bluePoints > redPoints ){
			return "blue win"
		} else if (bluePoints < redPoints ){
			return "red win"
		} else {
			return "Tie"
		}
		
	}
}

function clientSocket(socket) {
    socket.on('userName', function (name) {
        $('#my_name').val(name).attr('data-oldvalue', name);
    });

    socket.on('allUsers', function (userList) {
        console.log(userList);
        handlebarsUserList(userList, socket.id, socket);
    });

    socket.on('beginGame', function (gameInfo) {
        IS_CAN_STEP = gameInfo.currentStep;
        IS_BLUE = gameInfo.isBlue;
        var status = '';
        if(IS_CAN_STEP) {
            status = 'My turn...';
        } else {
            status = 'Waiting for ' + COMPETITOR_NAME + ' playing...';
        }
        setGameStatus(status);
    });

    socket.on('competitorStep', function (info) {
        var ownInfo = info.ownInfo,
            stepInfo = info.stepInfo;

        IS_CAN_STEP = ownInfo.currentStep;
        drawNewBox(stepInfo.x, stepInfo.y, !ownInfo.isBlue);
        IS_GAME_OVER = stepInfo.isGameOver;
        var status = '';
        if(IS_GAME_OVER) {
            setTimeout(function(){
                alert('Game Over!');
            }, 0);

            satus = 'Game Over';
        } else {
            if(IS_CAN_STEP) {
                status = 'My turn...';
            } else {
                status = 'Waiting for ' + COMPETITOR_NAME + ' playing...';
            }
        }
        setGameStatus(status);
        
    });
}

function bindChangeNameClick(socket) {
    $('#change_name').click(function (e) {
        var $name = $('#my_name'),
            value = $name.val();
        if (value.trim() === '') {
            alert('Player Name should not be empty！');
            return;
        }
        if (value !== $name.attr('data-oldvalue')) {
            socket.emit('setName', value);
        }
    });
}


function bindApplyGameClick(socket) {
    $('.user-status').click(function (e) {
        var $this = $(this);
        socket.emit('applyGame', $this.data('id'));
        COMPETITOR_NAME = $this.data('name');
    });
}

function handlebarsUserList(userList, ownId, socket) {
    var source = $("#user_template").html();
    var template = Handlebars.compile(source);
    var result = [];
    $.each(userList, function (index, value) {
        value.statusClass = '';
        value.statusText = 'Apply for a match';
        if (value.competitor) {
            value.statusClass = 'gaming-status';
            value.statusText = 'matching';
        }
        if (value.competitor === ownId) {
            value.statusClass = 'gaming-current';
            value.statusText = 'Current Competitor';
            COMPETITOR_NAME = value.name;
        }
        if (value.id !== ownId) {
            result.push(value);
        }
    });
    var html = template({
        userList: result
    });
    $('#user_list').html(html);
    bindApplyGameClick(socket);
}

// socket is updated by playing
function stepPiece(x, y, isGameOver) {
    IS_CAN_STEP = false;
    var status = 'Waiting for ' + COMPETITOR_NAME + '  playing...';
    if(isGameOver) {
        status = 'Game Over.'
    }
    setGameStatus(status);
    socket.emit('step', {
        x: x,
        y: y,
        isGameOver: isGameOver
    });
}

function setGameStatus(status) {
    $('#current_status').text(status);
}