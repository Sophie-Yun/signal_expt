const GRID_NROW = 10;
const GRID_NCOL = 9;
const SHAPE_DIR = "shape/";
const RECEIVER_MOVE_SPEED = 0.5;
const EMPTY_BOARD = [
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
var trial;
var score = 0;
var signalerMoved;
var receiverMoved;
var step = 0;
var trialNum = 0;
var decision;
var startTime;
var decideTime;
var finishTime;
var recorded = false;

/*
  #####  ####### ####### #     # ######  
 #     # #          #    #     # #     # 
 #       #          #    #     # #     # 
  #####  #####      #    #     # ######  
       # #          #    #     # #       
 #     # #          #    #     # #       
  #####  #######    #     #####  #       
                                         
*/
var receiver; //row, col
var signaler;
var goal;

function TRIAL_SET_UP (num) {
    switch(num) {        
        case 0:
            goal = [6, 8];
            trial = EMPTY_BOARD;
            trial[1][3] = SHAPE_DIR + "greenCircle.png";
            trial[1][7] = SHAPE_DIR + "purpleTriangle.png";
            trial[3][4] = SHAPE_DIR + "redCircle.png";
            trial[6][8] = SHAPE_DIR + "purpleCircle.png";
            trial[1][7] = SHAPE_DIR + "purpleTriangle.png";
            trial[8][1] = SHAPE_DIR + "greenSquare.png";
            break;
        case 1:
            goal = [3, 6];
            trial = [
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
            trial[3][6] = SHAPE_DIR + "purpleCircle.png";
            trial[4][8] = SHAPE_DIR + "greenTriangle.png";
            break;
    }
    receiver = [2, 4];//row, col
    signaler = [9, 4];
    trial[receiver[0]][receiver[1]] = SHAPE_DIR + "receiver.png";
    trial[signaler[0]][signaler[1]] = SHAPE_DIR + "signaler.png";

    signalerMoved = false;
    receiverMoved = false;
}

$(document).ready(function() {
    instr = new instrObject(instr_options);
    instr.start();
});

/*                              
 # #    #  ####  ##### #####  
 # ##   # #        #   #    # 
 # # #  #  ####    #   #    # 
 # #  # #      #   #   #####  
 # #   ## #    #   #   #   #  
 # #    #  ####    #   #    # 
*/
var instr_text = new Array;
instr_text[0] = "<strong>Welcome to this experiment!</strong><br><br>This experiment tests on how people communicate when they collaborate to achieve a goal."
instr_text[1] = "Your contribution would greatly help us identify communication patterns in human cooperation. The results of the study might also be applied to building artificial intelligence.<br><br>Please carefully read the instructions on the next few pages. There will be a question that asks you about the instructions later."
instr_text[2] = "This study takes about 10 minutes.<br><br>On each page, you will see a grid with figures in different shapes and different colors at random positions. The letter \"S\" indicates where you stand. The letter \"R\" indicates where a robot stands. The robot is your teammate for this task.<br><br>You will also see a message that tells you what is your target figure for this round. You are the only one who can see the message, while the robot cannot see the message. Your task is to reach the target figure through either walking to the target figure by yourself, or sending only one of the given signals to the robot to let it reach the target figure. <br><br>If either of you successfully reaches the goal, you both get rewards of 20 points. Otherwise, you do not get points. However, each step taken by either of you will result in a penalty of 1 point."
instr_text[3] = "Here is one example of one round. (Will come up later.)"
instr_text[4] = "Which of the following is <b>not correct?</b> <br><br>You can achieve the goal by walking on your own.<br>If either the robot or you achieve the goal, you get 20 points.<br>Each step taken by either the robot or you costs 1 point.<br>You can achieve the goal by sending out several signals to the robot."
instr_text[5] = "Correct! Please click on NEXT to start the first round!"


//const INSTR_FUNC_DICT = {
//};

var instr_options = {
    text: instr_text,
    //funcDict: INSTR_FUNC_DICT,
};

class instrObject {
    constructor(options = {}) {
        Object.assign(this, {
            text: [],
            //funcDict: {},
            //qConditions: [],
        }, options);
        this.index = 0;
        //this.instrKeys = Object.keys(this.funcDict).map(Number);
        //this.qAttemptN = {};
       //for (var i=0;i<this.qConditions.length;i++){
         //   this.qAttemptN[this.qConditions[i]] = 1;
        //}
        //this.readingTimes = [];
    }

    start(textBox = $("#instrPage"), textElement = $("#instrText")) {
        textElement.html(this.text[0]);
        //if (this.instrKeys.includes(this.index)) {
          //  this.funcDict[this.index]();
        //}
        textBox.show();
    }

    next(textElement = $("#instrText")) {
        //this.readingTimes.push((Date.now() - this.startTime)/1000);
        this.index += 1;
        $("#instrPage").hide();
        TRIAL_SET_UP(trialNum);
        CREATE_GRID(trial, GRID_NROW, GRID_NCOL);
        SETUP_RECORD_BOX(goal, score);
        $("#exptPage").show();
        startTime = Date.now();
        MOVE();/*
        if (this.index < this.text.length) {
            textElement.html(this.text[this.index]);
            //if (this.instrKeys.includes(this.index)) {
              //  this.funcDict[this.index]();
            //}
            //this.startTime = Date.now();
        } else {
            $("#instrPage").hide();
            $("#exptPage").show();
        }*/
    }
}

/*
                            
 ###### #    # #####  ##### 
 #       #  #  #    #   #   
 #####    ##   #    #   #   
 #        ##   #####    #   
 #       #  #  #        #   
 ###### #    # #        #   
                            
*/

function MOVE() {
    var arrowClicked = false; //to prevent clicking on ENTER before arrow keys
    document.onkeydown = function(e) {
        if(!recorded){
            decision = "do";
            var currentTime = Date.now();
            decideTime = (currentTime - startTime)/1000;
            recorded = true;
        }
        switch (e.keyCode) {
            case 37: //left
                arrowClicked = true;
                score--;
                step++;
                $("#exptInstr").hide();
                $("#exptWaitText").html("Press ENTER when you reach the item.");
                $("#score").html(score);
                if(signaler[1]-1 >= 0){
                    if(!signalerMoved ){
                        signalerMoved = true;
                        $("#shape"+ signaler[0] + "v" + signaler[1] + " img").remove();
                        $("#shape"+ signaler[0] + "v" + signaler[1]).attr("class", "gridEmpty");
                    }
                    REMOVE_PREVIOUS(signaler);
                    signaler = [signaler[0], (signaler[1]-1)];
                    NEW_POSITION(signaler);
                }
                break;
            case 38: //up
                arrowClicked = true;
                score--;
                step++;
                $("#exptInstr").hide();
                $("#exptWaitText").html("Press ENTER when you reach the item.");
                $("#score").html(score);
                if(signaler[0]-1  >= 0){
                    if(!signalerMoved ){
                        signalerMoved = true;
                        $("#shape"+ signaler[0] + "v" + signaler[1] + " img").remove();
                        $("#shape"+ signaler[0] + "v" + signaler[1]).attr("class", "gridEmpty");
                    }
                    REMOVE_PREVIOUS(signaler);
                    signaler = [(signaler[0]-1), signaler[1]];
                    NEW_POSITION(signaler);
                }
                break;
            case 39: //right
                arrowClicked = true;
                score--;
                step++;
                $("#exptInstr").hide();
                $("#exptWaitText").html("Press ENTER when you reach the item.");
                $("#score").html(score);
                if(signaler[1]+1 < GRID_NCOL){
                    if(!signalerMoved ){
                        signalerMoved = true;
                        $("#shape"+ signaler[0] + "v" + signaler[1] + " img").remove();
                        $("#shape"+ signaler[0] + "v" + signaler[1]).attr("class", "gridEmpty");
                    }
                    REMOVE_PREVIOUS(signaler);
                    signaler = [signaler[0], (signaler[1]+1)];
                    NEW_POSITION(signaler);
                }
                break;
            case 40: //down
                arrowClicked = true;
                score--;
                step++;
                $("#exptInstr").hide();
                $("#exptWaitText").html("Press ENTER when you reach the item.");
                $("#score").html(score);
                if((signaler[0]+1) < GRID_NROW){
                    if(!signalerMoved ){
                        signalerMoved = true;
                        $("#shape"+ signaler[0] + "v" + signaler[1] + " img").remove();
                        $("#shape"+ signaler[0] + "v" + signaler[1]).attr("class", "gridEmpty");
                    }
                    REMOVE_PREVIOUS(signaler);
                    signaler = [(signaler[0]+1), signaler[1]];
                    NEW_POSITION(signaler);
                }
                break;
            case 13: //ENTER
                if (arrowClicked){
                    if(signaler[0] == goal[0] && signaler[1] == goal[1]){
                        score = score + 20;
                        $("#score").html(score);
                        $("#exptWaitText").hide();
                        $("#exptResultText").html("Congratulations!<br><br>You reached the goal and received 20 points!<br><br>You walked " + step + " steps.");
                        step = 0;
                        $("#exptResultBox").css("display", "inline-block");
                    } else if ($("#shape"+ signaler[0] + "v" + signaler[1]).hasClass("gridEmpty") || (signaler[0] == receiver[0] && signaler[1] == receiver[1])) {
                        alert("You cannot stop on an empty square or the receiver's position! Please move to an item on the grid.")
                    } else {
                        $("#exptWaitText").hide();
                        $("#exptResultText").html("Sorry, you didn't reach the goal.<br><br>You walked " + step + " steps.<br><br>Good luck on your next trial!");
                        step = 0;
                        $("#exptResultBox").css("display", "inline-block");
                    }
                }
                break;
        }
    }
};

function SHOW_QUIT_RESULT() {
    if(!recorded){
        decision = "quit";
        var currentTime = Date.now();
        decideTime = (currentTime - startTime)/1000;
        recorded = true;
    }
    $("#exptInstr").hide();
    $("#exptResultText").html("No worries! Good luck on your next trial! ");
    $("#exptResultBox").css("display", "inline-block");
};

function RECEIVER_WALK() {
    if(!recorded){
        decision = "say";
        var currentTime = Date.now();
        decideTime = (currentTime - startTime)/1000;
        recorded = true;
    }
    var randDir = Math.floor(Math.random() * 4);
    switch (randDir) {
        case 0: //left
            score--;
            step++;
            $("#score").html(score);
            $("#exptInstr").hide();
            $("#exptWaitText").html("Please watch " + "<img class='shape' src='shape/receiver.png' />" + " walking.");
            if(receiver[1]-1 >= 0){
                if(!receiverMoved ){
                    receiverMoved = true;
                    $("#shape"+ receiver[0] + "v" + receiver[1] + " img").remove();
                    $("#shape"+ receiver[0] + "v" + receiver[1]).attr("class", "gridEmpty");
                }
                REMOVE_PREVIOUS(receiver);
                receiver = [receiver[0], (receiver[1]-1)];
                NEW_POSITION(receiver);
            }
            break;
        case 1: //up
            score--;
            step++;
            $("#score").html(score);
            $("#exptInstr").hide();
            $("#exptWaitText").html("Please watch " + "<img class='shape' src='shape/receiver.png' />" + " walking.");
            if(receiver[0]-1 >= 0){
                if(!receiverMoved ){
                    receiverMoved = true;
                    $("#shape"+ receiver[0] + "v" + receiver[1] + " img").remove();
                    $("#shape"+ receiver[0] + "v" + receiver[1]).attr("class", "gridEmpty");
                }
                REMOVE_PREVIOUS(receiver);                    
                receiver = [(receiver[0]-1), (receiver[1])];
                NEW_POSITION(receiver);
            }
            break;
        case 2: //right
            score--;
            step++;
            $("#score").html(score);
            $("#exptInstr").hide();
            $("#exptWaitText").html("Please watch " + "<img class='shape' src='shape/receiver.png' />" + " walking.");
            if(receiver[1]+1 < GRID_NCOL){
                if(!receiverMoved ){
                    receiverMoved = true;
                    $("#shape"+ receiver[0] + "v" + receiver[1] + " img").remove();
                    $("#shape"+ receiver[0] + "v" + receiver[1]).attr("class", "gridEmpty");
                }
                REMOVE_PREVIOUS(receiver);
                receiver = [receiver[0], (receiver[1]+1)];                    
                NEW_POSITION(receiver);
            }
            break;
        case 3: //down
            score--;
            step++;
            $("#score").html(score);
            $("#exptInstr").hide();
            $("#exptWaitText").html("Please watch " + "<img class='shape' src='shape/receiver.png' />" + " walking.");
            if(receiver[0]+1 < GRID_NROW){
                if(!receiverMoved ){
                    receiverMoved = true;
                    $("#shape"+ receiver[0] + "v" + receiver[1] + " img").remove();
                    $("#shape"+ receiver[0] + "v" + receiver[1]).attr("class", "gridEmpty");
                }
                REMOVE_PREVIOUS(receiver);
                receiver = [(receiver[0]+1), receiver[1]];
                NEW_POSITION(receiver);
            }
            break;
    }
    
    if(receiver[0] == goal[0] && receiver[1] == goal[1]) {
        score = score + 20;
        $("#score").html(score);
        $("#exptWaitText").hide();
        $("#exptResultText").html("Congratulations!<br><br>You reached the goal and received 20 points!<br><br>" + "<img class='shape' src='shape/receiver.png' />" + " walked " + step + " steps.");
        step = 0;
        $("#exptResultBox").show();
    } else if ($("#shape"+ receiver[0] + "v" + receiver[1]).hasClass("gridItem") && (signaler[0] != receiver[0] || signaler[1] != receiver[1])) {
        $("#exptWaitText").hide();
        $("#exptResultText").html("Sorry, you didn't reach the goal.<br><br>" + "<img class='shape' src='shape/receiver.png' />" + " walked " + step + " steps.<br><br>Good luck on your next trial!");
        step = 0;
        $("#exptResultBox").show();
    } else 
        setTimeout(RECEIVER_WALK, RECEIVER_MOVE_SPEED * 1000);
}

function NEXT_TRIAL() {
    $("#exptResultBox").hide();
    trialNum++;
    var currentTime = Date.now();
    finishTime = (currentTime - startTime)/1000;
    POST_DATA(trialNum, decision, decideTime, finishTime);
    recorded = false;
    TRIAL_SET_UP(trialNum);
    CREATE_GRID(trial, GRID_NROW, GRID_NCOL);
    SETUP_RECORD_BOX(goal, score);
    $("#exptInstr").show();
    MOVE();
}