function BLOCK_MOBILE() {
    $("#instrText").html('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at experimenter@domain.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
    $("#instrBut").hide();
    $("#instrPage").show();
}


/*
 ### #     #  #####  ####### ######  
  #  ##    # #     #    #    #     # 
  #  # #   # #          #    #     # 
  #  #  #  #  #####     #    ######  
  #  #   # #       #    #    #   #  
  #  #    ## #     #    #    #    #  
 ### #     #  #####     #    #     #  
                                             
*/
class instrObject {
    constructor(options = {}) {
        Object.assign(this, {
            text: [],
            funcDict: {},
            qConditions: [],
        }, options);
        this.index = 0;
        this.instrKeys = Object.keys(this.funcDict).map(Number);
        this.qAttemptN = {};
        for (var i=0;i<this.qConditions.length;i++){
            this.qAttemptN[this.qConditions[i]] = 1;
        }
        this.readingTimes = [];
    }

    start(textBox = $("#instrPage"), textElement = $("#instrText")) {
        textElement.html(this.text[0]);
        if (this.instrKeys.includes(this.index)) {
            this.funcDict[this.index]();
        }
        textBox.show();
        this.startTime = Date.now();

        //xxx: need to check again
        for (var i in PIC_DICT){
            $("#buffer").attr("src", PIC_DICT[i]);
        }
    }

    next(textElement = $("#instrText")) {
        this.readingTimes.push((Date.now() - this.startTime)/1000);
        this.index += 1;
        if (this.index < this.text.length) {
            textElement.html(this.text[this.index]);
            if (this.instrKeys.includes(this.index)) {
                this.funcDict[this.index]();
            }
            this.startTime = Date.now();
        } else {
            //this.startExptFunc();
        }
    }

    back(textElement = $("#instrText")) {
        this.readingTimes.push((Date.now() - this.startTime)/1000);
        this.index -= 1;
        if (this.index >= 0) {
            textElement.html(this.text[this.index]);
            if (this.instrKeys.includes(this.index)) {
                this.funcDict[this.index]();
            }
            this.startTime = Date.now();
        } else {
            //this.startExptFunc();
        }
    }
}

var instr_text = new Array;
instr_text[0] = "<strong>Welcome to this experiment!</strong><br><br>In this experiment, you will play a game that involves cooperation with one other agent. The goal is for you to reach a target item. <br><br>Hope you enjoy it!"
instr_text[1] = "Please carefully read the instructions on the next few pages. There will be a question that asks you about the instructions later and a couple of practice trials."
instr_text[2] = "In this experiment, you are the agent in blue " + "<img class='inlineShape' src='shape/signaler.png'/>" + " and your partner is in white " + "<img class='inlineShape' src='shape/receiver.png' />" + " ."
instr_text[3] = "At the beginning of each round, you and your partner will stand at different positions in a game board. <br><br>You will also see items in some of the grids."
instr_text[4] = "Besides the game board, you will also see the target for this round. For example, \"Target: <img class='inlineShape' src='shape/redCircle.png'/> \". The target will be different for each round. <br><br>If either you or your partner successfully reach the target at the end of one round, both of you will receive 40 points as reward."
instr_text[5] = "To reach the target, you can choose to move by yourself. <br><br>You can move from grid to grid by taking steps to your left, right, top, or bottom. Each step will cost you 5 points. You cannot move diagonally. You cannot move outside the grid. <br><br>You can try to move by yourself on the next page."
instr_text[6] = "";
instr_text[7] = "Good job! Now that you know how to move by yourself!<br><br>If you don't want to move, you can ask your partner to move. <br><br>However, you are the only person that knows the target for each round. Your partner does not know the target. <br><br>You have the option to send one of the given signals to your partner. The signal can give partial information about the target. There is no cost for sending a signal."
instr_text[8] = "After you send the signal, your partner will try its best to reach the target given the information you provided. <br><br>Each step that your partner takes will also cost 5 points. <br><br>You can try to send a signal on the next page."
instr_text[9] = "";
instr_text[10] = "Nice! Now that you know how to send a signal to your partner.<br><br>If you decide that it is too costly for either of you to move towards the target. You have the option to QUIT this round. Neither of you will lose or receive point if you choose to quit. ";
instr_text[11] = "At the end of the experiment, you will get a compensate of the total score / 100 in dollars. <br><br> For example, if you received 570 points in total, you will receive $5.7 at the end of the experiment."
instr_text[12] = "";
instr_text[13] = "By clicking on the NEXT button, I am acknowledged and hereby accept the terms. I understand the task in this experiment.";
instr_text[14] = "Please start the practice rounds on the next page.";
instr_text[15] = "";
instr_text[16] = "You have finished all the practice rounds. You are now ready for the experiment. Good luck!";
instr_text[17] = "";
instr_text[18] = "Thank you for completing this experiment!";


const INSTR_FUNC_DICT = {
    0: HIDE_BACK_BUTTON,
    1: SHOW_BACK_BUTTON,
    2: HIDE_EXAMPLE_GRID,
    3: SHOW_EXAMPLE_GRID,
    4: HIDE_EXAMPLE_GRID,
    5: SHOW_INSTR, 
    6: TRY_MOVE,
    7: SHOW_INSTR,
    8: SHOW_INSTR,
    9: TRY_SAY,
    10: SHOW_INSTR,
    12: SHOW_INSTR_QUESTION, 
    13: SHOW_CONSENT,
    14: SHOW_INSTR,
    15: START_PRACTICE_TRIAL,
    16: SHOW_INSTR,
    17: START_EXPT,
    18: SHOW_INSTR
};

function HIDE_BACK_BUTTON(){
    $("#instrBackBut").hide();
}

function SHOW_BACK_BUTTON(){
    $("#instrBackBut").show();
}

function HIDE_EXAMPLE_GRID() {
    $("#examGrid").hide();
}

function SHOW_EXAMPLE_GRID() {
    $("#examGrid").css("display", "block");
}

function SHOW_INSTR() {
    HIDE_CONSENT();
    HIDE_INSTR_Q();
    RESET_INSTR();
    RESET_TRYMOVE_SIGNALER();
    RESET_TRYMOVE_RECEIVER();
    RESET_GAMEBOARD(); 
}

function HIDE_CONSENT() {
    $("#consent").hide();
}

function HIDE_INSTR_Q() {
    $("#instrQBox").hide();
}
function RESET_INSTR() {
    $("#instrText").show();
    $("#instrNextBut").show();
    $("#tryExptPage").hide();
}

function SHOW_CONSENT() {
    $("#consent").show();
    HIDE_INSTR_Q()
    RESET_INSTR();
}

function SHOW_INSTR_QUESTION() {
    HIDE_CONSENT();
    $("#instrText").show();
    $("#instrNextBut").hide();
    $("#instrQBox").show();
}

function SUBMIT_INSTR_Q() {
    var instrChoice = $("input[name='instrQ']:checked").val();
    if (typeof instrChoice === "undefined") {
        $("#instrQWarning").text("Please answer the question. Thank you!");
    } else if (instrChoice == "several") {
        qAttemptNum++;
        $("#instrQWarning").text("Correct! Please click on NEXT to start the practice trial!");
        instr.next();
    } else {
        qAttemptNum++;
        $("#instrQWarning").text("You have given an incorrect answer. Please try again.");
    }
}

var instr_options = {
    text: instr_text,
    funcDict: INSTR_FUNC_DICT,
    qConditions: ['onlyQ'],
};