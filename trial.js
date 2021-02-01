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
            isPracTrial: false,
            isExptTrial: false,
            startTime: 0,
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
        } else if(this.isPracTrial) {
            this.trialIndex++;
            if(this.trialIndex >= this.trialN) {
                this.end();
            } else {
                this.step = 0;
                this.buttonsCreated = false;
                TRIAL_SET_UP(this);
                CREATE_GRID(this);
                SETUP_SCOREBOARD(this);
                CREATE_SIGNAL_BUTTONS(this, this.signalSpace);
                $("#practiceExptInstr").show();
                this.move();
            }
        } else if(this.isExptTrial) {
            var currentTime = Date.now();
            this.finishTime = (currentTime - this.startTime) / 1000; // in second
            this.exptId = this.randomizedTrialList[this.trialIndex];
            var dataList = [this.subjId, this.trialIndex, this.exptId, this.decision, this.decideTime, this.endLocation, this.finishTime];
            this.exptDataToSave += LIST_TO_FORMATTED_STRING(dataList);
            this.startTime = Date.now();
            this.trialIndex++;
            if(this.trialIndex >= this.trialN) {
                this.end();
            } else {
                this.step = 0;
                this.decisionRecorded = false;
                this.buttonsCreated = false;
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
        if(this.isPracTrial) {
            $("#practiceExptPage").hide();
            NEXT_INSTR();
            $("#instrBackBut").hide();
            $("#instrPage").show();
        } else if(this.isExptTrial) {
            console.log(this.exptDataToSave);
            this.saveExptData();
        }
    }
    /*
    end() {
        
        
        if (this.trialNum > 0) {
            var dataList = LIST_FROM_ATTRIBUTE_NAMES(this, this.titles);
            this.exptDataToSave += LIST_TO_FORMATTED_STRING(dataList);
        }
        if (this.trialNum < this.trialN) {
            this.run();
        } else {
            this.complete = true;
            this.endExptFunc();
        }
    }
    */
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
        tmpTargetDictionary = Object.entries(expt.inputData[obj.trialIndex]["targetDictionary"]).reduce((tmpObj, item) => (tmpObj[item[1]] = item[0]) && tmpObj, {});

        var receiverPathsList = {};
        var signalSpace = expt.inputData[obj.trialIndex]["signalSpace"];
        for (var i = 0; i < signalSpace.length; i++) {
            var receiverLocation = expt.inputData[obj.trialIndex]["receiverLocation"];

            var receiverIntention = expt.inputData[obj.trialIndex]["receiverIntentionDict"][signalSpace[i]];
            var targetLocation = CONVERT_STR_TO_ARRAY(tmpTargetDictionary[receiverIntention]);

            receiverPathsList[signalSpace[i]] = FIND_PATH(receiverLocation, targetLocation);
        }
        obj.receiverPath = receiverPathsList;
        console.log(obj.receiverPath);
    } else {
        tmpTargetDictionary = Object.entries(expt.inputData[obj.randomizedTrialList[obj.trialIndex]]["targetDictionary"]).reduce((tmpObj, item) => (tmpObj[item[1]] = item[0]) && tmpObj, {});

        var receiverPathsList = {};
        var signalSpace = expt.inputData[obj.randomizedTrialList[obj.trialIndex]]["signalSpace"];
        for (var i = 0; i < signalSpace.length; i++) {
            var receiverLocation = expt.inputData[obj.randomizedTrialList[obj.trialIndex]]["receiverLocation"];

            var receiverIntention = expt.inputData[obj.randomizedTrialList[obj.trialIndex]]["receiverIntentionDict"][signalSpace[i]];
            var targetLocation = CONVERT_STR_TO_ARRAY(tmpTargetDictionary[receiverIntention]);

            receiverPathsList[signalSpace[i]] = FIND_PATH(receiverLocation, targetLocation);
        }
        obj.receiverPath = receiverPathsList;
        console.log(obj.receiverPath);
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

    receiverFromCSV = expt.inputData[obj.trialIndex]["receiverLocation"];
    signalerFromCSV = expt.inputData[obj.trialIndex]["signalerLocation"];
    receiver = CONVERT_CSV_COORD_TO_ARRAY_COORD(receiverFromCSV[0], receiverFromCSV[1]);
    signaler = CONVERT_CSV_COORD_TO_ARRAY_COORD(signalerFromCSV[0], signalerFromCSV[1]);

    obj.gridArray[receiver[0]][receiver[1]] = SHAPE_DIR + "receiver.png";
    obj.gridArray[signaler[0]][signaler[1]] = SHAPE_DIR + "signaler.png";

    if (obj.isPracTrial) {
        obj.signalSpace = obj.inputData[obj.trialIndex].targetDictionary;
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
                if(!obj.decisionRecorded)
                    RECORD_DECISION_DATA(obj, "move");
                arrowClicked = true;
                CHANGE_IN_TRIAL_INSTR("do");
                UPDATE_STEPS(obj);
                UPDATE_GAME_BOARD(e.keyCode);
            } else if (e.keyCode == 13) { // ENTER key
                e.preventDefault();
                if(arrowClicked){
                    if(signaler[0] == obj.goalCoord[0] && signaler[1] == obj.goalCoord[1]){ //reached
                        var endLocation = obj.gridArray[signaler[0]][signaler[1]];
                        var pictKeyIndex = 0;
                        while(PIC_DICT[Object.keys(PIC_DICT)[pictKeyIndex]] != endLocation ) {
                           pictKeyIndex++;
                        }
                        RECORD_END_LOCATION(obj, Object.keys(PIC_DICT)[pictKeyIndex]);
                        UPDATE_RESULT_IN_OBJ(obj, REWARD);
                        SHOW_WIN_RESULT_BOX_FOR_MOVE(obj, true);
                        obj.step = 0;
                    } else if ($("#shape"+ signaler[0] + "v" + signaler[1]).hasClass("gridEmpty") || (signaler[0] == receiver[0] && signaler[1] == receiver[1])){
                        alert("You cannot stop on an empty square or the receiver's position! Please move to an item on the grid.")
                    } else {
                        var endLocation = obj.gridArray[signaler[0]][signaler[1]];
                        var pictKeyIndex = 0;
                        while(PIC_DICT[Object.keys(PIC_DICT)[pictKeyIndex]] != endLocation ) {
                            pictKeyIndex++;
                         }
                        RECORD_END_LOCATION(obj, Object.keys(PIC_DICT)[pictKeyIndex]);
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
    RECORD_DECISION_DATA(obj, signal);

    var path = obj.receiverPath[signal];
    
    console.log(path);

    var stepOnGrid = path[obj.pathIndex];
    console.log(stepOnGrid);
    CHANGE_IN_TRIAL_INSTR("do");
    UPDATE_STEPS(obj);
    UPDATE_GAME_BOARD(stepOnGrid);
        if(obj.pathIndex == path.length - 1) {
            if(receiver[0] == obj.goalCoord[0] && receiver[1] == obj.goalCoord[1]) {
                UPDATE_RESULT_IN_OBJ(obj, REWARD);
                SHOW_WIN_RESULT_BOX_FOR_SAY(obj, true);
                obj.step = 0;
                obj.pathIndex = 0;
            } else {
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


function RESET_SIGNALER() {
    if(signaler[0] != 9 || signaler[1] != 4){
        REMOVE_PREVIOUS(signaler);
        signaler = [9, 4];//row, col
        NEW_POSITION(signaler);
    }
}

function RESET_RECEIVER() {
    if(receiver[0] != 2 || receiver[1] != 4){
        REMOVE_PREVIOUS(receiver);
        receiver = [2, 4];//row, col
        NEW_POSITION(receiver);
    }
}

function RESET_GAMEBOARD() {
    TRY_EXPT_INSTR_APPEAR();
    PRACTICE_EXPT_INSTR_APPEAR();
    EXPT_INSTR_APPEAR();
    $("#tryDecision").html("");
    $("#practiceDecision").html("");
    $("#decision").html("");
    $("#tryResult").hide();
    $("#practiceResult").hide();
    $("#result").hide();
}

function TRY_GRID_SETUP(obj) {
   if(!obj.gridCreated) {
        $(".gridItem").remove();
        $(".gridEmpty").remove();

        obj.gridArray[receiver[0]][receiver[1]] = SHAPE_DIR + "receiver.png";
        obj.gridArray[signaler[0]][signaler[1]] = SHAPE_DIR + "signaler.png";
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
    $("#exptPage").show();
}

function RECORD_DECISION_DATA(obj, decision) {
    if(!obj.decisionRecorded){
        obj.decision = decision;
        var currentTime = Date.now();
        obj.decideTime = (currentTime - obj.startTime)/1000;
        obj.decisionRecorded = true;
    }
}

function RECORD_END_LOCATION(obj, location) {
    obj.endLocation = location;
}
