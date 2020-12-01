
function LIST_TO_FORMATTED_STRING(data_list, divider) {
    divider = (divider === undefined) ? '\t' : divider;
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
  #####  #     # ######        # #######  #####  ####### 
 #     # #     # #     #       # #       #     #    #    
 #       #     # #     #       # #       #          #    
  #####  #     # ######        # #####   #          #    
       # #     # #     # #     # #       #          #    
 #     # #     # #     # #     # #       #     #    #    
  #####   #####  ######   #####  #######  #####     #    
                                                         
*/


class subjObject {
    constructor(options = {}) {
        Object.assign(this, {
            num: "pre-post",
            subjNumScript: "subjNum.php",
            subjNumFile: "",
            titles: [""],
            invalidIDFunc: false,
            validIDFunc: false, //not sure the use of it, no input function
            viewportMinW: 0,
            viewportMinH: 0,
            savingScript: "save.php",
            attritionFile: "attrition.txt",
            visitFile: "visit.txt",
            subjFile: "subj.txt",
            savingDir: "data/testing",
            handleVisibilityChange: function(){},
        }, options);
        if (this.num == "pre-post") {
            this.obtainSubjNum(this.subjNumScript, this.subjNumFile);
        }
        this.data = LIST_TO_FORMATTED_STRING(this.titles);
        this.dateObj = new Date();
        this.date = FORMAT_DATE(this.dateObj, "UTC", "-", true);
        this.startTime = FORMAT_TIME(this.dateObj, "UTC", ":", true);
        this.userAgent = window.navigator.userAgent;
        this.hiddenCount = 0;
        this.hiddenDurations = [];
    }

    obtainSubjNum(subjNumScript, subjNumFile) {
        var that = this;
        function SUBJ_NUM_UPDATE_SUCCEEDED(number) {
            that.num = number;
        }
        function SUBJ_NUM_UPDATE_FAILED() {
            that.num = -999;
        }
        POST_DATA(subjNumScript, { 'directory_path': this.savingDir, 'file_name': this.subjNumFile }, SUBJ_NUM_UPDATE_SUCCEEDED, SUBJ_NUM_UPDATE_FAILED);
    }

    saveVisit() {
        var data = "subjNum\tstartDate\tstartTime\tid\tuserAgent\tinView\tviewportW\tviewportH\n";
        this.viewport = this.viewportSize;
        this.inView = this.viewport["inView"];
        this.viewportW = this.viewport["w"];
        this.viewportH = this.viewport["h"];
        var dataList = [this.num, this.date, this.startTime, this.id, this.userAgent, this.inView, this.viewportW, this.viewportH];
        data += LIST_TO_FORMATTED_STRING(dataList);
        var postData = {
            "directory_path": this.savingDir,
            "file_name": this.visitFile,
            "data": data
        };
        $.ajax({
            type: "POST",
            url: this.savingScript,
            data: postData,
        });
    }

    getID(get_variable) {
        var id = GET_PARAMETERS(get_variable, null);
        var invalid_id = (id == null);
        if (!invalid_id) {
            id = id.replace(/\s+/g, '');
            invalid_id = (id == '');
        }
        if (invalid_id) {
            if (this.invalidIDFunc !== false) {
                this.invalidIDFunc();
            }
            return null;
        } else {
            
            if (this.validIDFunc !== false) {
                this.validIDFunc();
            }
            return id;
        }
    }

    checkID(id) {
        var invalid_id = (id == null);
        if (!invalid_id) {
            id = id.replace(/\s+/g, '');
            invalid_id = (id == '');
        }
        if (invalid_id) {
            return null;
        } else {
            return id;
        }
    }

    get phone() { // getter runs when you ask for the property
        var md = new MobileDetect(this.userAgent);
        return md.mobile() ? true : false;
    }

    get viewportSize() {
        var w = $(window).width();
        var h = $(window).height();
        var inView = (w >= this.viewportMinW) && (h >= this.viewportMinH);
        return { "h": h, "w": w, "inView": inView };
    }

    saveAttrition() {
        var data = 'subjNum\tstartDate\tstartTime\tid\tuserAgent\tinView\tviewportW\tviewportH\n';
        this.viewport = this.viewportSize;
        this.inView = this.viewport['inView'];
        this.viewportW = this.viewport['w'];
        this.viewportH = this.viewport['h'];
        var dataList = [this.num, this.date, this.startTime, this.id, this.userAgent, this.inView, this.viewportW, this.viewportH];
        data += LIST_TO_FORMATTED_STRING(dataList);
        var postData = {
            'directory_path': this.savingDir,
            'file_name': this.attritionFile,
            'data': data
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }

    submitQ() {
        var endTimeObj = new Date();
        this.endTime = FORMAT_TIME(endTimeObj, 'UTC', ':', true);
        this.duration = (endTimeObj - this.dateObj) / 60000; // in minutes
        var dataList = LIST_FROM_ATTRIBUTE_NAMES(this, this.titles);
        this.data += LIST_TO_FORMATTED_STRING(dataList);
        var postData = {
            'directory_path': this.savingDir,
            'file_name': this.subjFile,
            'data': this.data
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }

    detectVisibilityStart() {
        var that = this;
        document.addEventListener('visibilitychange', that.handleVisibilityChange);
    }

    detectVisibilityEnd() {
        var that = this;
        document.removeEventListener('visibilitychange', that.handleVisibilityChange);
    }
}

const SUBJ_TITLES = ['num',
                     'date',
                     'startTime',
                     //'id',
                     'userAgent',
                     'endTime',
                     'duration',
                     'instrQAttemptN',
                     'instrReadingTimes',
                     'quickReadingPageN',
                     'hiddenCount',
                     'hiddenDurations',
                     'daily',
                     'aqResponses',
                     'aqRt',
                     'serious',
                     'problems',
                     'gender',
                     'age',
                     'inView',
                     'viewportW',
                     'viewportH'
                    ];

function INVALID_ID_FUNC() {
    $("#instrText").html("We can't identify a valid code from subject pool website. Please reopen the study from the subject pool website again. Thank you!");
    $("#instrBut").hide();
    $("#instrPage").show();
}
function HANDLE_VISIBILITY_CHANGE() {
    if (document.hidden) {
        subj.hiddenCount += 1;
        subj.hiddenStartTime = Date.now();
    } else  {
        subj.hiddenDurations.push((Date.now() - subj.hiddenStartTime)/1000);
    }
}
var subj_options = {
    subjNumFile: SUBJ_NUM_FILE,
    titles: SUBJ_TITLES,
    invalidIDFunc: INVALID_ID_FUNC,
    viewportMinW: VIEWPORT_MIN_W,
    viewportMinH: VIEWPORT_MIN_H,
    savingScript: SAVING_SCRIPT,
    visitFile: VISIT_FILE,
    attritionFile: ATTRITION_FILE,
    subjFile: SUBJ_FILE,
    savingDir: SAVING_DIR,
    handleVisibilityChange: HANDLE_VISIBILITY_CHANGE
};