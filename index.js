const FORMAL = false;
const EXPERIMENT_NAME = "Signal";
const SUBJ_NUM_FILE = "subjNum_" + EXPERIMENT_NAME + ".txt";
//const TRIAL_FILE = "trial_" + EXPERIMENT_NAME + ".txt";
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const VISIT_FILE = "visit_" + EXPERIMENT_NAME + ".txt";
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const SAVING_DIR = FORMAL ? "data/formal":"data/testing";
const SAVING_SCRIPT = 'save.php';
const VIEWPORT_MIN_W = 1000; 
const VIEWPORT_MIN_H = 600;

const GRID_NROW = 10;
const GRID_NCOL = 9;
const SHAPE_DIR = "shape/";
const RECEIVER_MOVE_SPEED = 0.5;
const TRIAL_NUM = 10;
const PRAC_TRIAL_NUM = 5;
const MAX_SAY_OPTION = 6;
const TRIAL_DICT = {};
const PRAC_TRIAL_DICT = {};
const REWARD = 8;
var qAttemptNum = 0;
var trial;
var score = 0;
var signalerMoved;
var receiverMoved;
var step = 0;
var decision;
var startTime;
var decideTime;
var finishTime;
var recorded = false;
var trialNum = 0;
var isExptTrial = false;
var trialObj = {};
var receiver; //row, col
var signaler;
var goal;
var signalSpace;
var trialList;
var gridString;

// object variables
var instr, subj, trial;

/*
  #####  ####### ####### #     # ######  
 #     # #          #    #     # #     # 
 #       #          #    #     # #     # 
  #####  #####      #    #     # ######  
       # #          #    #     # #       
 #     # #          #    #     # #       
  #####  #######    #     #####  #                                      
*/
const PIC_DICT = {
    "green circle": SHAPE_DIR + "greenCircle.png",
    "green square": SHAPE_DIR + "greenSquare.png",
    "green triangle": SHAPE_DIR + "greenTriangle.png",
    "purple circle": SHAPE_DIR + "purpleCircle.png",
    "purple square": SHAPE_DIR + "purpleSquare.png",
    "purple triangle": SHAPE_DIR + "purpleTriangle.png",
    "red circle": SHAPE_DIR + "redCircle.png",
    "red square": SHAPE_DIR + "redSquare.png",
    "red triangle": SHAPE_DIR + "redTriangle.png",
}

const PRACTICE_STRING_DICT = {
    0: "{(5, 1): 'green circle', (1, 3): 'purple circle', (7, 6): 'red circle'}",
    1: "{(8, 6): 'green square', (6, 8): 'purple circle'}",
    2: "{(0, 5): 'purple square', (6, 9): 'red square', (2, 5): 'green square', (5, 1): 'red circle'}",
    3: "{(7, 6): 'green square', (1, 1): 'purple square'}",
    4: "{(0, 4): 'red square', (7, 3): 'purple triangle', (3, 7): 'green circle', (2, 5): 'red circle', (7, 7): 'red triangle', (3, 1): 'green triangle', (1, 8): 'purple circle', (4, 3): 'green square'}",
}

const TARGET_STRING_DICT = {
    0: "{(3, 8): 'green circle', (8, 3): 'purple circle', (7, 8): 'purple triangle', (1, 1): 'green square', (3, 6): 'red circle'}",
    1: "{(8, 5): 'green triangle', (6, 6): 'purple circle'}",
    2: "{(0, 3): 'purple triangle', (6, 7): 'red square', (2, 4): 'green square', (5, 8): 'red circle'}",
    3: "{(7, 6): 'green triangle', (1, 1): 'purple square'}",
    4: "{(0, 1): 'red square', (7, 3): 'purple square', (3, 2): 'green circle', (1, 5): 'red circle', (7, 6): 'red triangle', (3, 1): 'green triangle', (1, 0): 'purple circle', (5, 3): 'green square'}",
    5: "{(0, 5): 'purple triangle', (4, 3): 'purple square', (5, 0): 'red circle', (2, 9): 'green triangle', (3, 0): 'green square', (1, 0): 'red triangle'}",
    6: "{(8, 9): 'red circle', (7, 5): 'purple square', (1, 6): 'green triangle', (3, 3): 'green square', (2, 2): 'purple circle', (1, 0): 'purple triangle'}",
    7: "{(5, 9): 'red triangle', (4, 2): 'green triangle', (6, 5): 'purple triangle', (5, 3): 'green circle'}",
    8: "{(8, 9): 'purple square', (4, 1): 'red circle', (7, 5): 'red square', (7, 0): 'green circle', (3, 6): 'purple triangle', (4, 9): 'green triangle', (3, 4): 'red triangle', (0, 2): 'purple circle', (8, 4): 'green square'}",
    9: "{(8, 9): 'red square', (2, 3): 'green square', (4, 6): 'purple square', (2, 8): 'red triangle', (4, 4): 'green circle', (4, 1): 'red circle', (7, 7): 'green triangle', (2, 4): 'purple circle'}",
}

const SIGNAL_SPACE_DICT = {
    0: ['red', 'square', 'triangle', 'purple', 'circle', 'green'],
    1: ['circle', 'purple', 'triangle', 'green'],
    2: ['triangle', 'red', 'circle', 'purple', 'green', 'square'],
    3: ['square', 'purple', 'triangle', 'green'],
    4: ['green', 'red', 'square', 'circle', 'purple', 'triangle'],
    5: ['square', 'red', 'purple', 'green', 'triangle', 'circle'],
    6: ['square', 'red', 'purple', 'triangle', 'green', 'circle'],
    7: ['green', 'purple', 'triangle', 'circle', 'red'],
    8: ['square', 'purple', 'triangle', 'circle', 'green', 'red'],
    9: ['circle', 'purple', 'square', 'red', 'triangle', 'green'],
}

const GOAL_DICT = {
    expt0: "purple circle",
    expt1: "purple circle",
    expt2: "red circle",
    expt3: "purple square",
    expt4: "red square",
    expt5: "purple triangle",
    expt6: "green square",
    expt7: "red triangle",
    expt8: "red triangle",
    expt9: "green square",
}


for (var i = 0; i < TRIAL_NUM; i++){
    TRIAL_DICT["expt" + i] = [SIGNAL_SPACE_DICT[i], TARGET_STRING_DICT[i]]
}
for (var i = 0; i < PRAC_TRIAL_NUM; i++){
    PRAC_TRIAL_DICT["prac" + i] = [SIGNAL_SPACE_DICT[i],PRACTICE_STRING_DICT[i]]
}

trialList = CREATE_RANDOM_REPEAT_BEGINNING_LIST(Object.keys(TRIAL_DICT), TRIAL_NUM).slice(0, TRIAL_NUM)

/*
 ######  #######    #    ######  #     # 
 #     # #         # #   #     #  #   #  
 #     # #        #   #  #     #   # #   
 ######  #####   #     # #     #    #    
 #   #   #       ####### #     #    #    
 #    #  #       #     # #     #    #    
 #     # ####### #     # ######     #    
                                         
*/

$(document).ready(function() {
    subj = new subjObject(subj_options); // getting subject number
    //subj.id = subj.getID("sonacode");
    subj.saveVisit();
    if (subj.phone) { // asking for subj.phone will detect phone
        $("#instrText").html('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at experimenter@domain.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
        $("#instrBut").hide();
        $("#instrPage").show();
    //} else if (subj.id !== null){
    } else {
        instr = new instrObject(instr_options);
        instr.start();
        //trial_options["subj"] = subj;
        //trial = new trialObject(trial_options);
        //$('#captchaBox').show();
    }
});

/*
  #####  #     # ######        # #######  #####  ####### 
 #     # #     # #     #       # #       #     #    #    
 #       #     # #     #       # #       #          #    
  #####  #     # ######        # #####   #          #    
       # #     # #     # #     # #       #          #    
 #     # #     # #     # #     # #       #     #    #    
  #####   #####  ######   #####  #######  #####     #    
                                                         
*/

const SUBJ_TITLES = ['num',
                     'date',
                     'startTime',
                     //'id',
                     'userAgent',
                     'endTime',
                     'duration',
                     'instrQAttemptN',
                     'instrReadingTimes',
                     'quickReadingPageN',
                     'hiddenCount',
                     'hiddenDurations',
                     'daily',
                     'aqResponses',
                     'aqRt',
                     'serious',
                     'problems',
                     'gender',
                     'age',
                     'inView',
                     'viewportW',
                     'viewportH'
                    ];

function INVALID_ID_FUNC() {
    $("#instrText").html("We can't identify a valid code from subject pool website. Please reopen the study from the subject pool website again. Thank you!");
    $("#instrBut").hide();
    $("#instrPage").show();
}
function HANDLE_VISIBILITY_CHANGE() {
    if (document.hidden) {
        subj.hiddenCount += 1;
        subj.hiddenStartTime = Date.now();
    } else  {
        subj.hiddenDurations.push((Date.now() - subj.hiddenStartTime)/1000);
    }
}
var subj_options = {
    subjNumFile: SUBJ_NUM_FILE,
    titles: SUBJ_TITLES,
    invalidIDFunc: INVALID_ID_FUNC,
    viewportMinW: VIEWPORT_MIN_W,
    viewportMinH: VIEWPORT_MIN_H,
    savingScript: SAVING_SCRIPT,
    visitFile: VISIT_FILE,
    attritionFile: ATTRITION_FILE,
    subjFile: SUBJ_FILE,
    savingDir: SAVING_DIR,
    handleVisibilityChange: HANDLE_VISIBILITY_CHANGE
};

/*                              
 # #    #  ####  ##### #####  
 # ##   # #        #   #    # 
 # # #  #  ####    #   #    # 
 # #  # #      #   #   #####  
 # #   ## #    #   #   #   #  
 # #    #  ####    #   #    # 
*/
var instr_text = new Array;
instr_text[0] = "<strong>Welcome to this experiment!</strong><br><br>This experiment studies human cooperation."
instr_text[1] = "Please carefully read the instructions on the next few pages. There will be a question that asks you about the instructions later and a couple of practice trials."
instr_text[2] = "In each trial, you will see a grid with items in some of the locations. You are the agent in blue " + "<img class='inlineShape' src='shape/signaler.png'/>" + " and your teammate is in white " + "<img class='inlineShape' src='shape/receiver.png' />" + " . You are collaborating to reach one of the items, a target item, which you and your partner will receive points for reaching."
instr_text[3] = "You and your partner will take turns, working together to reach this item. You will be given information on what the target item is for each round. Your partner does not have this information, it is only you who knows the target."
instr_text[4] = "You have the option to <br>1. send one of the given signals which can give partial information about the target, <br>2. move to the target yourself, <br>or 3. quit or give up on the current trial and move to the next one."
instr_text[5] = "Once you choose an option, it is your partner’s turn. <br><br>The trial ends after each agent has had a turn to act, someone has reached the true target, or the “Quit” option has been selected. <br><br>If either person successfully reaches the goal, both collaborators receive +8 points, otherwise neither receives any points. <br><br>Each step you or your partner takes costs -1 point. Signaling is free, but you are only allowed to choose one signal. Quitting also incurs no cost."
instr_text[6] = "By clicking on the CONTINUE button, I am acknowledged and hereby accept the terms."
instr_text[7] = "";


const INSTR_FUNC_DICT = {
    2: SHOW_EXAMPLE_GRID,
    3: SHOW_EXAMPLE_GOAL,
    4: SHOW_EXAMPLE_ACTION,
    5: HIDE_EXAMPLE, 
    6: SHOW_CONSENT,
    7: START_PRACTICE_TRIAL,
};

function SHOW_CONSENT() {
    $("#consent").show();
    $("#instrBut").text("CONTINUE");
    $("#instrText").css("margin-top", "50px");
    $("#instrText").css("margin-bottom", "50px");
}

function HIDE_CONSENT() {
    $("#consent").hide();
    $("#instrBut").text("NEXT");
    $("#instrText").css("margin-top", "100px");
    $("#instrText").css("margin-bottom", "60px");
}

function SHOW_EXAMPLE_GRID() {
    $("#examGrid").show();
}

function SHOW_EXAMPLE_GOAL() {
    $("#examGrid").attr("src", "examplePic/examGoal.png");
}

function SHOW_EXAMPLE_ACTION() {
    $("#examGrid").attr("src", "examplePic/examAction.png");
}

function HIDE_EXAMPLE() {
    $("#examGrid").hide();
}

function START_PRACTICE_TRIAL() {
    $("#instrPage").hide();
    TRIAL_SET_UP(trialNum);
    CREATE_GRID(trial, GRID_NROW, GRID_NCOL);
    SETUP_RECORD_BOX(goal, score);
    $("#exptPage").show();
    MOVE();
}

var instr_options = {
    text: instr_text,
    funcDict: INSTR_FUNC_DICT,
    qConditions: ['onlyQ'],
};

function SHOW_INSTR_QUESTION() {
    $("#exptPage").hide();
    $("#instrBut").hide();
    $("#instrQBox").show();
    $("#instrPage").show();
}

function SUBMIT_INSTR_Q() {
    var instrChoice = $("input[name='instrQ']:checked").val();
    if (typeof instrChoice === "undefined") {
        $("#instrQWarning").text("Please answer the question. Thank you!");
    } else if (instrChoice == "several") {
        qAttemptNum++;
        $("#instrQWarning").text("Correct! Please click on NEXT to start the first round!");
        $("#instrQBut").hide();
        $("#startExptBut").show();
    } else {
        qAttemptNum++;
        $("#instrQWarning").text("You have given an incorrect answer. Please try again.");
    }
}
/*
 ####### ######  ###    #    #       
    #    #     #  #    # #   #       
    #    #     #  #   #   #  #       
    #    ######   #  #     # #       
    #    #   #    #  ####### #       
    #    #    #   #  #     # #       
    #    #     # ### #     # ####### 
                                     
*/
const TRIAL_TITLES = [
    "num",
    "date",
    "subjStartTime",
    "trialNum",
    "expt",
    "decision",
    "decideTime",
    "finishTime",
    "inView",
    "rt"];

function SHOW_BLOCK() {
    $("#instrPage").hide();
    $("#expBut").hide();
    $("#trialPage").show();
    subj.detectVisibilityStart();
    trial.run();
}

function TRIAL_UPDATE(last, this_trial, next_trial, path) {
    trial.stimName = EXPT_TRIAL[this_trial][2][0];
    trial.facingDir = EXPT_TRIAL[this_trial][2][1];
    trial.background = EXPT_TRIAL[this_trial][3];
    
    $("#testFrame").css("background-image", "url(" + path + EXPT_TRIAL[this_trial][1]+")");
    $("#testImg").attr("src", path + EXPT_TRIAL[this_trial][0]);
    $("#testImg").css("left", STIM_LEFT + "px");
    if (!last) {
        $("#bufferImg").attr("src", path + EXPT_TRIAL[next_trial][0]);
        $("#bufferFrame").css("background-image", "url("+path + EXPT_TRIAL[next_trial][1]+")");
    }
}

function TRIAL() {
    $("#testFrame").show();
    trial.inView = CHECK_FULLY_IN_VIEW($("#testImg"));
}

function END_TRIAL() {
    $("#testFrame").hide();
    $("#expBut").hide();
    trial.end();
}

function END_EXPT() {
    $("#trialPage").hide();
    trial.save();
    $("#aqBox").css("display", "block");
    $(document).keyup(function(e) {
        if (e.which == 32) { // the 'space' key
            $(document).off("keyup");
            START_AQ();
        }
    });
}

var trial_options = {
    subj: 'pre-define', // assign after subj is created
    trialN: TRIAL_N,
    titles: TRIAL_TITLES,
    stimPath: STIM_PATH,
    dataFile: TRIAL_FILE,
    savingScript: SAVING_SCRIPT,
    savingDir: SAVING_DIR,
    trialList: TRIAL_LIST,
    intertrialInterval: INTERTRIAL_INTERVAL,
    updateFunc: TRIAL_UPDATE,
    trialFunc: TRIAL,
    endExptFunc: END_EXPT
}
/*
                            
 ###### #    # #####  ##### 
 #       #  #  #    #   #   
 #####    ##   #    #   #   
 #        ##   #####    #   
 #       #  #  #        #   
 ###### #    # #        #   
                            
*/
function START_EXPT(){
    $("#instrPage").hide();
    isExptTrial = true;
    trialNum = 0;
    score = 0;
    TRIAL_SET_UP(trialNum);
    CREATE_GRID(trial, GRID_NROW, GRID_NCOL);
    SETUP_RECORD_BOX(goal, score);
    MOVE();
    startTime = Date.now();
    $("#exptInstr").show();
    $("#exptPage").show();
}

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
                $("#exptWaitText").show();
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
                $("#exptWaitText").show();
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
                $("#exptWaitText").show();
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
                $("#exptWaitText").show();
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
                        score = score + REWARD;
                        $("#score").html(score);
                        $("#exptWaitText").hide();
                        $("#exptResultText").html("Congratulations!<br><br>You reached the goal and received +8 points!<br><br>You walked " + step + " steps.");
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
    $("#exptResultText").html("No worries! Good luck on your next trial!");
    $("#exptResultBox").css("display", "inline-block");
};

function RECEIVER_WALK(option) {
    if(!recorded){
        console.log(option);
        decision = $("#" + option).text();
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
            $("#exptWaitText").show();
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
            $("#exptWaitText").show();
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
            $("#exptWaitText").show();
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
            $("#exptWaitText").show();
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
        score = score + REWARD;
        $("#score").html(score);
        $("#exptWaitText").hide();
        $("#exptResultText").html("Congratulations!<br><br>You reached the goal and received +8 points!<br><br>" + "<img class='shape' src='shape/receiver.png' />" + " walked " + step + " steps.");
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
    var currentTime = Date.now();
    finishTime = (currentTime - startTime)/1000;

    var postData = "qAttemptNum,trialNum,expt,decision,decideTime,finishTime\n";
    postData += qAttemptNum + "," + trialNum + "," + trialList[trialNum] + "," + decision + "," + decideTime + "," + finishTime + "\n";
    trialObj.postData = postData;
    if(isExptTrial) {
        POST_DATA(trialObj, SUCCESS, ERROR);
        console.log(postData);
    }
        

    trialNum++;
    if(!isExptTrial && trialNum == PRAC_TRIAL_NUM) {
        SHOW_INSTR_QUESTION();
    } else if (isExptTrial && trialNum == TRIAL_NUM){
        $("#exptPage").hide();
        $("#thankPage").show();
    } else {
        recorded = false;
        TRIAL_SET_UP(trialNum);
        CREATE_GRID(trial, GRID_NROW, GRID_NCOL);
        SETUP_RECORD_BOX(goal, score);
        $("#exptInstr").show();
        startTime = Date.now();
        MOVE();
    }
   
}