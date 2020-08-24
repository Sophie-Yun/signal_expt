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
    alert("DATA saved!");
}

function ERROR(){
    alert("Error occurred!");
}

function POST_DATA(trial_num, decision_, decide_time, finish_time) {
    var postData = "trialNum,decision,decideTime,finishTime\n";
    postData += trial_num + "," + decision_ + "," + decide_time + "," + finish_time;
    console.log(postData);
    $.ajax({
        type: "POST",
        url: "data.php",
        data: postData,
        success: SUCCESS,
        error: ERROR,
    });
}



