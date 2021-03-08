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
    } else if (obj.isSanityCheck) {
        for (var row = 0; row < nrow; row++) {
            for (var col = 0; col < ncol; col++) {
                shapeId = "shape" + row + "v" + col;
                
                if (gridArray[row][col]!= null){
                    $("#sanityCheckGridContainer").append("<div class='gridItem' id='" + shapeId + "'></div>")
                    $("#" + shapeId).append($("<img>", {class: "shape", src: gridArray[row][col]}));
                }
                else{
                    $("#sanityCheckGridContainer").append("<div class='gridEmpty' id='" + shapeId + "'></div>");
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

function NEW_SIGNALER_POSITION(signalerLocation) {
    var signalerImg = "signaler.png";
    if($("#shape"+ signalerLocation[0] + "v" + signalerLocation[1]).hasClass("gridItem"))
        $("#shape" + signalerLocation[0] + "v" + signalerLocation[1]).append($("<img>", {class: "top", src: SHAPE_DIR + signalerImg}));
    else
        $("#shape" + signalerLocation[0] + "v" + signalerLocation[1]).append($("<img>", {class: "shape", src: SHAPE_DIR + signalerImg}));
}

function NEW_RECEIVER_POSITION(receiverLocation) {
    var receiverImg = "receiver.png";
    if($("#shape"+ receiverLocation[0] + "v" + receiverLocation[1]).hasClass("gridItem"))
        $("#shape" + receiverLocation[0] + "v" + receiverLocation[1]).append($("<img>", {class: "top", src: SHAPE_DIR + receiverImg}));
    else
        $("#shape" + receiverLocation[0] + "v" + receiverLocation[1]).append($("<img>", {class: "shape", src: SHAPE_DIR + receiverImg}));
}

function FIRST_MOVE(obj) {
    if(!signalerMoved){
        signalerMoved = true;
        $("#shape"+ obj.signalerLocation[0] + "v" + obj.signalerLocation[1] + " img").remove();
        $("#shape"+ obj.signalerLocation[0] + "v" + obj.signalerLocation[1]).attr("class", "gridEmpty");
    }
}

function MOVE_LEFT(obj) {
    if(obj.signalerLocation[1]-1 >= 0){
        FIRST_MOVE(obj);
        REMOVE_PREVIOUS(obj.signalerLocation);
        obj.signalerLocation = [obj.signalerLocation[0], (obj.signalerLocation[1]-1)];
        RECORD_SIGNALER_PATH(obj);
        NEW_SIGNALER_POSITION(obj.signalerLocation);
    }
}

function MOVE_UP(obj) {
    if(obj.signalerLocation[0]-1  >= 0){
        FIRST_MOVE(obj);
        REMOVE_PREVIOUS(obj.signalerLocation);
        obj.signalerLocation = [(obj.signalerLocation[0]-1), obj.signalerLocation[1]];
        RECORD_SIGNALER_PATH(obj);
        NEW_SIGNALER_POSITION(obj.signalerLocation);
    }
}

function MOVE_RIGHT(obj) {
    if(obj.signalerLocation[1]+1 < GRID_NCOL){
        FIRST_MOVE(obj);
        REMOVE_PREVIOUS(obj.signalerLocation);
        obj.signalerLocation = [obj.signalerLocation[0], (obj.signalerLocation[1]+1)];
        RECORD_SIGNALER_PATH(obj);
        NEW_SIGNALER_POSITION(obj.signalerLocation);
    }
}

function MOVE_DOWN(obj) {
    if((obj.signalerLocation[0]+1) < GRID_NROW){
        FIRST_MOVE(obj);
        REMOVE_PREVIOUS(obj.signalerLocation);
        obj.signalerLocation = [(obj.signalerLocation[0]+1), obj.signalerLocation[1]];
        RECORD_SIGNALER_PATH(obj);
        NEW_SIGNALER_POSITION(obj.signalerLocation);
    }
}

function RECEIVER_FIRST_MOVE(obj) {
    if(!receiverMoved ){
        receiverMoved = true;
        $("#shape"+ obj.receiverLocation[0] + "v" + obj.receiverLocation[1] + " img").remove();
        $("#shape"+ obj.receiverLocation[0] + "v" + obj.receiverLocation[1]).attr("class", "gridEmpty");
    }
}

function RECEIVER_MOVE_LEFT(obj) {
    if(obj.receiverLocation[1]-1 >= 0){
        RECEIVER_FIRST_MOVE(obj);
        REMOVE_PREVIOUS(obj.receiverLocation);
        obj.receiverLocation = [obj.receiverLocation[0], (obj.receiverLocation[1]-1)];
        RECORD_RECEIVER_PATH(obj);
        NEW_RECEIVER_POSITION(obj.receiverLocation);
    }
}

function RECEIVER_MOVE_UP(obj) {
    if(obj.receiverLocation[0]-1 >= 0){
        RECEIVER_FIRST_MOVE(obj);
        REMOVE_PREVIOUS(obj.receiverLocation);                
        obj.receiverLocation = [(obj.receiverLocation[0]-1), (obj.receiverLocation[1])];
        RECORD_RECEIVER_PATH(obj);
        NEW_RECEIVER_POSITION(obj.receiverLocation);
    }
}

function RECEIVER_MOVE_RIGHT(obj) {
    if(obj.receiverLocation[1]+1 < GRID_NCOL){
        RECEIVER_FIRST_MOVE(obj);
        REMOVE_PREVIOUS(obj.receiverLocation);
        obj.receiverLocation = [obj.receiverLocation[0], (obj.receiverLocation[1]+1)];  
        RECORD_RECEIVER_PATH(obj);
        NEW_RECEIVER_POSITION(obj.receiverLocation);
    }
}

function RECEIVER_MOVE_DOWN(obj) {
    if(obj.receiverLocation[0]+1 < GRID_NROW){
        RECEIVER_FIRST_MOVE(obj);
        REMOVE_PREVIOUS(obj.receiverLocation);
        obj.receiverLocation = [(obj.receiverLocation[0]+1), obj.receiverLocation[1]];
        RECORD_RECEIVER_PATH(obj);
        NEW_RECEIVER_POSITION(obj.receiverLocation);
    }
}

function UPDATE_GAME_BOARD(obj, key) {
    switch (key){
        case 37: //left
            MOVE_LEFT(obj);
            break;
        case 38: //up
            MOVE_UP(obj);
            break;
        case 39: //right
            MOVE_RIGHT(obj);
            break;
        case 40: //down
            MOVE_DOWN(obj);
            break;
        case "left":
            RECEIVER_MOVE_LEFT(obj);
            break;
        case "up":
            RECEIVER_MOVE_UP(obj);
            break;
        case "right":
            RECEIVER_MOVE_RIGHT(obj);
            break;
        case "down":
            RECEIVER_MOVE_DOWN(obj);
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
    else if (obj.isSanityCheck) {
        $("#sanityCheckQuitBut").click(function(){SHOW_QUIT_RESULT(obj)});
        $("#sanityCheckResultBut").click(function(){NEXT_TRIAL(obj)});
    } else if (obj.isPracTrial) {
        $("#practiceQuitBut").click(function(){SHOW_QUIT_RESULT(obj)});
        $("#practiceResultBut").click(function(){NEXT_TRIAL(obj)});
    } else if (obj.isExptTrial) {
        $("#quitBut").click(function(){SHOW_QUIT_RESULT(obj)});
        $("#resultBut").click(function(){NEXT_TRIAL(obj)});
    }
}

function CREATE_SIGNAL_BUTTONS(obj, availableSignals) {
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
            if(!obj.buttonsCreated)  
                $("#tryButOption" + i).click(function(){RECEIVER_WALK(obj,$(this).html())});

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
                }
            }
        } else if (obj.isSanityCheck) {
            $("#sanityCheckButOption" + i).css({
                "border": "1px solid", 
                "opacity": 0.2,
                "background": "#bcbab8", 
                "cursor": "auto",
                "box-shadow": "none",
                "pointer-events": "none"
            });
            if(!obj.buttonsCreated)  
                $("#sanityCheckButOption" + i).click(function(){RECEIVER_WALK(obj,$(this).html())});
            for (var j = 0; j < availableSignals.length; j++) {
                if (availableSignals[j] == $("#sanityCheckButOption" + i).html()) {
                    $("#sanityCheckButOption" + i).css({
                        "border": "revert",
                        "opacity": 1,
                        "background": "#9D8F8F", 
                        "box-shadow": "2px 2px 4px rgba(0, 0, 0, 0.25)",
                        "pointer-events": "revert",
                        "cursor": "pointer"
                    });
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
            if(!obj.buttonsCreated)  
                $("#practiceButOption" + i).click(function(){RECEIVER_WALK(obj,$(this).html())});
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
            if(!obj.buttonsCreated)  
                $("#butOption" + i).click(function(){RECEIVER_WALK(obj,$(this).html())});    
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
                }
            }
        }
    }
    obj.buttonsCreated = true;
}

function TRY_EXPT_INSTR_FADE() {
    $("#tryExptFade").fadeTo(200, 0.4);
    $(".butExpt").css("pointer-events", "none");
}

function SANITY_CHECK_INSTR_FADE() {
    $("#sanityCheckFade").fadeTo(200, 0.4);
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

function SANITY_CHECK_INSTR_APPEAR() {
    $("#sanityCheckFade").css("opacity", 1);
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
    SANITY_CHECK_INSTR_FADE();
    PRACTICE_EXPT_INSTR_FADE();
    EXPT_INSTR_FADE();
    if(decision == "do"){
        $("#tryDecision").html("Please hit ENTER when you land on the item.");
        $("#practiceDecision").html("Please hit ENTER when you land on the item.");
        $("#decision").html("Please hit ENTER when you land on the item.");
    } else if(decision == "say") {
        $("#tryDecision").html("<img class='shape' src='shape/receiver.png' />" + " is responding to your signal.");
        $("#practiceDecision").html("<img class='shape' src='shape/receiver.png' />" + " is responding to your signal.");
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
    } else if (obj.isSanityCheck){
        $("#sanityCheckGoalShape").attr("src", obj.gridArray[obj.goalCoord[0]][obj.goalCoord[1]]); 
        $("#sanityCheckScore").html(obj.totalScore);
        $(".sanityCheckStep").html("0");
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
    else if (obj.isSanityCheck)
        $(".sanityCheckStep").html(obj.step);
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

function getSanityCheckFeedback(obj, trialStrategy) {
    if (trialStrategy == "communicate") {
        reversedReceiverIntentionDict = Object.entries(obj.inputData[obj.trialIndex]["receiverIntentionDict"]).reduce((tmpObj, item) => (tmpObj[item[1]] = item[0]) && tmpObj, {});
        intention = obj.inputData[obj.trialIndex]["intention"];
        feedback = "Some feedback: the ideal way to reach the target would've been to signal " + reversedReceiverIntentionDict[intention] + ".";
    } else if (trialStrategy == "do") {
        feedback = "Some feedback: the ideal way to reach the target would've been to move to the target.";
    } else if (trialStrategy == "quit") {
        feedback = "Some feedback: the ideal way to reach the target would've been to quit.";
    }
    return feedback;
}


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
    } else if (obj.isSanityCheck){ // TODO: THIS IS WHERE I SHOULD GIVE THEM THE NOTE/TIP
        trialStrategy = obj.inputData[obj.trialIndex]["trialStrategy"];
        $("#sanityCheckResult .sanityCheckStep").html("-" + obj.step);
        var reward;
        if(win){
            if (trialStrategy == "do")
                $("#sanityCheckResultText").html("Congratulations!<br><br>You reached the target!");
            else
                $("#sanityCheckResultText").html("Congratulations! " + getSanityCheckFeedback(obj, trialStrategy) + "<br><br>You reached the target!");
            reward = REWARD;
        } else {
            $("#sanityCheckResultText").html("Sorry, you did not reach the target. " + getSanityCheckFeedback(obj, trialStrategy) + "<br><br>Good luck on your next round! ");
            reward = 0;
            obj.sanityMoveFails++; // TODO: did we decide on how to drop them
            console.log(obj.sanityMoveFails);
            // if drop right away, do it by checking here and the respective for say and quit
        }
        $("#sanityCheckReward").html(reward);
        $("#sanityCheckScoreThisRound").html(reward - obj.step);
        $("#sanityCheckTotalAfter").html(obj.totalScore);
        $("#sanityCheckResult").show();
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
            var landedItem = $('#shape'+ obj.receiverLocation[0] + 'v' + obj.receiverLocation[1] + ' .shape').attr('src');
            $("#tryResultText").html("<img class='inlineShape' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9; padding: 2px;' src='" + landedItem + "'>" + "<br>Congratulations!<br>You reached the target!");
            reward = REWARD;
        } else {
            var landedItem = $('#shape'+ obj.receiverLocation[0] + 'v' + obj.receiverLocation[1] + ' .shape').attr('src');
            $("#tryResultText").html("<img class='inlineShape' style='background-color: white;' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9' src='" + landedItem + "'>" + "<br>Sorry, you did not reach the target.<br>Good luck on your next round!");
            reward = 0;
        }
        $("#tryReward").html(reward);
        $("#tryScoreThisRound").html(reward - obj.step);
        $("#tryTotalAfter").html(obj.totalScore);
        $("#tryResult").show();
    } else if(obj.isSanityCheck){ //TODO: SHOULD IS ALSO GO HERE IDK BRO
        trialStrategy = obj.inputData[obj.trialIndex]["trialStrategy"];
        $("#sanityCheckResult .sanityCheckStep").html("-" + obj.step);
        var reward;
        if(win){
            var landedItem = $('#shape'+ obj.receiverLocation[0] + 'v' + obj.receiverLocation[1] + ' .shape').attr('src');
            if (trialStrategy == "communicate")
                $("#sanityCheckResultText").html("<img class='inlineShape' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9; padding: 2px;' src='" + landedItem + "'>" + "<br>Congratulations!<br>You reached the target!");
            else
                $("#sanityCheckResultText").html("<img class='inlineShape' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9; padding: 2px;' src='" + landedItem + "'>" + "<br>Congratulations!" + getSanityCheckFeedback(obj, trialStrategy) + "<br>You reached the target!");
            reward = REWARD;
        } else {
            var landedItem = $('#shape'+ obj.receiverLocation[0] + 'v' + obj.receiverLocation[1] + ' .shape').attr('src');
            $("#sanityCheckResultText").html("<img class='inlineShape' style='background-color: white;' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9' src='" + landedItem + "'>" + "<br>Sorry, you did not reach the target. " + getSanityCheckFeedback(obj, trialStrategy) + "<br>Good luck on your next round!");
            reward = 0;
            obj.sanitySayFails++;
            console.log(obj.sanitySayFails);
        }
        $("#sanityCheckReward").html(reward);
        $("#sanityCheckScoreThisRound").html(reward - obj.step);
        $("#sanityCheckTotalAfter").html(obj.totalScore);
        $("#sanityCheckResult").show();
    } else if(obj.isPracTrial){
        $("#practiceResult .practiceStep").html("-" + obj.step);
        var reward;
        if(win){
            var landedItem = $('#shape'+ obj.receiverLocation[0] + 'v' + obj.receiverLocation[1] + ' .shape').attr('src');
            $("#practiceResultText").html("<img class='inlineShape' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9; padding: 2px;' src='" + landedItem + "'>" + "<br>Congratulations!<br>You reached the target!");
            reward = REWARD;
        } else {
            var landedItem = $('#shape'+ obj.receiverLocation[0] + 'v' + obj.receiverLocation[1] + ' .shape').attr('src');
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
            var landedItem = $('#shape'+ obj.receiverLocation[0] + 'v' + obj.receiverLocation[1] + ' .shape').attr('src');
            $("#resultText").html("<img class='inlineShape' src='shape/receiver.png'/>" + " lands on " +  "<img class='inlineShape' style='background-color: #f9f9f9; padding: 2px;' src='" + landedItem + "'>" + "<br>Congratulations!<br>You reached the target!");
            reward = REWARD;
        } else {
            var landedItem = $('#shape'+ obj.receiverLocation[0] + 'v' + obj.receiverLocation[1] + ' .shape').attr('src');
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
    if(obj.isSanityCheck){ // TODO: OH I THINK HERE TOO. IT SHOULD BE ALL THREE. maybe right one function that I can just use universally
        trialStrategy = obj.inputData[obj.trialIndex]["trialStrategy"];
        reward = 0;
        obj.sanityQuitFails++;
        console.log(obj.sanityQuitFails);

        $("#sanityCheckResultText").html("Don't worry! " + getSanityCheckFeedback(obj, trialStrategy) + "<br>Good luck on your next round!");
        $("#sanityCheckReward").html(0);
        $("#sanityCheckScoreThisRound").html(reward - practice.step);
        $("#sanityCheckTotalAfter").html(practice.totalScore);
        $("#sanityCheckResult").show();
    } if(obj.isPracTrial){
        reward = 0;
        $("#practiceResultText").html("Don't worry!<br>Good luck on your next round!");
        $("#practiceReward").html(0);
        $("#practiceScoreThisRound").html(reward - practice.step);
        $("#practiceTotalAfter").html(practice.totalScore);
        $("#practiceResult").show();
    } if(obj.isExptTrial){
        RECORD_DECISION_DATA(obj, "quit");
        RECORD_ACTION_TIME(obj);
        reward = 0;
        $("#resultText").html("Don't worry!<br>Good luck on your next round!");
        $("#reward").html(0);
        $("#scoreThisRound").html(reward - practice.step);
        $("#totalAfter").html(practice.totalScore);
        $("#result").show();
        RECORD_SIGNAL_DATA(obj);
        RECORD_SIGNALER_END_LOCATION(obj);
        RECORD_SIGNALER_ACHIEVED(obj);
        RECORD_RECEIVER_END_LOCATION(obj);
        RECORD_RECEIVER_ACHIEVED(obj);
    }
    
};