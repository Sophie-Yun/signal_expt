function TRIAL_SET_UP (num) {
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

    if (!formal) {
        signalSpace = PRAC_TRIAL_DICT["prac" + num][0];
        gridString = PRAC_TRIAL_DICT["prac" + num][1];
        $("#pracRound").html("Practice Round " + (trialNum + 1));
    } else {
        signalSpace = TRIAL_DICT[trialList[num]][0];
        gridString = TRIAL_DICT[trialList[num]][1];
        $("#pracRound").html("");
    }

    for (var i = 0; i < MAX_SAY_OPTION; i++){
        if (i < signalSpace.length){
            $("#butOption" + i).html(signalSpace[i]);
            $("#butOption" + i).show();
        } else {
            $("#butOption" + i).hide();
        }
    }
    
    var coordinates = gridString.match(/\d+/g);
    var shape = gridString.match(/\w+ +\w+/g);
    
    for (var i = 0; i < shape.length; i++) {
        var col = 1 * coordinates[2 * i];
        var row = GRID_NROW - coordinates[2 * i + 1] - 1;
        trial[row][col] = PIC_DICT[shape[i]];
        if(!formal) {
            if (shape[i] == GOAL_DICT["expt" + num])
                goal = [row, col];
        } else {
            if (shape[i] == GOAL_DICT[trialList[num]])
                goal = [row, col];
        }
    }

    receiver = [2, 4];//row, col
    signaler = [9, 4];
    trial[receiver[0]][receiver[1]] = SHAPE_DIR + "receiver.png";
    trial[signaler[0]][signaler[1]] = SHAPE_DIR + "signaler.png";

    signalerMoved = false;
    receiverMoved = false;
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

function CREATE_GRID(trial, nrow, ncol) {
    var shapeId; 
    if (formal || trialNum != 0){
        $(".gridItem").remove();
        $(".gridEmpty").remove();
    }
    for (var row = 0; row < nrow; row++) {
        for (var col = 0; col < ncol; col++) {
            shapeId = "shape" + row + "v" + col;
            
            if (trial[row][col]!= null){
                $(".gridContainer").append("<div class='gridItem' id='" + shapeId + "'></div>")
                $("#" + shapeId).append($("<img>", {class: "shape", src: trial[row][col]}));
            }
            else{
                $(".gridContainer").append("<div class='gridEmpty' id='" + shapeId + "'></div>");
            }
        };
    };
}

function SETUP_RECORD_BOX(goal, score) {
    $("#goalShape").attr("src", trial[goal[0]][goal[1]]);
    $("#score").html(score);
}

function REMOVE_PREVIOUS(actor) {
    if($("#shape"+ actor[0] + "v" + actor[1]).hasClass("gridEmpty"))
        $("#shape"+ actor[0] + "v" + actor[1] + " img").remove();
    else 
        $(".top").remove();
}

function NEW_POSITION(actor) {
    if (actor == signaler)
        var actorImg = "signaler.png";
    else 
        var actorImg = "receiver.png";
    if($("#shape"+ actor[0] + "v" + actor[1]).hasClass("gridItem"))
        $("#shape" + actor[0] + "v" + actor[1]).append($("<img>", {class: "top", src: SHAPE_DIR + actorImg}));
    else
        $("#shape" + actor[0] + "v" + actor[1]).append($("<img>", {class: "shape", src: SHAPE_DIR + actorImg}));
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
        url: "data.php",
        data: trial_obj,
        success: success_func,
        error: error_func
    });
}


