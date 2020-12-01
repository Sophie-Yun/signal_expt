class trialObject {
    constructor(options = {}) {
        Object.assign(this, {
            subj: false,
            step: 0,
            totalScore: 0,
            gridCreated: false,
            reached: false,
            allowMove: false,
            resultRecorded: false,
            pathIndex: 0,
            trialN: 0,
            titles: '',
            stimPath: 'Stimuli/',
            dataFile: '',
            savingScript: 'save.php',
            savingDir: 'data/testing',
            trialList: [],
            intertrialInterval: 0.5,
            updateFunc: false,
            trialFunc: false,
            endExptFunc: false,
            isExptTrial: false,
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
        this.num = this.subj.num;
        this.date = this.subj.date;
        this.subjStartTime = this.subj.startTime;
        this.trialIndex = 0;
        this.allData = LIST_TO_FORMATTED_STRING(this.titles);
        this.complete = false;
        this.receiverPath = { "red": ["right","right","right","down"],
                            "green": ["right","down","down","down","down","down","down"],
                        "circle": ["right","right","right","down"]};
        this.receiverPathNum = 0;
    }
    
    /*
    run() {
        var that = this;
        this.trialIndex++;
        const LAST = (this.trialIndex == this.trialN);
        this.thisTrial = this.trialList.pop();
        
        function findNextTrial(last) {
            if (last){
                return false
            } else {
                return that.trialList[(that.trialList.length) - 1];
            }
        }
        const NEXT_TRIAL = findNextTrial(LAST);

        this.updateFunc(LAST, this.thisTrial, NEXT_TRIAL, this.stimPath);

        const START_STIM = function() {
            that.trialFunc();
            that.startTime = Date.now();
        };

        //setTimeout(START_STIM, this.intertrialInterval * 1000);
    }*/
    start(){
        $("#quitBut").click(function(){SHOW_QUIT_RESULT(this)});
        $("#resultBut").click(function(){NEXT_TRIAL(this)});
    }

    next(){
        this.trialIndex++;
        this.step = 0;
        recorded = false;
        TRIAL_SET_UP(this);
        CREATE_GRID(this.gridArray, GRID_NROW, GRID_NCOL);
        SETUP_RECORD_BOX(this);
        CREATE_SIGNAL_BUTTONS(this, this.signalSpace);
        $("#exptInstr").show();
        //startTime = Date.now();
    }
    /*
    end() {
        var currentTime = Date.now();
        this.rt = (currentTime - this.startTime) / 1000; // in second
        if (this.trialNum > 0) {
            var dataList = LIST_FROM_ATTRIBUTE_NAMES(this, this.titles);
            this.allData += LIST_TO_FORMATTED_STRING(dataList);
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

    save() {
        var postData = {
            'directory_path': this.savingDir,
            'file_name': this.dataFile,
            'data': this.allData // data to save
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }
}

function RECORD_DECISION_TIME(obj, result) {
    if(!obj.resultRecorded){
        obj.result = result;
        var currentTime = Date.now();
        decideTime = (currentTime - startTime)/1000;
        obj.resultRecorded = true;
    }
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
                arrowClicked = true;
                RECORD_DECISION_TIME(obj, "do");
                CHANGE_IN_TRIAL_INSTR("do");
                UPDATE_STEPS(obj);
                UPDATE_GAME_BOARD(e.keyCode);
            } else if (e.keyCode == 13) { // ENTER key
                e.preventDefault();
                if(arrowClicked){
                    if(signaler[0] == obj.goalCoord[0] && signaler[1] == obj.goalCoord[1]){ //reached
                        UPDATE_RESULT_IN_OBJ(obj, REWARD);
                        SHOW_WIN_RESULT_BOX_FOR_MOVE(obj, true);
                        obj.step = 0;
                    } else if ($("#shape"+ signaler[0] + "v" + signaler[1]).hasClass("gridEmpty") || (signaler[0] == receiver[0] && signaler[1] == receiver[1])){
                        alert("You cannot stop on an empty square or the receiver's position! Please move to an item on the grid.")
                    } else {
                        UPDATE_RESULT_IN_OBJ(obj, 0);
                        SHOW_WIN_RESULT_BOX_FOR_MOVE(obj, false);
                        obj.step = 0;
                    }
                } else 
                    alert("Please use arrow keys on your keyboard to move.");
            } else
                alert("Please use arrow keys on your keyboard to move.");
        } else {
            alert("You are not allowed to move by yourself in this round. Please follow the instructions.")
        }
    }
};

function RECEIVER_WALK(obj, signal) {
    RECORD_DECISION_TIME(obj, signal);
    EXPT_INSTR_FADE();

    var path = obj.receiverPath[signal];
    var stepOnGrid = path[obj.pathIndex];
    CHANGE_IN_TRIAL_INSTR("do");
    UPDATE_STEPS(obj);
    UPDATE_GAME_BOARD(stepOnGrid);

        if(obj.pathIndex == path.length - 1) {
            if(receiver[0] == obj.goalCoord[0] && receiver[1] == obj.goalCoord[1]){
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

function CREATE_RANDOM_REPEAT_BEGINNING_LIST(stim_list, repeat_trial_n) {
    const REPEAT_LIST = SHUFFLE_ARRAY(stim_list.slice()).splice(0, repeat_trial_n);
    return REPEAT_LIST.concat(stim_list);
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
    EXPT_INSTR_APPEAR();
    $("#decision").html("");
    $("#result").hide();
}

function TRY_GRID_SETUP(obj) {
   if(!obj.gridCreated) {
        $(".gridItem").remove();
        $(".gridEmpty").remove();

        obj.grid[receiver[0]][receiver[1]] = SHAPE_DIR + "receiver.png";
        obj.grid[signaler[0]][signaler[1]] = SHAPE_DIR + "signaler.png";
        CREATE_GRID(obj.grid, GRID_NROW, GRID_NCOL);
        obj.gridCreated = true;
    }
}

function TRY_SCOREBOARD_SETUP(obj) {
    $(".step").html(obj.step);
    $("#goalShape").attr("src", PIC_DICT["red circle"]);
    $("#score").html(obj.totalScore);
}

function TRY_MOVE_GAMEBOARD_SETUP() {
    $("#say").hide();
    $("#do").show();
    $("#quit").hide();
    $("#exptPage").show();
}

function TRY_SAY_GAMEBOARD_SETUP() {
    $("#say").show();
    $("#do").hide();
    $("#quit").hide();
    $("#exptPage").show();
}

function TRY_MOVE() {
    instrTry = true;
    if(!tryMove.reached)
        $("#instrNextBut").hide();
    tryMove.grid = [
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
    instrTry = true;
    if (trySay.totalScore == 0)
        trySay.totalScore = tryMove.totalScore;
    if(!trySay.reached)
        $("#instrNextBut").hide();

    trySay.grid = [
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
    $("#say").show();
    $("#do").show();
    $("#quit").show();
    $("#exptPage").show();
}

function START_PRACTICE_TRIAL() {
    $("#instrPage").hide();
    TRIAL_SET_UP(practice);
    CREATE_GRID(practice.gridArray, GRID_NROW, GRID_NCOL);
    CREATE_SIGNAL_BUTTONS(practice, practice.signalSpace);
    SETUP_RECORD_BOX(practice);
    PRACTICE_GAMEBOARD_SETUP();
    practice.start();
    practice.move();
}


/*                           
 ##### #####  #   ##   #      
   #   #    # #  #  #  #      
   #   #    # # #    # #      
   #   #####  # ###### #      
   #   #   #  # #    # #      
   #   #    # # #    # ###### 
                              
*/