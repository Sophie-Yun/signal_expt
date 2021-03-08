class trialObject {
    constructor(options = {}) {
        Object.assign(this, {
            subj: false,
            step: 0,
            totalScore: 0,
            gridCreated: false,
            reached: false,
            allowMove: false,
            pathIndex: 0,
            trialN: 0,
            titles: '',
            stimPath: 'Stimuli/',
            dataFile: 'exptData.txt',
            savingScript: 'save.php',
            savingDir: 'data/testing',
            updateFunc: false,
            trialFunc: false,
            endExptFunc: false,
            isTryMove:false,
            isTrySay: false,
            isSanityCheck: false,
            isPracTrial: false,
            isExptTrial: false,
            startTime: 0,
            signal: "N/A",
            gridArray: [
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
            ]
        }, options);
        this.subjID = this.subj.num;
        this.subjStartTime = this.subj.startTime;
        this.trialIndex = 0;
        this.decisionRecorded = false;
        this.exptDataToSave = LIST_TO_FORMATTED_STRING(this.titles);
        this.complete = false;
        this.receiverPath = { "red": ["right","right","right","down"],
                            "green": ["right","down","down","down","down","down","down"],
                        "circle": ["right","right","right","down"]};

        this.receiverPathNum = 0;

        // for sanity check
        this.sanityMoveFails = 0;
        this.sanitySayFails = 0;
        this.sanityQuitFails = 0;

        this.sanityMoveAttempts = 0;
        this.sanitySayAttempts = 0;
        this.sanityQuitAttempts = 0;
    }
    
    next(){
        if(this.isTryMove || this.isTrySay) {
            this.trialIndex++;
            if(this.trialIndex >= this.trialN) {
                this.end();
            } else {
                this.step = 0;
                this.buttonsCreated = false;
                $("#tryExptInstr").show();
            }
        } else if(this.isSanityCheck) { 
            this.trialIndex++;
            if (this.sanityMoveFails == 3 || this.sanitySayFails == 3 || this.sanityQuitAttempts == 3) {
                // drop participant
            }
            
            if(this.trialIndex >= this.trialN) {
                this.end();
            } else {
                this.step = 0;
                TRIAL_SET_UP(this);
                CREATE_GRID(this);
                SETUP_SCOREBOARD(this);
                CREATE_SIGNAL_BUTTONS(this, this.signalSpace);
                $("#sanityCheckInstr").show();
                this.move();
            }
        } else if(this.isPracTrial) {
            this.trialIndex++;
            if(this.trialIndex >= this.trialN) {
                this.end();
            } else {
                this.step = 0;
                TRIAL_SET_UP(this);
                CREATE_GRID(this);
                SETUP_SCOREBOARD(this);
                CREATE_SIGNAL_BUTTONS(this, this.signalSpace);
                $("#practiceExptInstr").show();
                this.move();
            }
        } else if(this.isExptTrial) {
            var currentTime = Date.now();
            this.feedbackTime = (currentTime - this.startTime) / 1000 - this.actionTime; // in second
            this.exptId = this.randomizedTrialList[this.trialIndex];
            this.totalUtility = this.totalScore;
            var dataList = [this.subjId, this.trialIndex, this.exptId, 
                this.decision, this.signal, 
                this.exptSignalerPath, this.signalerEndCoordinate, this.signalerEndItem, 
                this.exptReceiverPath, this.receiverEndCoordinate, this.receiverEndItem,
                this.signalerAchievedGoal, this.receiverAchievedGoal,
                this.totalUtility,
                this.decisionTime, this.actionTime, this.feedbackTime];
            this.exptDataToSave += LIST_TO_FORMATTED_STRING(dataList);
            this.startTime = Date.now();
            this.trialIndex++;
            if(this.trialIndex >= this.trialN) {
                this.end();
            } else {
                this.step = 0;
                this.decisionRecorded = false;
                this.exptSignalerPath = "N/A",
                this.exptReceiverPath = "N/A",
                TRIAL_SET_UP(this);
                CREATE_GRID(this);
                SETUP_SCOREBOARD(this);
                CREATE_SIGNAL_BUTTONS(this, this.signalSpace);
                $("#exptInstr").show();
                this.move();
            }
        }
    }
    end() {
        if(this.isSanityCheck) {
            $("#sanityCheckPage").hide();
            NEXT_INSTR();
            $("#instrBackBut").hide();
            $("#instrPage").show();
        } else if(this.isPracTrial) {
            $("#practiceExptPage").hide();
            NEXT_INSTR();
            $("#instrBackBut").hide();
            $("#instrPage").show();
        } else if(this.isExptTrial) {
            console.log(this.exptDataToSave);
            this.saveExptData();
        }
    }
    move() {
        this.allowMove = true;
        MOVE(this);
    }

    saveExptData() {
        var postData = {
            'directory_path': this.savingDir,
            'file_name': this.dataFile,
            'data': this.exptDataToSave // data to save
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }
}

function CONVERT_CSV_COORD_TO_ARRAY_COORD(inputCol, inputRow) {
    var colInArray = inputCol;
    var rowInArray = GRID_NROW - inputRow - 1;
    return [rowInArray, colInArray]; // changed order from col, row -> row, col
}

function CONVERT_ARRAY_COORD_TO_CSV_COORD(inputRow, inputCol) {
    var colInCsv = inputCol;
    var rowInCsv = GRID_NROW - inputRow - 1;
    return [colInCsv, rowInCsv]; // changed order from row, col -> col, row
}

function FIND_PATH(receiverLocation, receiverIntentionLocation) {
    initialDirection = Math.floor(Math.random() * 2); // 0 or 1

    horizontalDiff = receiverLocation[0] - receiverIntentionLocation[0];
    verticalDiff = receiverLocation[1] - receiverIntentionLocation[1];

    path = [];
    switch (initialDirection) {
        case 0: // initialDirection is vertical
            if (verticalDiff > 0) {
                for (i = 0; i < Math.abs(verticalDiff); i++) {
                    path[i] = "down";
                }
            } else if (verticalDiff < 0) {
                for (i = 0; i < Math.abs(verticalDiff); i++) {
                    path[i] = "up";
                }
            }

            currentPathLength = path.length;
            if (horizontalDiff > 0) {
                for (i = currentPathLength; i < currentPathLength + Math.abs(horizontalDiff); i++) {
                    path[i] = "left";
                }
            } else if (horizontalDiff < 0) {
                for (i = currentPathLength; i < currentPathLength + Math.abs(horizontalDiff); i++) {
                    path[i] = "right";
                }
            }

            break;

        case 1: // initialDirection is horizontal
            if (horizontalDiff > 0) {
                for (i = 0; i < Math.abs(horizontalDiff); i++) {
                    path[i] = "left";
                }
            } else if (horizontalDiff < 0) {
                for (i = 0; i < Math.abs(horizontalDiff); i++) {
                    path[i] = "right";
                }
            }

            currentPathLength = path.length;
            if (verticalDiff > 0) {
                for (i = currentPathLength; i < currentPathLength+ Math.abs(verticalDiff); i++) {
                    path[i] = "down";
                }
            } else if (verticalDiff < 0) {
                for (i = currentPathLength; i < currentPathLength + Math.abs(verticalDiff); i++) {
                    path[i] = "up";
                }
            }
            break;

        default:
            console.log("ERROR: invalid initialDirection");
            break;
    }
    return path;
}

function CREATE_RECEIVER_PATH_DICT(obj) {
    // Below section finds a path for each signal from signalSpace and assigns them into a dict for receiverPath
    // TEMPORARY TO REVERSE KEY:VALUE ORDER OF A DICTIONARY FOR TARGET_DICTIONARY
    if(!obj.isExptTrial) {
        tmpTargetDictionary = Object.entries(obj.inputData[obj.trialIndex]["targetDictionary"]).reduce((tmpObj, item) => (tmpObj[item[1]] = item[0]) && tmpObj, {});

        var receiverPathsList = {};
        var signalSpace = obj.inputData[obj.trialIndex]["signalSpace"];
        for (var i = 0; i < signalSpace.length; i++) {
            var receiverLocation = obj.inputData[obj.trialIndex]["receiverLocation"];

            var receiverIntention = obj.inputData[obj.trialIndex]["receiverIntentionDict"][signalSpace[i]];
            var targetLocation = CONVERT_STR_TO_ARRAY(tmpTargetDictionary[receiverIntention]);

            receiverPathsList[signalSpace[i]] = FIND_PATH(receiverLocation, targetLocation);
        }
        obj.receiverPath = receiverPathsList;
    } else {
        tmpTargetDictionary = Object.entries(obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["targetDictionary"]).reduce((tmpObj, item) => (tmpObj[item[1]] = item[0]) && tmpObj, {});

        var receiverPathsList = {};
        var signalSpace = obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["signalSpace"];
        for (var i = 0; i < signalSpace.length; i++) {
            var receiverLocation = obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["receiverLocation"];

            var receiverIntention = obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["receiverIntentionDict"][signalSpace[i]];
            var targetLocation = CONVERT_STR_TO_ARRAY(tmpTargetDictionary[receiverIntention]);

            receiverPathsList[signalSpace[i]] = FIND_PATH(receiverLocation, targetLocation);
        }
        obj.receiverPath = receiverPathsList;
    }
    
}

function SET_RECEIVER_SIGNALER_LOCATION(obj) {
    //var receiverFromCSV, signalerFromCSV;
        if (obj.isPracTrial || obj.isSanityCheck)  {  
            obj.receiverLocation = CONVERT_CSV_COORD_TO_ARRAY_COORD(obj.inputData[obj.trialIndex]["receiverLocation"][0], obj.inputData[obj.trialIndex]["receiverLocation"][1]); 
            obj.signalerLocation = CONVERT_CSV_COORD_TO_ARRAY_COORD(obj.inputData[obj.trialIndex]["signalerLocation"][0], obj.inputData[obj.trialIndex]["signalerLocation"][1]);
        } else if (obj.isExptTrial) {
            obj.receiverLocation = CONVERT_CSV_COORD_TO_ARRAY_COORD(obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["receiverLocation"][0], obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["receiverLocation"][1]); 
            obj.signalerLocation = CONVERT_CSV_COORD_TO_ARRAY_COORD(obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["signalerLocation"][0], obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["signalerLocation"][1]);
        }
}

    
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

    SET_RECEIVER_SIGNALER_LOCATION(obj);

    obj.gridArray[obj.receiverLocation[0]][obj.receiverLocation[1]] = SHAPE_DIR + "receiver.png";
    obj.gridArray[obj.signalerLocation[0]][obj.signalerLocation[1]] = SHAPE_DIR + "signaler.png";

    // TODO: random sampling for sanity check
    if (obj.isSanityCheck) {
        obj.signalSpace = obj.inputData[obj.trialIndex].signalSpace;
        obj.gridString = obj.inputData[obj.trialIndex].targetDictionary;
        $("#round").html(obj.trialIndex + 1);
    } else if (obj.isPracTrial) {
        obj.signalSpace = obj.inputData[obj.trialIndex].signalSpace;
        obj.gridString = obj.inputData[obj.trialIndex].targetDictionary;
        $("#round").html(obj.trialIndex + 1);
    } else if (obj.isExptTrial) {
        obj.signalSpace = obj.inputData[obj.randomizedTrialList[obj.trialIndex]].signalSpace;
        obj.gridString= obj.inputData[obj.randomizedTrialList[obj.trialIndex]].targetDictionary;
    }

    var coordinates = Object.keys(obj.gridString);
    var shape = Object.values(obj.gridString);
   
    for (var i = 0; i < shape.length; i++) {
        var coordFromCSV = coordinates[i].split(",");
        var coordInArray = CONVERT_CSV_COORD_TO_ARRAY_COORD(coordFromCSV[0], coordFromCSV[1])
        var row = coordInArray[0];
        var col = coordInArray[1];
        obj.gridArray[row][col] = PIC_DICT[shape[i]];
        if(!obj.isExptTrial) {
            if (shape[i] == obj.inputData[obj.trialIndex].intention)
                obj.goalCoord = [row, col];
        } else {
            if (shape[i] == obj.inputData[obj.randomizedTrialList[obj.trialIndex]].intention)
                obj.goalCoord = [row, col];
        }
    }

    signalerMoved = false;
    receiverMoved = false;

    CREATE_RECEIVER_PATH_DICT(obj);
}

function UPDATE_RESULT_IN_OBJ(obj,reward) {
    obj.allowMove = false;
    obj.totalScore = obj.totalScore - obj.step + reward;
    obj.reached = true;
}

function MOVE(obj) {
    var arrowClicked = false; //to prevent clicking on ENTER before arrow keys
    document.onkeydown = function(e) {
        if(obj.allowMove) {
            if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {// arrow keys
                if(!obj.decisionRecorded) {
                    RECORD_DECISION_DATA(obj, "move");
                    RECORD_SIGNAL_DATA(obj);
                }
                arrowClicked = true;
                CHANGE_IN_TRIAL_INSTR("do");
                UPDATE_STEPS(obj);
                UPDATE_GAME_BOARD(obj, e.keyCode);
            } else if (e.keyCode == 13) { // ENTER key
                e.preventDefault();
                if(arrowClicked){
                    if(obj.signalerLocation[0] == obj.goalCoord[0] && obj.signalerLocation[1] == obj.goalCoord[1]){ //reached
                        RECORD_ACTION_TIME(obj);
                        RECORD_SIGNALER_END_LOCATION(obj, obj.signalerLocation);
                        RECORD_RECEIVER_END_LOCATION(obj);
                        RECORD_SIGNALER_ACHIEVED(obj, "achieved")
                        RECORD_RECEIVER_ACHIEVED(obj);
                        UPDATE_RESULT_IN_OBJ(obj, REWARD);
                        SHOW_WIN_RESULT_BOX_FOR_MOVE(obj, true);
                        obj.step = 0;
                    } else if ($("#shape"+ obj.signalerLocation[0] + "v" + obj.signalerLocation[1]).hasClass("gridEmpty") || (obj.signalerLocation[0] == obj.receiverLocation[0] && obj.signalerLocation[1] == obj.receiverLocation[1])){
                        alert("You cannot stop on an empty square or the receiver's position! Please move to an item on the grid.")
                    } else {
                        RECORD_ACTION_TIME(obj);
                        RECORD_SIGNALER_END_LOCATION(obj, obj.signalerLocation);
                        RECORD_RECEIVER_END_LOCATION(obj);
                        RECORD_SIGNALER_ACHIEVED(obj);
                        RECORD_RECEIVER_ACHIEVED(obj);
                        UPDATE_RESULT_IN_OBJ(obj, 0);
                        SHOW_WIN_RESULT_BOX_FOR_MOVE(obj, false);
                        obj.step = 0;
                    }
                } else 
                    alert("Please use arrow keys on your keyboard to move.");
            } else
                alert("Please use arrow keys on your keyboard to move.");
        } else {
            alert("You are not allowed to move by yourself right now. Please follow the instructions.")
        }
    }
};

// Use to do something like this: ie. "1, 2" -> [1, 2]
// TODO: should implement built-in PARSE_CSV in index.js
function CONVERT_STR_TO_ARRAY(input) {
    return input.split(',').map(Number);
}

function RECEIVER_WALK(obj, signal) {
    RECORD_DECISION_DATA(obj, "say");
    RECORD_SIGNAL_DATA(obj, signal);

    var path = obj.receiverPath[signal];
    var stepOnGrid = path[obj.pathIndex];
    CHANGE_IN_TRIAL_INSTR("say");
    UPDATE_STEPS(obj);
    UPDATE_GAME_BOARD(obj, stepOnGrid);
        if(obj.pathIndex == path.length - 1) {
            if(obj.receiverLocation[0] == obj.goalCoord[0] && obj.receiverLocation[1] == obj.goalCoord[1]) {
                RECORD_ACTION_TIME(obj);
                RECORD_SIGNALER_END_LOCATION(obj);
                RECORD_RECEIVER_END_LOCATION(obj, obj.receiverLocation);
                RECORD_SIGNALER_ACHIEVED(obj);
                RECORD_RECEIVER_ACHIEVED(obj, "achieved");
                UPDATE_RESULT_IN_OBJ(obj, REWARD);
                SHOW_WIN_RESULT_BOX_FOR_SAY(obj, true);
                obj.step = 0;
                obj.pathIndex = 0;
            } else {
                RECORD_ACTION_TIME(obj);
                RECORD_SIGNALER_END_LOCATION(obj);
                RECORD_RECEIVER_END_LOCATION(obj, obj.receiverLocation);
                RECORD_SIGNALER_ACHIEVED(obj);
                RECORD_RECEIVER_ACHIEVED(obj);
                UPDATE_RESULT_IN_OBJ(obj, 0);
                SHOW_WIN_RESULT_BOX_FOR_SAY(obj, false);
                obj.step = 0;  
                obj.pathIndex = 0;      
            }           
        } else {
            obj.pathIndex++;
            setTimeout(RECEIVER_WALK, RECEIVER_MOVE_SPEED * 1000, obj, signal);
        }  
}

function SUCCESS(){
    console.log("DATA saved!");
}

function ERROR(){
    alert("Error occurred!");
}

function POST_DATA(trial_obj, success_func, error_func) {
    trial_obj = (trial_obj === undefined) ? null : trial_obj;
    success_func = (success_func === undefined) ? function() {return;} : success_func;
    error_func = (error_func === undefined) ? function() {return;} : error_func;
    $.ajax({
        type: "POST",
        url: "save.php",
        data: trial_obj,
        success: success_func,
        error: error_func
    });
}


function NEXT_TRIAL(obj) {
    if(obj.isTryMove){
        instr.next();
        $("#instrText").show();
        $("#instrNextBut").show();
        $("#instrBackBut").css("position", "absolute");
    } else if (obj.isTrySay) {
        //instr.next();
        $("#instrText").show();
        $("#instrNextBut").show();
        $("#instrBackBut").css("position", "absolute");
    } else if(obj.isSanityCheck){
        RESET_GAMEBOARD();
        SANITY_CHECK_INSTR_APPEAR();
        sanityCheck.next();
    } else if(obj.isPracTrial){
        RESET_GAMEBOARD();
        PRACTICE_EXPT_INSTR_APPEAR();
        practice.next();
    } else if(obj.isExptTrial){
        RESET_GAMEBOARD();
        EXPT_INSTR_APPEAR();
        expt.next();
    } 
}



/*
 ####### ######  #     # 
    #    #     #  #   #  
    #    #     #   # #   
    #    ######     #    
    #    #   #      #    
    #    #    #     #    
    #    #     #    #    
                         
*/


function RESET_TRYMOVE_SIGNALER() {
    if(tryMove.gridCreated) {
        if(tryMove.signalerLocation[0] != 9 || tryMove.signalerLocation[1] != 4){
            REMOVE_PREVIOUS(tryMove.signalerLocation);
            tryMove.signalerLocation = [9, 4];//row, col
            NEW_SIGNALER_POSITION(tryMove.signalerLocation);
        } 
    }
}

function RESET_TRYMOVE_RECEIVER() {
    if(tryMove.gridCreated) {
        if(tryMove.receiverLocation[0] != 2 || tryMove.receiverLocation[1] != 4){
            REMOVE_PREVIOUS(tryMove.receiverLocation);
            tryMove.receiverLocation = [2, 4];//row, col
            NEW_RECEIVER_POSITION(tryMove.receiverLocation);
            console.log("receivertryMove");
        } 
    }
}

function RESET_GAMEBOARD() {
    TRY_EXPT_INSTR_APPEAR();
    SANITY_CHECK_INSTR_APPEAR();
    PRACTICE_EXPT_INSTR_APPEAR();
    EXPT_INSTR_APPEAR();
    $("#tryDecision").html("");
    $("#sanityCheckDecision").html("");
    $("#practiceDecision").html("");
    $("#decision").html("");
    $("#tryResult").hide();
    $("#sanityCheckResult").hide();
    $("#practiceResult").hide();
    $("#result").hide();
}

function TRY_GRID_SETUP(obj) {
   if(!obj.gridCreated) {
        $(".gridItem").remove();
        $(".gridEmpty").remove();
        obj.gridArray[obj.receiverLocation[0]][obj.receiverLocation[1]] = SHAPE_DIR + "receiver.png";
        obj.gridArray[obj.signalerLocation[0]][obj.signalerLocation[1]] = SHAPE_DIR + "signaler.png";
        CREATE_GRID(obj);
        obj.gridCreated = true;
    }
}

function TRY_SCOREBOARD_SETUP(obj) {
    $(".tryStep").html(obj.step);
    $("#tryGoalShape").attr("src", PIC_DICT["red circle"]);
    $("#tryScore").html(obj.totalScore);
}

function TRY_MOVE_GAMEBOARD_SETUP() {
    $("#trySay").hide();
    $("#tryDo").show();
    $("#tryExptPage").show();
}

function TRY_SAY_GAMEBOARD_SETUP() {
    $("#trySay").show();
    $("#tryDo").hide();
    $("#tryExptPage").show();
}

function TRY_MOVE() {
    tryMove.isTryMove = true;
    tryMove.step = 0;
    tryMove.signalerLocation = CONVERT_CSV_COORD_TO_ARRAY_COORD(practice.inputData[0]["signalerLocation"][0], practice.inputData[0]["signalerLocation"][1]);
    tryMove.receiverLocation = CONVERT_CSV_COORD_TO_ARRAY_COORD(practice.inputData[0]["receiverLocation"][0], practice.inputData[0]["receiverLocation"][1]);
    if(!tryMove.reached)
        $("#instrNextBut").hide();
    CREATE_EXPT_BUTTONS(tryMove);
    $("#tryPracticeInfo").css("opacity", 0);
    tryMove.gridArray = [
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
    tryMove.goalCoord=[3,7];
    TRY_GRID_SETUP(tryMove);
    TRY_SCOREBOARD_SETUP(tryMove);
    TRY_MOVE_GAMEBOARD_SETUP();
    trySay.gridCreated = false;
    tryMove.move();
}

function TRY_SAY(){
    trySay.isTrySay = true;
    if (trySay.totalScore == 0)
        trySay.totalScore = tryMove.totalScore;
    if(!trySay.reached)
        $("#instrNextBut").hide();
    CREATE_EXPT_BUTTONS(trySay);
    $("#tryPracticeInfo").css("opacity", 0);
    trySay.receiverLocation = CONVERT_CSV_COORD_TO_ARRAY_COORD(practice.inputData[0]["receiverLocation"][0], practice.inputData[0]["receiverLocation"][1]);
    trySay.signalerLocation = CONVERT_CSV_COORD_TO_ARRAY_COORD(practice.inputData[0]["signalerLocation"][0], practice.inputData[0]["signalerLocation"][1]);
    trySay.gridArray = [
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
    trySay.goalCoord = [3,7];
    var trySayOptions = ["red", "circle", "green"];
    CREATE_SIGNAL_BUTTONS(trySay, trySayOptions);

    TRY_GRID_SETUP(trySay);
    tryMove.gridCreated = false;

    TRY_SCOREBOARD_SETUP(trySay);
    TRY_SAY_GAMEBOARD_SETUP();
    document.onkeydown = function (e) {
        alert("Please click on one of the buttons to send the signal.");
    }
}



/*

SANITY CHECK

*/

function SANITY_CHECK_GAMEBOARD_SETUP() {
    $("#sanityCheckSay").show();
    $("#sanityCheckDo").show();
    $("#sanityCheckQuit").show();
    $("#sanityCheckPage").show();
}

function START_SANITY_CHECK_TRIAL() {
    $("#instrPage").hide();
    $("#sanityCheckInfo").css("opacity", 1);
    sanityCheck.isSanityCheck = true;
    sanityCheck.trialN = sanityCheck.inputData.length;

    // random sampling for first trial; the following trials are handled in next()
    CREATE_RANDOM_LIST_FOR_EXPT(sanityCheck);  

    TRIAL_SET_UP(sanityCheck);
    CREATE_GRID(sanityCheck);
    CREATE_SIGNAL_BUTTONS(sanityCheck, sanityCheck.signalSpace);
    SETUP_SCOREBOARD(sanityCheck);
    SANITY_CHECK_GAMEBOARD_SETUP();
    CREATE_EXPT_BUTTONS(sanityCheck);
    sanityCheck.move();
}

function NEXT_INSTR() {
    instr.next();
    SHOW_INSTR();
}


/*
 ######  ######     #     #####  ####### ###  #####  ####### 
 #     # #     #   # #   #     #    #     #  #     # #       
 #     # #     #  #   #  #          #     #  #       #       
 ######  ######  #     # #          #     #  #       #####   
 #       #   #   ####### #          #     #  #       #       
 #       #    #  #     # #     #    #     #  #     # #       
 #       #     # #     #  #####     #    ###  #####  ####### 
                                                             
*/
function PRACTICE_GAMEBOARD_SETUP() {
    $("#practiceSay").show();
    $("#practiceDo").show();
    $("#practiceQuit").show();
    $("#practiceExptPage").show();
}

function START_PRACTICE_TRIAL() {
    $("#instrPage").hide();
    $("#practiceInfo").css("opacity", 1);
    practice.isPracTrial = true;
    practice.trialN = practice.inputData.length;
    TRIAL_SET_UP(practice);
    CREATE_GRID(practice);
    CREATE_SIGNAL_BUTTONS(practice, practice.signalSpace);
    SETUP_SCOREBOARD(practice);
    PRACTICE_GAMEBOARD_SETUP();
    CREATE_EXPT_BUTTONS(practice);
    practice.move();
}

function NEXT_INSTR() {
    instr.next();
    SHOW_INSTR();
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

function EXPT_GAMEBOARD_SETUP() {
    $("#say").show();
    $("#do").show();
    $("#quit").show();
    $("#exptPage").show();
}

function START_EXPT(){
    $("#instrPage").hide();
    $("#exptPracticeInfo").css("opacity", 0);
    expt.isExptTrial = true;
    expt.trialN = expt.inputData.length;
    CREATE_RANDOM_LIST_FOR_EXPT(expt);  
    TRIAL_SET_UP(expt);
    CREATE_GRID(expt);
    CREATE_SIGNAL_BUTTONS(expt, expt.signalSpace);
    SETUP_SCOREBOARD(expt);
    EXPT_GAMEBOARD_SETUP();
    CREATE_EXPT_BUTTONS(expt);
    expt.move();

    expt.startTime = Date.now();
    expt.exptSignalerPath = "N/A",
    expt.exptReceiverPath = "N/A",
    $("#exptPage").show();
}

/*
 ######  #######  #####  ####### ######  ######  
 #     # #       #     # #     # #     # #     # 
 #     # #       #       #     # #     # #     # 
 ######  #####   #       #     # ######  #     # 
 #   #   #       #       #     # #   #   #     # 
 #    #  #       #     # #     # #    #  #     # 
 #     # #######  #####  ####### #     # ######  
                                                 
*/

function RECORD_DECISION_DATA(obj, decision) {
    if(!obj.decisionRecorded){
        obj.decision = decision;
        var currentTime = Date.now();
        obj.decisionTime = (currentTime - obj.startTime)/1000;
        obj.decisionRecorded = true;
    }
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

function FIND_SHAPENAME_FROM_SHAPEPIC (shapePic) {
    var pictKeyIndex = 0;
    while(PIC_DICT[Object.keys(PIC_DICT)[pictKeyIndex]] != shapePic ) {
        pictKeyIndex++;
    }
    return Object.keys(PIC_DICT)[pictKeyIndex];
}

function CONVERT_COORD_ARRAY_TO_STR (array) {
    return "(" + array.toString() + ")";
}

function RECORD_SIGNALER_END_LOCATION(obj, signalerLocation) {
    if(obj.isExptTrial){
        var startingCoord = obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["signalerLocation"];
        obj.signalerEndCoordinate = (signalerLocation == undefined) ? CONVERT_COORD_ARRAY_TO_STR(startingCoord): CONVERT_COORD_ARRAY_TO_STR(CONVERT_ARRAY_COORD_TO_CSV_COORD(signalerLocation[0], signalerLocation[1]));
        obj.signalerEndItem = (signalerLocation == undefined) ? "noChange": FIND_SHAPENAME_FROM_SHAPEPIC (obj.gridArray[signalerLocation[0]][signalerLocation[1]]);
    }
}

function RECORD_RECEIVER_END_LOCATION(obj, receiverLocation) {
    if(obj.isExptTrial){
        var startingCoord = obj.inputData[obj.randomizedTrialList[obj.trialIndex]]["receiverLocation"];
        obj.receiverEndCoordinate = (receiverLocation == undefined) ? CONVERT_COORD_ARRAY_TO_STR(startingCoord): CONVERT_COORD_ARRAY_TO_STR(CONVERT_ARRAY_COORD_TO_CSV_COORD(receiverLocation[0], receiverLocation[1]));
        obj.receiverEndItem = (receiverLocation == undefined) ? "noChange": FIND_SHAPENAME_FROM_SHAPEPIC (obj.gridArray[receiverLocation[0]][receiverLocation[1]]);
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
