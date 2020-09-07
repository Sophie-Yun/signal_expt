
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
    if (trialNum != 0){
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


