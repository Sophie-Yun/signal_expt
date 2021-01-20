var textString;
var lines, linesArray;
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

var chooseSay = false;
var allowWalk = false;

var qAttemptNum = 0;
var trial;
var reward;
var signalerMoved;
var receiverMoved;
var decision;
var startTime;
var decideTime;
var finishTime;
var trialNum = 0;
var trialObj = {};
var receiver = [2, 4]; //row, col
var signaler = [9, 4];
var goal;
var signalSpace;
var randomizedTrialKeyList;
var pathNum = 0;
var path;

// object variables
var instr, subj, tryMove, trySay, practice, expt;

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
/*
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
}*/


function PARSE_CSV(csvString) {
    var lines = csvString.split(/\r?\n/)
    var linesArray = [];

    for (i = 1; i < lines.length - 1; i++) {
        linesArray[i - 1] = {};

        tmp = lines[i].match(/\(\d, \d\)/g)[0];
        linesArray[i - 1]["signalerLocation"] = [parseInt(tmp.substring(1, 2)), parseInt(tmp.substring(4, 5))];

        tmp = lines[i].match(/\(\d, \d\)/g)[1];
        linesArray[i - 1]["receiverLocation"] = [parseInt(tmp.substring(1)), parseInt(tmp.substring(4))];

        linesArray[i - 1]["intention"] = lines[i].match(/\w+ \w+/)[0];

        linesArray[i - 1]["signalSpace"] = [];
        signalSpaceEntireEntry = lines[i].match(/\[(.*?)\]/)[1];
        tmp = signalSpaceEntireEntry.match(/'\w+'/g);
        for (j = 0; j < tmp.length; j++) {
            tmp[j] = tmp[j].substring(1, tmp[j].length - 1);
            linesArray[i - 1]["signalSpace"][j] = tmp[j];
        }

        linesArray[i - 1]["targetDictionary"] = {};
        tmp = lines[i].match(/\(\d, \d\): '\w+ \w+'/g);
        for (j = 0; j < tmp.length; j++) {
            tmpCoordinate = tmp[j].match(/\(\d, \d\)/)[0];
            coordinate = [parseInt(tmpCoordinate.substring(1, 2)), parseInt(tmpCoordinate.substring(4, 5))];
            item = tmp[j].match(/\w+ \w+/)[0];
            linesArray[i - 1]["targetDictionary"][coordinate] = item;
        }

        linesArray[i - 1]["nTargets"] = parseInt(lines[i].match(/,\d,/)[0].substring(1, 2));

        linesArray[i - 1]["receiverIntentionDict"] = {};
        tmp = lines[i].match(/'\w+': '\w+ \w+'/g);
        for (j = 0; j < tmp.length; j++) {
            signal = tmp[j].match(/'\w+'/)[0];
            intention = tmp[j].match(/'\w+ \w+'/)[0];
            linesArray[i - 1]["receiverIntentionDict"][signal.substring(1, signal.length - 1)] = intention.substring(1, intention.length - 1);
        }
    }
    return linesArray;
}


/*
for (var i = 0; i < TRIAL_NUM; i++){
    TRIAL_DICT["expt" + i] = [SIGNAL_SPACE_DICT[i], TARGET_STRING_DICT[i]]
}
for (var i = 0; i < PRAC_TRIAL_NUM; i++){
    PRAC_TRIAL_DICT["prac" + i] = [SIGNAL_SPACE_DICT[i],PRACTICE_STRING_DICT[i]]
}

randomizedTrialKeyList = CREATE_RANDOM_REPEAT_BEGINNING_LIST(Object.keys(TRIAL_DICT), TRIAL_NUM).slice(0, TRIAL_NUM)*/

/*
 ######  #######    #    ######  #     # 
 #     # #         # #   #     #  #   #  
 #     # #        #   #  #     #   # #   
 ######  #####   #     # #     #    #    
 #   #   #       ####### #     #    #    
 #    #  #       #     # #     #    #    
 #     # ####### #     # ######     #    
                                         
*/
function add(x) {
    var y;
    y = "haha";
    return y;
}

$(document).ready(function() {
    subj = new subjObject(subj_options); // getting subject number
    //subj.id = subj.getID("sonacode");
    subj.saveVisit();
    if (subj.phone) { // asking for subj.phone will detect phone
        BLOCK_MOBILE();
    //} else if (subj.id !== null){
    } else {
        //fetches CSV from file into a string
        fetch("exampleTrials_withReceiverIntentionDict.csv")
            .then(response => response.text())
            .then(textString => {
                PRACTICE_INPUT_DATA = PARSE_CSV(textString)
            })
            .then( () => {
            instr = new instrObject(instr_options);
            tryMove = new trialObject(trial_options);
            trySay = new trialObject(trial_options);
            practice = new trialObject(practice_trial_options);
            expt = new trialObject(trial_options);
            practice.inputData = PRACTICE_INPUT_DATA,
            expt.inputData = PRACTICE_INPUT_DATA,
            instr.start();
            DISABLE_DEFAULT_KEYS();});
        //trial_options["subj"] = subj;
        //trial = new trialObject(trial_options);
        //$('#captchaBox').show();
    }
});


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
    "subjId",
    "trialIndex",
    "exptId",
    "decision",
    "decideTime",
    "endLocation",
    "finishTime"];
    
var practice_trial_options = {
    subj: 'pre-define', // assign after subj is created
    //trialN: TRIAL_N,
    titles: TRIAL_TITLES,
    //stimPath: STIM_PATH,
    //dataFile: TRIAL_FILE,
    savingScript: SAVING_SCRIPT,
    savingDir: SAVING_DIR,
    //updateFunc: TRIAL_UPDATE,
    //trialFunc: TRIAL,
    //endExptFunc: END_EXPT
}
var trial_options = {
    subj: 'pre-define', // assign after subj is created
    //trialN: TRIAL_N,
    titles: TRIAL_TITLES,
    //stimPath: STIM_PATH,
    //dataFile: TRIAL_FILE,
    savingScript: SAVING_SCRIPT,
    savingDir: SAVING_DIR,
    //updateFunc: TRIAL_UPDATE,
    //trialFunc: TRIAL,
    //endExptFunc: END_EXPT
}


function SHOW_BLOCK() {
    $("#instrPage").hide();
    $("#expBut").hide();
    $("#trialPage").show();
    subj.detectVisibilityStart();
    //trial.run();
}
/*
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
}*/
/*
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
}*/

