function CREATE_GRID(trial, nrow, ncol) {
    for (var row = 0; row < nrow; row++) {
        for (var col = 0; col < ncol; col++) {
            //$(".gridContainer").append("<div class='gridItem'></div>");
            if (trial[row][col]!= null){
                //$(".gridContainer").append("<div class='gridEmpty'></div>");
                $(".gridContainer").append($("<img>",{class: "gridItem shape", src: trial[row][col]}));
            }
            else
                $(".gridContainer").append("<div class='gridEmpty'></div>");
        };
    };
};