const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// The End Of The Year Date To Countdown To
// 1000 milliseconds = 1 Second

// let countDownDate = new Date("Mar 29, 2022 23:59:59").getTime();
let countDownDate = new Date().getTime() + (10*60*1000);
// console.log(countDownDate);

let counter = setInterval(() => {
    // Get Date Now
    let dateNow = new Date().getTime();

    // Find The Date Difference Between Now And Countdown Date
    let dateDiff = countDownDate - dateNow;

    // Get Time Units
    // let days = Math.floor(dateDiff / 1000 / 60 / 60 / 24);
    let days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((dateDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((dateDiff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((dateDiff % (1000 * 60)) / 1000);

    document.querySelector(".day").innerHTML = days < 10 ? `0${days}` : days;
    document.querySelector(".hour").innerHTML = hours < 10 ? `0${hours}` : hours;
    document.querySelector(".minute").innerHTML = minutes < 10 ? `0${minutes}` : minutes;
    document.querySelector(".second").innerHTML = seconds < 10 ? `0${seconds}` : seconds;
    

    if (dateDiff <= 0) {
        // console.log("ENDED");
        window.location.reload();
        // clearInterval(counter);
    }
}, 1000);

function reload(){
    window.location.reload();
}


var myWords = ["EGG","MILK","BUTTER","JAM","OATS","SUGAR","BREAD","RUSK","ROLL","PRETTY","DICE"];


var tempWords = [];
var selectedWord = "";
var score = 0;
var doneWord = [];
var tempRow = -1;
var tempCol = -1;
var pos = true;
var cur = -1;
var prev = -1;
var cnt = 0;

$(document).ready(function(){
    arrangeGame();

    $(".individual").click(function(){
        
        if((tempRow == -1 && tempCol == -1) || pos){
            // if(tempRow)
            if(tempRow != -1 ){
                tempRow = $(this).data("row");
                tempCol = $(this).data("column");
                cur = tempRow*13 + tempCol;
                pos = false;
                diff = cur - prev ;
            }
            else{
                tempRow = $(this).data("row");
                tempCol = $(this).data("column");
                prev  = 13*tempRow + tempCol;
            }

            $(this).addClass("colorPurple");
            selectedWord += $(this).html();
            // console.log(selectedWord);
        }
        else{
            prev = cur;
            tempRow = $(this).data("row");
            tempCol = $(this).data("column");
            cur = 13*tempRow + tempCol;

            if(cur - prev != diff){}

            else{

                $(this).addClass("colorPurple");
                selectedWord += $(this).html();
                // console.log(selectedWord);
            }
        }
    });

    $(document).keydown(function(){
        if(cnt == 1){
            $(".individual").removeClass("colorPurple");
        }
        cnt = 0;
    }).keyup(function(){
        cnt = 1;
        var local = selectedWord;

        if(selectedWord.length > 2){
            fetch(`${url}${selectedWord}`)
            .then((response) => {
                if (response.status >= 200 && response.status <= 299) {
                    return response.json();
                } 
                else{
                    throw Error(response.statusText);
                }
            })
            .then((data) => {
                    if(doneWord.indexOf(local) == -1){
                        $(".colorPurple").addClass("correctlySelected");
                        $(this).addClass("done");
                        doneWord.push(local);
                        // console.log(doneWord);
                        score += 1 ; 
                        document.getElementById("score").innerHTML = score;
                        // console.log(score);
                    }
            }).catch((error) => {});
        }
        tempRow = -1;
        tempCol = -1;
        pos = true;

                    // found all the words correctly
        //         // if($(".done").length == myWords.length){
        //         //     $("#hint").empty();
        //         //     $("#hint").append("<p id = message > you killed it 🔥 🔥 🔥</p>")
        //         // }
        //     });
        // }
        selectedWord = "";
    });    
});



function arrangeGame()
{
    $.each(myWords, function(key, item){
        $("#hint").append("<p>"+item+"</p>"); 
    });

    for(var i = 1;i<=13;i++)
    {
        for(var j = 1;j<=13;j++)
        {
            $("#letters").append("<div class = individual data-row=" + i + " data-column=" + j + "></div>");
        }
    }

    placeCorrectLetters(myWords);
    // console.log("end of first array \n");
    placeCorrectLetters(tempWords);

    $.each($(".individual"),function(key,item){
        if($(item).attr("data-word") == undefined){
            $(this).html(randomLetter());
        }
    })
}



function randomLetter(){
    var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabets.charAt(Math.floor(Math.random()*26));
}



function checkOccupied(word,starting,orientation){
    var status= "";
    var incrementBy=0;
    
    if(orientation=="row"){
        incrementBy = 1;
    }
    
    else if(orientation=="column"){
        incrementBy = 13;
    }
    
    else if(orientation == "diagonal"){
        incrementBy = 14;
    }
    
    for(var p = starting,q=0; q<word.length;q++){
        if($(".individual:eq(" + p + ")").attr("data-word") == undefined){
            status = "empty";
        }
        else{
            status = "occupied";
            break;
        }
        p += incrementBy;
    } 
    return status;
}



function placeCorrectLetters(myArr)
{
    var positions = ["row", "column", "diagonal" ];
    var nextLetter = 0;
    var newStart = 0;

    for(var i = 0; i < myArr.length;i++)
    {
        var orientation = positions[Math.floor(Math.random()*positions.length)];
        // alert(orientation);
        
        var start = Math.floor(Math.random()*$(".individual").length);
        
        var myRow = $(".individual:eq(" + start +")").data("row");
        var myColumn = $(".individual:eq(" + start +")").data("column");



        // $(".individual:eq(" + start +")").html("A");
        // console.log(myArr[i] + " : " + orientation + ": " + start + " : " + myRow + " : " + myColumn);

        //Row Orientation
        if(orientation == "row")
        { 
            nextLetter = 1;
            
            if((myColumn*1) + myArr[i].length <= 13)
            {
                newStart = start;
                // console.log("space in row : "+ myArr[i] + " : " + start + " : " + myColumn); 
            }
            else
            {
                var newColumn = 13 - myArr[i].length;
                newStart = $(".individual[data-row=" + myRow + "][data-column=" + newColumn + "]").index();
                // console.log(" no space in row : "+ myArr[i] + " : " + start + " : " + myColumn + " : " + newStart);
            }
        }

        //Column Orientation
        else if (orientation == "column")
        {
            nextLetter = 13;
                        
            if((myRow*1) + myArr[i].length<=13)
            {
                newStart = start;
                // console.log("space in column : "+ myArr[i] + " : " + start + " : " + myRow);
            }
            else
            {
                var newRow = 13 - myArr[i].length;
                newStart = $(".individual[data-row=" + newRow + "][data-column=" + myColumn + "]").index();
                // console.log("no space in column : "+ myArr[i] + " : " + start + " : " + myRow + " : " + newStart);
            }
        }

        //Diagonal Orientation
        else if (orientation == "diagonal"){
            nextLetter = 14;
            
            if(((myColumn*1) + myArr[i].length <= 13) && ((myRow*1) + myArr[i].length <= 13)){
                newStart=start;
            }
            
            if((myColumn*1) + myArr[i].length > 13){
                var newColumn = 13-myArr[i].length;
                newStart=$(".individual[data-row=" + myRow + "][data-column=" + newColumn + "]").index();
            }
                    
            if((myRow*1) + myArr[i].length > 13){
                var newRow = 13-myArr[i].length;
                newStart = $(".individual[data-row=" + newRow + "][data-column=" + myColumn + "]").index();
            }
            
            if(((myColumn*1) + myArr[i].length > 13) && ((myRow*1) + myArr[i].length > 13)){
                var newColumn = 13-myArr[i].length;
                var newRow = 13-myArr[i].length;
                newStart = $(".individual[data-row=" + newRow + "][data-column=" + newColumn + "]").index();
            }
        }        

        var characters = myArr[i].split("");
        var nextPosition = 0;
        var occupied = checkOccupied(myArr[i], newStart, orientation);

        if(occupied=="empty"){
            $.each(characters,function(key,item){
                // console.log(item);
                $(".individual:eq(" + (newStart + nextPosition) + ")" ).html(item);
                $(".individual:eq(" + (newStart + nextPosition) + ")" ).attr("data-word",myArr[i]);
                // $(".individual:eq(" + (newStart + nextPosition) + ")" ).css("background","pink");
                nextPosition += nextLetter;
            })
        }
        else{
            tempWords.push(myArr[i]);
        }
        // console.log(tempWords);
    }
}

