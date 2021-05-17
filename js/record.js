
/*
 ####### #     # ######  #######
 #        #   #  #     #    #
 #         # #   #     #    #
 #####      #    ######     #
 #         # #   #          #
 #        #   #  #          #
 ####### #     # #          #

*/

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
    if (obj.decisionTime < 1)
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
    if(obj.isExptTrial)
        obj.signal = (signal == undefined) ? "N/A" : signal;
}

function RECORD_SIGNALER_PATH(obj) {
    if(obj.isExptTrial) {
        if (obj.exptSignalerPath == "N/A")
            obj.exptSignalerPath = "";
        obj.exptSignalerPath += CONVERT_COORD_ARRAY_TO_STR(CONVERT_ARRAY_COORD_TO_CSV_COORD(obj.signalerLocation[0], obj.signalerLocation[1]));
    }
}

function RECORD_RECEIVER_PATH(obj) {
    if(obj.isExptTrial) {
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
    if(obj.isExptTrial){
        var startingCoord = obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["signalerLocation"];
        obj.signalerEndCoordinate = (signalerLocation == undefined) ? CONVERT_COORD_ARRAY_TO_STR(startingCoord): CONVERT_COORD_ARRAY_TO_STR(CONVERT_ARRAY_COORD_TO_CSV_COORD(signalerLocation[0], signalerLocation[1]));
        //obj.signalerEndItem = (signalerLocation == undefined) ? "noChange": FIND_SHAPENAME_FROM_SHAPEPIC (obj.gridArray[signalerLocation[0]][signalerLocation[1]]);
        obj.signalerEndItem = (signalerLocation == undefined) ? "noChange": obj.gridArray[signalerLocation[0]][signalerLocation[1]];
    }
}

function RECORD_RECEIVER_END_LOCATION(obj, receiverLocation) {
    if(obj.isExptTrial){
        var startingCoord = obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["receiverLocation"];
        obj.receiverEndCoordinate = (receiverLocation == undefined) ? CONVERT_COORD_ARRAY_TO_STR(startingCoord): CONVERT_COORD_ARRAY_TO_STR(CONVERT_ARRAY_COORD_TO_CSV_COORD(receiverLocation[0], receiverLocation[1]));
        //obj.receiverEndItem = (receiverLocation == undefined) ? "noChange": FIND_SHAPENAME_FROM_SHAPEPIC (obj.gridArray[receiverLocation[0]][receiverLocation[1]]);
        obj.receiverEndItem = (receiverLocation == undefined) ? "noChange": obj.gridArray[receiverLocation[0]][receiverLocation[1]];
    }
}

function RECORD_SIGNALER_ACHIEVED(obj, achieved) {
    if(obj.isExptTrial){
        obj.signalerAchievedGoal = (achieved == undefined) ? false : true;
    }
}

function RECORD_RECEIVER_ACHIEVED(obj, achieved) {
    if(obj.isExptTrial){
        obj.receiverAchievedGoal = (achieved == undefined) ? false : true;
    }
}