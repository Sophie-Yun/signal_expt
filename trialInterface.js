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
function TRIAL_SET_UP (obj) {
    $(".gridItem").remove();
    $(".gridEmpty").remove();

    obj.gridArray = [
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,],
        [,,,,,,,,]
    ];
    receiver = [2, 4];//row, col
    signaler = [9, 4];
    obj.gridArray[receiver[0]][receiver[1]] = SHAPE_DIR + "receiver.png";
    obj.gridArray[signaler[0]][signaler[1]] = SHAPE_DIR + "signaler.png";

    if (!obj.isExptTrial) {
        obj.signalSpace = PRAC_TRIAL_DICT["prac" + obj.trialIndex][0];
        obj.gridString = PRAC_TRIAL_DICT["prac" + obj.trialIndex][1];
    } else {
        obj.signalSpace = TRIAL_DICT[trialList[num]][0];
        obj.gridString = TRIAL_DICT[trialList[num]][1];
        $("#pracRound").html("");
    }
    /*
    for (var i = 0; i < signalSpace.length; i++) {
        var j = 0;
        while (signalSpace[i] != $("#butOption" + j).html()) {
            j++;
        }
        $("#butOption" + j).css({"border": "2px solid #625757", 
                                "background": "#9D8F8F", 
                                "box-shadow": "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                "pointer-events": "auto",
                                "cursor": "pointer"
                                });
    }*/

    var coordinates = obj.gridString.match(/\d+/g);
    var shape = obj.gridString.match(/\w+ +\w+/g);
    
    for (var i = 0; i < shape.length; i++) {
        var col = coordinates[2 * i];
        var row = GRID_NROW - coordinates[2 * i + 1] - 1;
        obj.gridArray[row][col] = PIC_DICT[shape[i]];
        if(!obj.isExptTrial) {
            if (shape[i] == GOAL_DICT["expt" + obj.trialIndex])
                obj.goalCoord = [row, col];
        } else {
            if (shape[i] == GOAL_DICT[trialList[obj.trialIndex]])
                obj.goalCoord = [row, col];
        }
    }

    //signalerMoved = false;
    //receiverMoved = false;
}

function CREATE_GRID(gridArray, nrow, ncol) {
    var shapeId; 
    for (var row = 0; row < nrow; row++) {
        for (var col = 0; col < ncol; col++) {
            shapeId = "shape" + row + "v" + col;
            
            if (gridArray[row][col]!= null){
                $(".gridContainer").append("<div class='gridItem' id='" + shapeId + "'></div>")
                $("#" + shapeId).append($("<img>", {class: "shape", src: gridArray[row][col]}));
            }
            else{
                $(".gridContainer").append("<div class='gridEmpty' id='" + shapeId + "'></div>");
            }
        };
    };
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

function CREATE_SIGNAL_BUTTONS(obj, availableSignals) {
    //if(!obj.buttonsCreated) {
        for (var i = 0; i < MAX_SAY_OPTION; i++) {
            $("#butOption" + i).css({"border": "1px solid", 
                "opacity": 0.2,
                "background": "#bcbab8", 
                "cursor": "auto",
                "box-shadow": "none"
                });
            
            for (var j = 0; j < availableSignals.length; j++) {
                if (availableSignals[j] == $("#butOption" + i).html()) {
                    $("#butOption" + i).css({"border": "2px solid #625757", 
                                    "opacity": 1,
                                    "background": "#9D8F8F", 
                                    "box-shadow": "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                    "pointer-events": "auto",
                                    "cursor": "pointer"
                                    });
                    $("#butOption" + i).click(function(){RECEIVER_WALK(obj,$(this).html())});
                }
            }
        }  
        //obj.buttonsCreated = true;
   // }
}

function EXPT_INSTR_FADE() {
    $("#exptFade").fadeTo(200, 0.4);
    //$(".butExpt").css("box-shadow", "none");
    $(".butExpt").css("cursor", "default");
    $('.butExpt').prop('disabled', true);
}

function EXPT_INSTR_APPEAR() {
    $("#exptFade").css("opacity", 1);
    //$(".butExpt").css("box-shadow", "0px 4px 4px rgba(0, 0, 0, 0.25)");
    $(".butExpt").css("cursor", "pointer");
    $('.butExpt').prop('disabled', false);
}

function CHANGE_IN_TRIAL_INSTR(decision) {
    EXPT_INSTR_FADE();
    if(decision == "do")
        $("#decision").html("Please hit ENTER when you land on the item.");
    else if(decision == "say")
        $("#decision").html("<img class='shape' src='shape/receiver.png' />" + " is responding to your signal.");
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

function SETUP_RECORD_BOX(obj) {
    $("#goalShape").attr("src", obj.gridArray[obj.goalCoord[0]][obj.goalCoord[1]]);
    $("#score").html(obj.totalScore);
    $(".step").html("0");
}

function UPDATE_STEPS(obj) {
    obj.step++;
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

function SHOW_WIN_RESULT_BOX_FOR_SAY(obj,win) {
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

function SHOW_QUIT_RESULT(obj) {
    if(!recorded){
        EXPT_INSTR_FADE();
        decision = "quit";
        var currentTime = Date.now();
        decideTime = (currentTime - startTime)/1000;
        recorded = true;
    }
    if(!obj.isExptTrial){
        reward = 0;
        $("#resultText").html("Don't worry!<br>Good luck on your next round!");
        $("#reward").html(0);
        $("#scoreThisRound").html(reward - practice.step);
        $("#totalAfter").html(practice.totalScore);
        $("#result").show();
    }
    
};
