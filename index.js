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
var startTime;
var trialNum = 0;
var trialObj = {};
var goal;
var signalSpace;
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

function SHUFFLE_ARRAY(array) {
    var j, temp;
    for (var i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function CREATE_RANDOM_LIST_FOR_EXPT(obj) {
    obj.randomizedTrialList = SHUFFLE_ARRAY(Object.keys(obj.inputData));
}


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
        BLOCK_MOBILE();
    //} else if (subj.id !== null){
    } else {
        //fetches CSV from file into a string
        fetch("exampleTrials_Set2_20210201.csv")
            .then(response => response.text())
            .then(textString => {
                PRACTICE_INPUT_DATA = PARSE_CSV(textString)
            })
            .then( () => {fetch("exampleTrials_Set1_20210201.csv")
                .then(response => response.text())
                .then(textString => {
                    EXPT_INPUT_DATA = PARSE_CSV(textString)
                })
                .then (()=> {
                    instr = new instrObject(instr_options);
                    tryMove = new trialObject(trial_options);
                    trySay = new trialObject(trial_options);
                    practice = new trialObject(practice_trial_options);
                    practice.inputData = PRACTICE_INPUT_DATA;
                    expt = new trialObject(trial_options);
                    expt.inputData = EXPT_INPUT_DATA;
                    instr.start();
                    console.log(practice.inputData);       
                    console.log(expt.inputData);           
                    DISABLE_DEFAULT_KEYS();
                    });
                });
        
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
    "signal",
    "signalerPath",
    "signalerEndCoordinate",
    "signalerEndItem",
    "receiverEndCoordinate",
    "receiverEndItem",
    "signalerAchievedGoal", 
    "receiverAchievedGoal", 
    "totalUtility", 
    "decisionTime", 
    "actionTime", 
    "feedbackTime"];
    
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
}

