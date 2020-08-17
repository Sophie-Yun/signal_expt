const GRID_NROW = 10;
const GRID_NCOL = 9;
var trial = [
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

trial[1][3] = "shape/greenCircle.png";
trial[1][7] = "shape/purpleTriangle.png";

$(document).ready(function() {
    instr = new instrObject(instr_options);
    instr.start();
});

/*                              
 # #    #  ####  ##### #####  
 # ##   # #        #   #    # 
 # # #  #  ####    #   #    # 
 # #  # #      #   #   #####  
 # #   ## #    #   #   #   #  
 # #    #  ####    #   #    # 
*/
var instr_text = new Array;
instr_text[0] = "<strong>Welcome to this experiment!</strong><br><br>This experiment tests on how people communicate when they collaborate to achieve a goal."
instr_text[1] = "Your contribution would greatly help us identify communication patterns in human cooperation. The results of the study might also be applied to building artificial intelligence.<br><br>Please carefully read the instructions on the next few pages. There will be a question that asks you about the instructions later."
instr_text[2] = "This study takes about 10 minutes.<br><br>On each page, you will see a grid with figures in different shapes and different colors at random positions. The letter \"S\" indicates where you stand. The letter \"R\" indicates where a robot stands. The robot is your teammate for this task.<br><br>You will also see a message that tells you what is your target figure for this round. You are the only one who can see the message, while the robot cannot see the message. Your task is to reach the target figure through either walking to the target figure by yourself, or sending only one of the given signals to the robot to let it reach the target figure. <br><br>If either of you successfully reaches the goal, you both get rewards of 20 points. Otherwise, you do not get points. However, each step taken by either of you will result in a penalty of 1 point."
instr_text[3] = "Here is one example of one round. (Will come up later.)"
instr_text[4] = "Which of the following is <b>not correct?</b> <br><br>You can achieve the goal by walking on your own.<br>If either the robot or you achieve the goal, you get 20 points.<br>Each step taken by either the robot or you costs 1 point.<br>You can achieve the goal by sending out several signals to the robot."
instr_text[5] = "Correct! Please click on NEXT to start the first round!"


//const INSTR_FUNC_DICT = {
//};

var instr_options = {
    text: instr_text,
    //funcDict: INSTR_FUNC_DICT,
};

class instrObject {
    constructor(options = {}) {
        Object.assign(this, {
            text: [],
            //funcDict: {},
            //qConditions: [],
        }, options);
        this.index = 0;
        //this.instrKeys = Object.keys(this.funcDict).map(Number);
        //this.qAttemptN = {};
       //for (var i=0;i<this.qConditions.length;i++){
         //   this.qAttemptN[this.qConditions[i]] = 1;
        //}
        //this.readingTimes = [];
    }

    start(textBox = $("#instrPage"), textElement = $("#instrText")) {
        textElement.html(this.text[0]);
        //if (this.instrKeys.includes(this.index)) {
          //  this.funcDict[this.index]();
        //}
        textBox.show();
    }

    next(textElement = $("#instrText")) {
        //this.readingTimes.push((Date.now() - this.startTime)/1000);
        this.index += 1;
        $("#instrPage").hide();
        CREATE_GRID(trial, GRID_NROW, GRID_NCOL);
        $("#exptPage").show();/*
        if (this.index < this.text.length) {
            textElement.html(this.text[this.index]);
            //if (this.instrKeys.includes(this.index)) {
              //  this.funcDict[this.index]();
            //}
            //this.startTime = Date.now();
        } else {
            $("#instrPage").hide();
            $("#exptPage").show();
        }*/
    }
}

/*
                            
 ###### #    # #####  ##### 
 #       #  #  #    #   #   
 #####    ##   #    #   #   
 #        ##   #####    #   
 #       #  #  #        #   
 ###### #    # #        #   
                            
*/

