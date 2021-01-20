function DISABLE_DEFAULT_KEYS() {
    document.onkeydown = function(e) {
        if(e.keyCode == 13 || e.keyCode == 32)
            e.preventDefault();
    }
}
/*
  #####     #    #     # #######     #####  ######  ### ######  
 #     #   # #   ##   ## #          #     # #     #  #  #     # 
 #        #   #  # # # # #          #       #     #  #  #     # 
 #  #### #     # #  #  # #####      #  #### ######   #  #     # 
 #     # ####### #     # #          #     # #   #    #  #     # 
 #     # #     # #     # #          #     # #    #   #  #     # 
  #####  #     # #     # #######     #####  #     # ### ######  
                                                                
*/

function CREATE_GRID(obj) {
    var gridArray = obj.gridArray;
    var nrow = GRID_NROW;
    var ncol = GRID_NCOL;
    var shapeId; 
    if(obj.isTryMove || obj.isTrySay) {
        for (var row = 0; row < nrow; row++) {
            for (var col = 0; col < ncol; col++) {
                shapeId = "shape" + row + "v" + col;
                
                if (gridArray[row][col]!= null){
                    $("#tryGridContainer").append("<div class='gridItem' id='" + shapeId + "'></div>")
                    $("#" + shapeId).append($("<img>", {class: "shape", src: gridArray[row][col]}));
                }
                else{
                    $("#tryGridContainer").append("<div class='gridEmpty' id='" + shapeId + "'></div>");
                }
            };
        };
    } else if (obj.isPracTrial) {
        for (var row = 0; row < nrow; row++) {
            for (var col = 0; col < ncol; col++) {
                shapeId = "shape" + row + "v" + col;
                
                if (gridArray[row][col]!= null){
                    $("#practiceGridContainer").append("<div class='gridItem' id='" + shapeId + "'></div>")
                    $("#" + shapeId).append($("<img>", {class: "shape", src: gridArray[row][col]}));
                }
                else{
                    $("#practiceGridContainer").append("<div class='gridEmpty' id='" + shapeId + "'></div>");
                }
            };
        };
    } else if (obj.isExptTrial) {
        for (var row = 0; row < nrow; row++) {
            for (var col = 0; col < ncol; col++) {
                shapeId = "shape" + row + "v" + col;
                
                if (gridArray[row][col]!= null){
                    $("#gridContainer").append("<div class='gridItem' id='" + shapeId + "'></div>")
                    $("#" + shapeId).append($("<img>", {class: "shape", src: gridArray[row][col]}));
                }
                else{
                    $("#gridContainer").append("<div class='gridEmpty' id='" + shapeId + "'></div>");
                }
            };
        };
    }
    
}

function REMOVE_PREVIOUS(actor) {
    if($("#shape"+ actor[0] + "v" + actor[1]).hasClass("gridEmpty"))
        $("#shape"+ actor[0] + "v" + actor[1] + " img").remove();
    else 
        $(".top").remove();
}

function NEW_POSITION(actor) {
    if (actor == signaler)
        var actorImg = "signaler.png";
    else 
        var actorImg = "receiver.png";
    if($("#shape"+ actor[0] + "v" + actor[1]).hasClass("gridItem"))
        $("#shape" + actor[0] + "v" + actor[1]).append($("<img>", {class: "top", src: SHAPE_DIR + actorImg}));
    else
        $("#shape" + actor[0] + "v" + actor[1]).append($("<img>", {class: "shape", src: SHAPE_DIR + actorImg}));
}

function FIRST_MOVE() {
    if(!signalerMoved){
        signalerMoved = true;
        $("#shape"+ signaler[0] + "v" + signaler[1] + " img").remove();
        $("#shape"+ signaler[0] + "v" + signaler[1]).attr("class", "gridEmpty");
    }
}

function MOVE_LEFT() {
    if(signaler[1]-1 >= 0){
        FIRST_MOVE();
        REMOVE_PREVIOUS(signaler);
        signaler = [signaler[0], (signaler[1]-1)];
        NEW_POSITION(signaler);
    }
}

function MOVE_UP() {
    if(signaler[0]-1  >= 0){
        FIRST_MOVE();
        REMOVE_PREVIOUS(signaler);
        signaler = [(signaler[0]-1), signaler[1]];
        NEW_POSITION(signaler);
    }
}

function MOVE_RIGHT() {
    if(signaler[1]+1 < GRID_NCOL){
        FIRST_MOVE();
        REMOVE_PREVIOUS(signaler);
        signaler = [signaler[0], (signaler[1]+1)];
        NEW_POSITION(signaler);
    }
}

function MOVE_DOWN() {
    if((signaler[0]+1) < GRID_NROW){
        FIRST_MOVE();
        REMOVE_PREVIOUS(signaler);
        signaler = [(signaler[0]+1), signaler[1]];
        NEW_POSITION(signaler);
    }
}

function RECEIVER_FIRST_MOVE() {
    if(!receiverMoved ){
        receiverMoved = true;
        $("#shape"+ receiver[0] + "v" + receiver[1] + " img").remove();
        $("#shape"+ receiver[0] + "v" + receiver[1]).attr("class", "gridEmpty");
    }
}

function RECEIVER_MOVE_LEFT() {
    if(receiver[1]-1 >= 0){
        RECEIVER_FIRST_MOVE();
        REMOVE_PREVIOUS(receiver);
        receiver = [receiver[0], (receiver[1]-1)];
        NEW_POSITION(receiver);
    }
}

function RECEIVER_MOVE_UP() {
    if(receiver[0]-1 >= 0){
        RECEIVER_FIRST_MOVE();
        REMOVE_PREVIOUS(receiver);                    
        receiver = [(receiver[0]-1), (receiver[1])];
        NEW_POSITION(receiver);
    }
}

function RECEIVER_MOVE_RIGHT() {
    if(receiver[1]+1 < GRID_NCOL){
        RECEIVER_FIRST_MOVE();
        REMOVE_PREVIOUS(receiver);
        receiver = [receiver[0], (receiver[1]+1)];                    
        NEW_POSITION(receiver);
    }
}

function RECEIVER_MOVE_DOWN() {
    if(receiver[0]+1 < GRID_NROW){
        RECEIVER_FIRST_MOVE();
        REMOVE_PREVIOUS(receiver);
        receiver = [(receiver[0]+1), receiver[1]];
        NEW_POSITION(receiver);
    }
}

function UPDATE_GAME_BOARD(key) {
    switch (key){
        case 37: //left
            MOVE_LEFT();
            break;
        case 38: //up
            MOVE_UP();
            break;
        case 39: //right
            MOVE_RIGHT();
            break;
        case 40: //down
            MOVE_DOWN();
            break;
        case "left":
            RECEIVER_MOVE_LEFT();
            break;
        case "up":
            RECEIVER_MOVE_UP();
            break;
        case "right":
            RECEIVER_MOVE_RIGHT();
            break;
        case "down":
            RECEIVER_MOVE_DOWN();
            break;
    }
}

/*
  #####     #    #     # #######    ### #     #  #####  ####### ######  
 #     #   # #   ##   ## #           #  ##    # #     #    #    #     # 
 #        #   #  # # # # #           #  # #   # #          #    #     # 
 #  #### #     # #  #  # #####       #  #  #  #  #####     #    ######  
 #     # ####### #     # #           #  #   # #       #    #    #   #   
 #     # #     # #     # #           #  #    ## #     #    #    #    #  
  #####  #     # #     # #######    ### #     #  #####     #    #     # 
                                                                        
*/
function CREATE_EXPT_BUTTONS(obj) {
    if(obj.isTryMove || obj.isTrySay)
        $("#tryResultBut").click(function(){NEXT_TRIAL(obj)});
    else if (obj.isPracTrial) {
        $("#practiceQuitBut").click(function(){SHOW_QUIT_RESULT(obj)});
        $("#practiceResultBut").click(function(){NEXT_TRIAL(obj)});
    } else if (obj.isExptTrial) {
        $("#quitBut").click(function(){SHOW_QUIT_RESULT(obj)});
        $("#resultBut").click(function(){NEXT_TRIAL(obj)});
    }
}

function CREATE_SIGNAL_BUTTONS(obj, availableSignals) {
    if(!obj.buttonsCreated) {
        for (var i = 0; i < MAX_SAY_OPTION; i++) {
            if(obj.isTrySay || obj.isTryMove){
                $("#tryButOption" + i).css({
                    "border": "1px solid", 
                    "opacity": 0.2,
                    "background": "#bcbab8", 
                    "cursor": "auto",
                    "box-shadow": "none",
                    "pointer-events": "none"
                });

                for (var j = 0; j < availableSignals.length; j++) {
                    if (availableSignals[j] == $("#tryButOption" + i).html()) {
                        $("#tryButOption" + i).css({
                            "border": "revert",
                            "opacity": 1,
                            "background": "#9D8F8F", 
                            "box-shadow": "2px 2px 4px rgba(0, 0, 0, 0.25)",
                            "pointer-events": "revert",
                            "cursor": "pointer"
                        });
                        $("#tryButOption" + i).click(function(){RECEIVER_WALK(obj,$(this).html())});
                    }
                }
            } else if (obj.isPracTrial) {
                $("#practiceButOption" + i).css({
                    "border": "1px solid", 
                    "opacity": 0.2,
                    "background": "#bcbab8", 
                    "cursor": "auto",
                    "box-shadow": "none",
                    "pointer-events": "none"
                });

                for (var j = 0; j < availableSignals.length; j++) {
                    if (availableSignals[j] == $("#practiceButOption" + i).html()) {
                        $("#practiceButOption" + i).css({
                            "border": "revert",
                            "opacity": 1,
                            "background": "#9D8F8F", 
                            "box-shadow": "2px 2px 4px rgba(0, 0, 0, 0.25)",
                            "pointer-events": "revert",
                            "cursor": "pointer"
                        });
                        $("#practiceButOption" + i).click(function(){RECEIVER_WALK(obj,$(this).html())});
                    }
                }
            } else if (obj.isExptTrial) {
                $("#butOption" + i).css({    
                    "border": "1px solid", 
                    "opacity": 0.2,
                    "background": "#bcbab8", 
                    "cursor": "auto",
                    "box-shadow": "none",
                    "pointer-events": "none"
                });

                for (var j = 0; j < availableSignals.length; j++) {
                    if (availableSignals[j] == $("#butOption" + i).html()) {
                        $("#butOption" + i).css({
                            "border": "revert",
                            "opacity": 1,
                            "background": "#9D8F8F", 
                            "box-shadow": "2px 2px 4px rgba(0, 0, 0, 0.25)",
                            "pointer-events": "revert",
                            "cursor": "pointer"
                        });
                        $("#butOption" + i).click(function(){RECEIVER_WALK(obj,$(this).html())});
                    }
                }
            }
             
        }  
        obj.buttonsCreated = true;
   }
}

function TRY_EXPT_INSTR_FADE() {
    $("#tryExptFade").fadeTo(200, 0.4);
    $(".butExpt").css("pointer-events", "none");
}

function PRACTICE_EXPT_INSTR_FADE() {
    $("#practiceExptFade").fadeTo(200, 0.4);
    $(".butExpt").css("pointer-events", "none");
}

function EXPT_INSTR_FADE() {
    $("#exptFade").fadeTo(200, 0.4);
    $(".butExpt").css("pointer-events", "none");
}

function TRY_EXPT_INSTR_APPEAR() {
    $("#tryExptFade").css("opacity", 1);
    $(".butExpt").css("pointer-events", "auto");
}

function PRACTICE_EXPT_INSTR_APPEAR() {
    $("#practiceExptFade").css("opacity", 1);
    $(".butExpt").css("pointer-events", "auto");
}

function EXPT_INSTR_APPEAR() {
    $("#exptFade").css("opacity", 1);
    $(".butExpt").css("pointer-events", "auto");
}

function CHANGE_IN_TRIAL_INSTR(decision) {
    TRY_EXPT_INSTR_FADE();
    PRACTICE_EXPT_INSTR_FADE();
    EXPT_INSTR_FADE();
    if(decision == "do"){
        $("#tryDecision").html("Please hit ENTER when you land on the item.");
        $("#practiceDecision").html("Please hit ENTER when you land on the item.");
        $("#decision").html("Please hit ENTER when you land on the item.");
    } else if(decision == "say") {
        $("#tryDecision").html("<img class='shape' src='shape/receiver.png' />" + " is responding to your signal.");
        $("#practiceDecision").html("Please hit ENTER when you land on the item.");
        $("#decision").html("<img class='shape' src='shape/receiver.png' />" + " is responding to your signal.");
    }
}

/*
  #####   #####  ####### ######  #######    ######  #######    #    ######  ######  
 #     # #     # #     # #     # #          #     # #     #   # #   #     # #     # 
 #       #       #     # #     # #          #     # #     #  #   #  #     # #     # 
  #####  #       #     # ######  #####      ######  #     # #     # ######  #     # 
       # #       #     # #   #   #          #     # #     # ####### #   #   #     # 
 #     # #     # #     # #    #  #          #     # #     # #     # #    #  #     # 
  #####   #####  ####### #     # #######    ######  ####### #     # #     # ######  
                                                                                    
*/

function SETUP_SCOREBOARD(obj) {
    if(obj.isTryMove || obj.isTrySay) {
        $("#tryGoalShape").attr("src", obj.gridArray[obj.goalCoord[0]][obj.goalCoord[1]]); 
        $("#tryScore").html(obj.totalScore);
        $(".tryStep").html("0");
    } else if (obj.isPracTrial){
        $("#practiceGoalShape").attr("src", obj.gridArray[obj.goalCoord[0]][obj.goalCoord[1]]); 
        $("#practiceScore").html(obj.totalScore);
        $(".practiceStep").html("0");
    } else if (obj.isExptTrial){
        $("#goalShape").attr("src", obj.gridArray[obj.goalCoord[0]][obj.goalCoord[1]]); 
        $("#score").html(obj.totalScore);
        $(".step").html("0");
    }
}

function UPDATE_STEPS(obj) {
    obj.step++;
    if (obj.isTrySay || obj.isTryMove)
        $(".tryStep").html(obj.step);
    else if (obj.isPracTrial)
        $(".practiceStep").html(obj.step);
    else if (obj.isExptTrial)
        $(".step").html(obj.step);
}

/*
 ######  #######  #####  #     # #       #######    ######  ####### #     # 
 #     # #       #     # #     # #          #       #     # #     #  #   #  
 #     # #       #       #     # #          #       #     # #     #   # #   
 ######  #####    #####  #     # #          #       ######  #     #    #    
 #   #   #             # #     # #          #       #     # #     #   # #   
 #    #  #       #     # #     # #          #       #     # #     #  #   #  
 #     # #######  #####   #####  #######    #       ######  ####### #     # 
                                                                            
*/

function SHOW_WIN_RESULT_BOX_FOR_MOVE(obj,win) {
    if (obj.isTrySay || obj.isTryMove){
        $("#tryResult .tryStep").html("-" + obj.step);
        var reward;
        if(win){
            $("#tryResultText").html("Congratulations!<br><br>You reached the target!");
            reward = REWARD;
        } else {
            $("#tryResultText").html("Sorry, you did not reach the target.<br><br>Good luck on your next round!");
            reward = 0;
        }
        $("#tryReward").html(reward);
        $("#tryScoreThisRound").html(reward - obj.step);
        $("#tryTotalAfter").html(obj.totalScore);
        $("#tryResult").show();
    } else if (obj.isPracTrial){
        $("#practiceResult .practiceStep").html("-" + obj.step);
        var reward;
        if(win){
            $("#practiceResultText").html("Congratulations!<br><br>You reached the target!");
            reward = REWARD;
        } else {
            $("#practiceResultText").html("Sorry, you did not reach the target.<br><br>Good luck on your next round!");
            reward = 0;
        }
        $("#practiceReward").html(reward);
        $("#practiceScoreThisRound").html(reward - obj.step);
        $("#practiceTotalAfter").html(obj.totalScore);
        $("#practiceResult").show();
    } else if (obj.isExptTrial){
        $("#result .step").html("-" + obj.step);
        var reward;
        if(win){
            $("#resultText").html("Congratulations!<br><br>You reached the target!");
            reward = REWARD;
        } else {
            $("#resultText").html("Sorry, you did not reach the target.<br><br>Good luck on your next round!");
            reward = 0;
        }
        $("#reward").html(reward);
        $("#scoreThisRound").html(reward - obj.step);
        $("#totalAfter").html(obj.totalScore);
        $("#result").show();
    }
}

function SHOW_WIN_RESULT_BOX_FOR_SAY(obj,win) {
    if (obj.isTrySay || obj.isTryMove) {
        $("#tryResult .tryStep").html("-" + obj.step);
        var reward;
        if(win){
            var landedItem = $('#shape'+ receiver[0] + 'v' + receiver[1] + ' .shape').attr('src');
            $("#tryResultText").html("<img class='inlineShape' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9; padding: 2px;' src='" + landedItem + "'>" + "<br>Congratulations!<br>You reached the target!");
            reward = REWARD;
        } else {
            var landedItem = $('#shape'+ receiver[0] + 'v' + receiver[1] + ' .shape').attr('src');
            $("#tryResultText").html("<img class='inlineShape' style='background-color: white;' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9' src='" + landedItem + "'>" + "<br>Sorry, you did not reach the target.<br>Good luck on your next round!");
            reward = 0;
        }
        $("#tryReward").html(reward);
        $("#tryScoreThisRound").html(reward - obj.step);
        $("#tryTotalAfter").html(obj.totalScore);
        $("#tryResult").show();
    } else if(obj.isPracTrial){
        $("#practiceResult .practiceStep").html("-" + obj.step);
        var reward;
        if(win){
            var landedItem = $('#shape'+ receiver[0] + 'v' + receiver[1] + ' .shape').attr('src');
            $("#practiceResultText").html("<img class='inlineShape' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9; padding: 2px;' src='" + landedItem + "'>" + "<br>Congratulations!<br>You reached the target!");
            reward = REWARD;
        } else {
            var landedItem = $('#shape'+ receiver[0] + 'v' + receiver[1] + ' .shape').attr('src');
            $("#practiceResultText").html("<img class='inlineShape' style='background-color: white;' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9' src='" + landedItem + "'>" + "<br>Sorry, you did not reach the target.<br>Good luck on your next round!");
            reward = 0;
        }
        $("#practiceReward").html(reward);
        $("#practiceScoreThisRound").html(reward - obj.step);
        $("#practiceTotalAfter").html(obj.totalScore);
        $("#practiceResult").show();
    } else if (obj.isExptTrial){
        $("#result .step").html("-" + obj.step);
        var reward;
        if(win){
            var landedItem = $('#shape'+ receiver[0] + 'v' + receiver[1] + ' .shape').attr('src');
            $("#resultText").html("<img class='inlineShape' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9; padding: 2px;' src='" + landedItem + "'>" + "<br>Congratulations!<br>You reached the target!");
            reward = REWARD;
        } else {
            var landedItem = $('#shape'+ receiver[0] + 'v' + receiver[1] + ' .shape').attr('src');
            $("#resultText").html("<img class='inlineShape' style='background-color: white;' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9' src='" + landedItem + "'>" + "<br>Sorry, you did not reach the target.<br>Good luck on your next round!");
            reward = 0;
        }
        $("#reward").html(reward);
        $("#scoreThisRound").html(reward - obj.step);
        $("#totalAfter").html(obj.totalScore);
        $("#result").show();
    }
}

function SHOW_QUIT_RESULT(obj) {
    obj.allowMove = false;
    if(obj.isPracTrial){
        reward = 0;
        $("#practiceResultText").html("Don't worry!<br>Good luck on your next round!");
        $("#practiceReward").html(0);
        $("#practiceScoreThisRound").html(reward - practice.step);
        $("#practiceTotalAfter").html(practice.totalScore);
        $("#practiceResult").show();
    } if(obj.isExptTrial){
        reward = 0;
        $("#resultText").html("Don't worry!<br>Good luck on your next round!");
        $("#reward").html(0);
        $("#scoreThisRound").html(reward - practice.step);
        $("#totalAfter").html(practice.totalScore);
        $("#result").show();
        RECORD_DECISION_DATA(obj, "quit");
        RECORD_END_LOCATION(obj, "noChange");
    }
    
};
