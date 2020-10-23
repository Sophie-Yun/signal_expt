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

var instrTry;
//var tryScore = 0;
var chooseSay = false;
var allowMove = false;
var allowWalk = false;

var qAttemptNum = 0;
var trial;
var score = 0;
var reward;
//var step = 0;
var signalerMoved;
var receiverMoved;
var decision;
var startTime;
var decideTime;
var finishTime;
var recorded = false;
var trialNum = 0;
var isExptTrial = false;
var trialObj = {};
var receiver = [2, 4]; //row, col
var signaler = [9, 4];
var goal;
var signalSpace;
var trialList;
var gridString;
var pathNum = 0;
var path;

// object variables
var instr, subj, trial, tryTrial;

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
        tryTrial = new trialObject(trial_options);
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
instr_text[0] = "<strong>Welcome to this experiment!</strong><br><br>In this experiment, you will play a game that involves cooperation with one other agent. The goal is for you to reach a target item. <br><br>Hope you enjoy it!"
instr_text[1] = "Please carefully read the instructions on the next few pages. There will be a question that asks you about the instructions later and a couple of practice trials."
instr_text[2] = "In this experiment, you are the agent in blue " + "<img class='inlineShape' src='shape/signaler.png'/>" + " and your partner is in white " + "<img class='inlineShape' src='shape/receiver.png' />" + " ."
instr_text[3] = "At the beginning of each round, you and your partner will stand at different positions in a game board. <br><br>You will also see items in some of the grids."
instr_text[4] = "Besides the game board, you will also see the target for this round. For example, \"Target: <img class='inlineShape' src='shape/redCircle.png'/> \". The target will be different for each round. <br><br>If either you or your partner successfully reach the target at the end of one round, both of you will receive 8 points as reward."
instr_text[5] = "To reach the target, you can choose to move by yourself. <br><br>You can move from grid to grid by taking steps to your left, right, top, or bottom. Each step will cost you one point. You cannot move diagonally. You cannot move outside the grid. <br><br>You can try to move by yourself on the next page."
instr_text[6] = "";
instr_text[7] = "Good job! Now that you know how to move by yourself!<br><br>If you don't want to move, you can ask your partner to move. <br><br>However, you are the only person that knows the target for each round. Your partner does not know the target. <br><br>You have the option to send one of the given signals to your partner. The signal can give partial information about the target."
instr_text[8] = "After you send the signal, your partner will try its best to reach the target given the information you provided. <br><br>Each step that your partner takes will also cost one point. <br><br>You can try to send a signal on the next page."
instr_text[9] = "";
instr_text[10] = "Nice! Now that you know how to send a signal to your partner.<br><br>If you decide that it is too costly for either of you to move towards the target. You have the option to QUIT this round. Neither of you will lose or receive point if you choose to quit. ";
//instr_text[9] = "There will be one question on the next page to make sure you understand the task.";

instr_text[11] = "By clicking on the CONTINUE button, I am acknowledged and hereby accept the terms.<br><br>The practice rounds will start on the next page.";
instr_text[12] = "";
instr_text[13] = "";

const INSTR_FUNC_DICT = {
    0: HIDE_BACK_BUTTON,
    1: SHOW_BACK_BUTTON,
    2: HIDE_EXAMPLE_GRID,
    3: SHOW_EXAMPLE_GRID,
    4: HIDE_EXAMPLE_GRID,
    5: SHOW_INSTR, 
    6: TRY_MOVE,
    7: SHOW_INSTR,
    9: TRY_SAY,
    11: SHOW_CONSENT,
    12: SHOW_INSTR_QUESTION,
    13: START_PRACTICE_TRIAL,
    /*
    2: SHOW_EXAMPLE_GRID,
    3: SHOW_EXAMPLE_GOAL,
    4: SHOW_EXAMPLE_ACTION,
    5: HIDE_EXAMPLE, 
    6: SHOW_CONSENT,
    7: START_PRACTICE_TRIAL,*/
};

function HIDE_BACK_BUTTON(){
    $("#instrBackBut").hide();
}

function SHOW_BACK_BUTTON(){
    $("#instrBackBut").show();
}

function SHOW_EXAMPLE_GRID() {
    $("#examGrid").css("display", "block");
}

function HIDE_EXAMPLE_GRID() {
    $("#examGrid").hide();
}

function SHOW_INSTR() {
    $("#instrText").show();
    $("#instrNextBut").show();
    $("#instrBackBut").css("position", "absolute");
    $("#exptPage").hide();

    //reset TRY_MOVE()
    if(signaler[0] != 9 || signaler[1] != 4){
        REMOVE_PREVIOUS(signaler);
        signaler = [9, 4];//row, col
        NEW_POSITION(signaler);
    }
    tryTrial.step = 0;
    EXPT_INSTR_APPEAR();
    $("#decision").html("");
    $("#result").hide();
}

function TRY_MOVE() {
    instrTry = true;
    //$("#instrText").hide();
    if(!tryTrial.reached)
        $("#instrNextBut").hide();
    //$("#instrBackBut").css({"position": "absolute", "top": "600px"});
    if(!tryTrial.gridCreated) {
        tryTrial.grid = [
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,PIC_DICT["red circle"],],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,]
        ];
        tryTrial.grid[receiver[0]][receiver[1]] = SHAPE_DIR + "receiver.png";
        tryTrial.grid[signaler[0]][signaler[1]] = SHAPE_DIR + "signaler.png";
        goal=[3,7];
        CREATE_GRID(tryTrial.grid, GRID_NROW, GRID_NCOL);
        tryTrial.gridCreated = true;
    }

    $(".step").html(tryTrial.step);
    $("#goalShape").attr("src", PIC_DICT["red circle"]);
    $("#score").html(tryTrial.totalScore);
    allowMove = true;
    tryTrial.move();
    $("#say").hide();
    $("#quit").hide();
    $("#exptPage").show();
}


function TRY_SAY(){
    instrTry = true;
    //$("#instrText").hide();
    //if(!tryTrial.reached)
        $("#instrNextBut").hide();
    //$("#instrBackBut").css({"position": "absolute", "top": "600px"});

    CREATE_SAY_OPTIONS(tryTrial);
    var trySayOption = ["red", "circle", "green"];
    for (var i = 0; i < 6; i++) {
        $("#butOption" + i).css({"border": "1px solid", 
            "background": "#bcbab8", 
            "cursor": "auto",
            "box-shadow": "none"
            });
        
        for (var j = 0; j < trySayOption.length; j++) {
            if (trySayOption[j] == $("#butOption" + i).html()) {
                $("#butOption" + i).css({"border": "2px solid #625757", 
                                "background": "#9D8F8F", 
                                "box-shadow": "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                "pointer-events": "auto",
                                "cursor": "pointer"
                                });
            }
        }
    }

    if(!tryTrial.gridSayCreated) {
        $(".gridItem").remove();
        $(".gridEmpty").remove();
        tryTrial.grid = [
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,PIC_DICT["red circle"],],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,,,,],
            [,,,,,PIC_DICT["green circle"],,,],
            [,,,,,,,,]
        ];
        tryTrial.grid[receiver[0]][receiver[1]] = SHAPE_DIR + "receiver.png";
        tryTrial.grid[signaler[0]][signaler[1]] = SHAPE_DIR + "signaler.png";
        goal=[3,7];
        CREATE_GRID(tryTrial.grid, GRID_NROW, GRID_NCOL);
        tryTrial.gridSayCreated = true;
    }

    $(".step").html(tryTrial.step);
    $("#goalShape").attr("src", PIC_DICT["red circle"]);
    $("#score").html(tryTrial.totalScore);
    allowMove = false;
    $("#say").show();
    $("#do").hide();
    $("#quit").hide();
    $("#exptPage").show();
}


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

function SHOW_EXAMPLE_SIGNAL() {
    $("#examGrid").show();
    $("#examGrid").attr("src", "examplePic/exampleSignal.jpg");
}

function SHOW_EXAMPLE_ACTION() {
    
    $("#examGrid").attr("src", "examplePic/examAction.png");
}

function START_PRACTICE_TRIAL() {
    $("#instrPage").hide();
    TRIAL_SET_UP(trialNum);
    CREATE_GRID(trial, GRID_NROW, GRID_NCOL);
    SETUP_RECORD_BOX(goal, score);
    $("#exptPage").show();
    //MOVE();
}

var instr_options = {
    text: instr_text,
    funcDict: INSTR_FUNC_DICT,
    qConditions: ['onlyQ'],
};

function SHOW_INSTR_QUESTION() {
    $("#instrQBox").show();
    $("#instrPage").show();
}

function SUBMIT_INSTR_Q() {
    var instrChoice = $("input[name='instrQ']:checked").val();
    if (typeof instrChoice === "undefined") {
        $("#instrQWarning").text("Please answer the question. Thank you!");
    } else if (instrChoice == "several") {
        qAttemptNum++;
        $("#instrQWarning").text("Correct! Please click on NEXT to start the practice trial!");
        $("#instrQBox").hide();
        $("#consent").show();
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
    //trialN: TRIAL_N,
    titles: TRIAL_TITLES,
    //stimPath: STIM_PATH,
    //dataFile: TRIAL_FILE,
    savingScript: SAVING_SCRIPT,
    savingDir: SAVING_DIR,
    //trialList: TRIAL_LIST,
    //intertrialInterval: INTERTRIAL_INTERVAL,
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
    isExptTrial = true;
    trialNum = 0;
    score = 0;
    step = 0;
    $("#round").html(trialNum+1);
    $(".step").html(step);
    TRIAL_SET_UP(trialNum);
    CREATE_GRID(trial, GRID_NROW, GRID_NCOL);
    SETUP_RECORD_BOX(goal, score);
    //MOVE();
    startTime = Date.now();
    $("#exptInstr").show();
    $("#exptPage").show();
}

function EXPT_INSTR_FADE() {
    $("#exptFade").fadeTo(200, 0.4);
    $(".butExpt").css("box-shadow", "none");
    $(".butExpt").css("cursor", "default");
    $('.butExpt').prop('disabled', true);
}

function EXPT_INSTR_APPEAR() {
    $("#exptFade").css("opacity", 1);
    $(".butExpt").css("box-shadow", "0px 4px 4px rgba(0, 0, 0, 0.25)");
    $(".butExpt").css("cursor", "pointer");
    $('.butExpt').prop('disabled', false);
}

function SHOW_QUIT_RESULT() {
    if(!recorded){
        EXPT_INSTR_FADE();
        decision = "quit";
        var currentTime = Date.now();
        decideTime = (currentTime - startTime)/1000;
        recorded = true;
    }
    reward = 0;
    $("#resultText").html("Don't worry!<br>Good luck on your next round!");
    $("#reward").html(reward);
    $("#scoreThisRound").html(reward - step);
    $("#totalAfter").html(score);
    $("#result").show();
};

function NEXT_TRIAL() {
    if(instrTry){
        $("#exptPage").hide();
        tryTrial.reached = true;
        instr.next();
        $("#instrText").show();
        $("#instrNextBut").show();
        $("#instrBackBut").css("position", "absolute");
    } else {
    $("#decision").html('');
    $("#result").hide();
    EXPT_INSTR_APPEAR();
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
    step = 0;
    $("#round").html(trialNum+1);
    $(".step").html(step);
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
        //MOVE();
    }
    }
   
}