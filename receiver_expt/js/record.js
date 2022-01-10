const FORMAL = true;
const EXPERIMENT_NAME = "recPRorJU";
const SUBJ_NUM_FILE = "subjNum_" + EXPERIMENT_NAME + ".txt";
const VISIT_FILE = "visit_" + EXPERIMENT_NAME + ".txt";
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const SANITY_FILE = "sanity_" + EXPERIMENT_NAME + ".txt";
const TRIAL_FILE = "trial_" + EXPERIMENT_NAME + ".txt";
const UID_FILE = "uid_" + EXPERIMENT_NAME + ".txt";
const VIEWPORT_MIN_W = 1000;
const VIEWPORT_MIN_H = 600;
const SAVING_SCRIPT = 'php/save.php';
const SAVING_DIR = FORMAL ? "data/formal":"data/testing";

function LIST_TO_FORMATTED_STRING(data_list, divider) {
    divider = (divider === undefined) ? ',' : divider;
    var string = '';
    for (var i = 0; i < data_list.length - 1; i++) {
        string += data_list[i] + divider;
    }
    string += data_list[data_list.length - 1] + '\n';
    return string;
}

function FORMAT_DATE(date_obj, time_zone, divider, padded) {
    date_obj = (date_obj === undefined) ? new Date() : date_obj;
    time_zone = (time_zone === undefined) ? 'UTC' : time_zone;
    divider = (divider === undefined) ? '.' : divider;
    padded = (padded === undefined) ? true : padded;
    const NOW_YEAR = (time_zone == 'UTC') ? date_obj.getUTCFullYear() : date_obj.getFullYear();
    var now_month = (time_zone == 'UTC') ? date_obj.getUTCMonth()+1 : date_obj.getMonth()+1;
    var now_date = (time_zone == 'UTC') ? date_obj.getUTCDate() : date_obj.getDate();
    if (padded) {
        now_month = ('0' + now_month).slice(-2);
        now_date = ('0' + now_date).slice(-2);
    }
    var now_full_date = NOW_YEAR + divider + now_month + divider + now_date;
    return now_full_date;
}

function FORMAT_TIME(date_obj, time_zone, divider, padded) {
    date_obj = (date_obj === undefined) ? new Date() : date_obj;
    time_zone = (time_zone === undefined) ? 'UTC' : time_zone;
    divider = (divider === undefined) ? ':' : divider;
    padded = (padded === undefined) ? true : padded;
    var now_hours = (time_zone == 'UTC') ? date_obj.getUTCHours() : date_obj.getHours();
    var now_minutes = (time_zone == 'UTC') ? date_obj.getUTCMinutes() : date_obj.getMinutes();
    var now_seconds = (time_zone == 'UTC') ? date_obj.getUTCSeconds() : date_obj.getSeconds();
    if (padded) {
        now_hours = ('0' + now_hours).slice(-2);
        now_minutes = ('0' + now_minutes).slice(-2);
        now_seconds = ('0' + now_seconds).slice(-2);
    }
    var now_full_time = now_hours + divider + now_minutes + divider + now_seconds;
    return now_full_time;
}

function LIST_FROM_ATTRIBUTE_NAMES(obj, string_list) {
    var list = []
    for (var i = 0; i < string_list.length; i++) {
        list.push(obj[string_list[i]]);
    }
    return list;
}
/*
 ####### #     # ######  #######
 #        #   #  #     #    #
 #         # #   #     #    #
 #####      #    ######     #
 #         # #   #          #
 #        #   #  #          #
 ####### #     # #          #

*/

function RECORD_LIKERT_ANSWER(obj, value){
    //console.log("record called");
    if(obj.isSanityCheck){
        if(!obj.sanityLikertSet){
            const scaleSet = {};
            scaleSet[obj.trialIndex] = value;
            //scaleSet.push(value);
            obj.sanityLikertSet = scaleSet;
            console.log(obj.sanityLikertSet);
        }
        else{
            (obj.sanityLikertSet)[obj.trialIndex]=value;
            console.log(obj.sanityLikertSet);
        }
    }
    else if(obj.isExptTrial){
        console.log(obj.randomizedTrialList[obj.trialIndex]);
        //console.log("expt trial oo");
        if(!obj.exptLikertSet){
            const scaleSet = {};
            scaleSet[obj.randomizedTrialList[obj.trialIndex]] = value;
            //scaleSet.push(value);
            obj.exptLikertSet = scaleSet;
            console.log(obj.exptLikertSet);
        }
        else{
            (obj.exptLikertSet)[obj.randomizedTrialList[obj.trialIndex]] = value;
            console.log(obj.exptLikertSet);
        }
    }
}

function RECORD_CHOSEN_ITEM(obj, item, row, col){
    var chosenItemLog = [item, row, col];
    if(obj.isSanityCheck){
        if(!obj.sanityChosenItemDict){
            var itemDict = {};
            itemDict[obj.trialIndex]=chosenItemLog;
            obj.sanityChosenItemDict = itemDict;
        }
        else{
            (obj.sanityChosenItemDict)[obj.trialIndex]=chosenItemLog; 
        }
        console.log(obj.sanityChosenItemDict);
    }
    else if(obj.isExptTrial){
        if(!obj.exptChosenItemDict){
            var itemDict ={};
            itemDict[obj.randomizedTrialList[obj.trialIndex]] = chosenItemLog;
            obj.exptChosenItemDict = itemDict;
        }
        else{
            (obj.exptChosenItemDict)[obj.randomizedTrialList[obj.trialIndex]] = chosenItemLog;
        }
        console.log(obj.exptChosenItemDict);

    }
    //console.log(item);
}

function RECORD_DECISION_DATA(obj, decision) {
    if(!obj.decisionRecorded){
        obj.decision = decision;
        var currentTime = Date.now();
        obj.decisionTime = (currentTime - obj.startTime)/1000;
        CHECK_CONSECUTIVE_QUICK_DECISION(obj);
        obj.decisionRecorded = true;
    }
}

function CHECK_CONSECUTIVE_QUICK_DECISION(obj) {
    if (obj.decisionTime < FAST_DECISION_TIME)
        obj.consecutiveQuickDecisionNum += 1;
    else
        obj.consecutiveQuickDecisionNum = 0;

    if (obj.consecutiveQuickDecisionNum >= CONSECUTIVE_FAST_DECISION_MAX) {
        alert("You have been making decisions too fast! Please do the future rounds more carefully.")
        obj.responseWarningPopup = true;
    } else
        obj.responseWarningPopup = false;

}

function RECORD_ACTION_TIME(obj) {
    var currentTime = Date.now();
    obj.actionTime = (currentTime - obj.startTime)/1000 - obj.decisionTime;
}

function RECORD_SIGNAL_DATA(obj, signal) {
    if(obj.isExptTrial || obj.isSanityCheck)
        obj.signal = (signal == undefined) ? "N/A" : signal;
}

function RECORD_SIGNALER_PATH(obj) {
    if(obj.isExptTrial || obj.isSanityCheck) {
        if (obj.exptSignalerPath == "N/A")
            obj.exptSignalerPath = "";
        obj.exptSignalerPath += CONVERT_COORD_ARRAY_TO_STR(CONVERT_ARRAY_COORD_TO_CSV_COORD(obj.signalerLocation[0], obj.signalerLocation[1]));
    }
}

function RECORD_RECEIVER_PATH(obj) {
    if(obj.isExptTrial || obj.isSanityCheck) {
        if (obj.exptReceiverPath == "N/A")
            obj.exptReceiverPath = "";
        obj.exptReceiverPath += CONVERT_COORD_ARRAY_TO_STR(CONVERT_ARRAY_COORD_TO_CSV_COORD(obj.receiverLocation[0], obj.receiverLocation[1]));
    }
}

// function FIND_SHAPENAME_FROM_SHAPEPIC (shapePic) {
//     var pictKeyIndex = 0;
//     while(PIC_DICT[Object.keys(PIC_DICT)[pictKeyIndex]] != shapePic ) {
//         pictKeyIndex++;
//     }
//     return Object.keys(PIC_DICT)[pictKeyIndex];
// }

function CONVERT_COORD_ARRAY_TO_STR (array) {
    return "(" + array.toString() + ")";
}

function RECORD_SIGNALER_END_LOCATION(obj, signalerLocation) {
    var startingCoord;
    if(obj.isSanityCheck) {
        startingCoord = obj.inputData[obj.trialIndex]["signalerLocation"];
    } else if(obj.isExptTrial){
        startingCoord = obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["signalerLocation"];
    } else {
        return
    }
    obj.signalerEndCoordinate = (signalerLocation == undefined) ? CONVERT_COORD_ARRAY_TO_STR(startingCoord): CONVERT_COORD_ARRAY_TO_STR(CONVERT_ARRAY_COORD_TO_CSV_COORD(signalerLocation[0], signalerLocation[1]));
    obj.signalerEndItem = (signalerLocation == undefined) ? "noChange": obj.gridArray[signalerLocation[0]][signalerLocation[1]];

}

function RECORD_RECEIVER_END_LOCATION(obj, receiverLocation) {
    var startingCoord;
    if (obj.isSanityCheck) {
        startingCoord = obj.inputData[obj.trialIndex]["receiverLocation"];
    } else if(obj.isExptTrial){
        startingCoord = obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["receiverLocation"];
    } else {
        return
    }
    obj.receiverEndCoordinate = (receiverLocation == undefined) ? CONVERT_COORD_ARRAY_TO_STR(startingCoord): CONVERT_COORD_ARRAY_TO_STR(CONVERT_ARRAY_COORD_TO_CSV_COORD(receiverLocation[0], receiverLocation[1]));
    obj.receiverEndItem = (receiverLocation == undefined) ? "noChange": obj.gridArray[receiverLocation[0]][receiverLocation[1]];
}

function RECORD_SIGNALER_ACHIEVED(obj, achieved) {
    if(obj.isExptTrial || obj.isSanityCheck){
        obj.signalerAchievedGoal = (achieved == undefined) ? false : true;
    }
}

function RECORD_RECEIVER_ACHIEVED(obj, achieved) {
    if(obj.isExptTrial || obj.isSanityCheck){
        obj.receiverAchievedGoal = (achieved == undefined) ? false : true;
    }
}

/*
 ######  ####### ######  ######  ### ####### ####### ### #     #  #####
 #     # #       #     # #     #  #  #       #        #  ##    # #     #
 #     # #       #     # #     #  #  #       #        #  # #   # #
 #     # #####   ######  ######   #  #####   #####    #  #  #  # #  ####
 #     # #       #     # #   #    #  #       #        #  #   # # #     #
 #     # #       #     # #    #   #  #       #        #  #    ## #     #
 ######  ####### ######  #     # ### ####### #       ### #     #  #####

*/

function RECORD_DEBRIEFING_ANSWERS(serious, strategy, problems, rating, motivation) {
    subj.serious = serious;
    subj.strategy = strategy;
    subj.problems = problems;
    subj.rating = rating;
    subj.motivation = motivation;
}

function SAVE_UID(uid, email, totalBonus) {
    var uid = (uid === undefined || uid === null) ? "N/A": uid;
    var email = (email === undefined || email === null) ? "N/A": email;
    var totalBonus = (totalBonus === undefined)? "N/A": totalBonus.toFixed(2);
    var data = LIST_TO_FORMATTED_STRING(["uid", "email", "totalBonus"], ";");
    var dataList = [uid, email, totalBonus];
    data += LIST_TO_FORMATTED_STRING(dataList, ";");
    var postData = {
        'directory_path': SAVING_DIR,
        'file_name': UID_FILE,
        'data': data
    };
    $.ajax({
        type: 'POST',
        url: SAVING_SCRIPT,
        data: postData,
    });
}