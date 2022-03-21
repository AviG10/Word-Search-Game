
var myWords = ["EGG","MILK","BUTTER","JAM","OATS","SUGAR","BREAD","RUSK"];
var tempWords = [];
var selectedWord = "";
var score = 0;

$(document).ready(function(){
    arrangeGame();

    $(".individual").click(function(){
        $(this).addClass("colorPurple");
        selectedWord += $(this).html();
        console.log(selectedWord);
    });

    $(document).keydown(function(){
        // var len = selectedWord.length;
        // console.log("Avijit");
//         selectedWord = "";
        $(".individual").removeClass("colorPurple");
    }).keyup(function(){
        if(myWords.indexOf(selectedWord) >= 0){
            $(".colorPurple").addClass("correctlySelected");
            
            $("#hint p").each(function(key ,item){
                if(selectedWord == $(item).html()){
                    alert($(this).html());
                    $(this).addClass("done");
                    score += 1 ;
                    console.log(score);
                }  
                        
                // found all the words correctly
                if($(".done").length == myWords.length){
                    $("#hint").empty();
                    $("#hint").append("<p id = message > you killed it 🔥 🔥 🔥</p>")
                }
            });
        }
        selectedWord = "";
    });    
});



function arrangeGame()
{
    $.each(myWords, function(key, item){
        $("#hint").append("<p>"+item+"</p>"); 
    });

    for(var i = 1;i<=12;i++)
    {
        for(var j = 1;j<=12;j++)
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
        incrementBy = 12;
    }
    
    else if(orientation == "diagonal"){
        incrementBy = 13;
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
            
            if((myColumn*1) + myArr[i].length <= 12)
            {
                newStart = start;
                // console.log("space in row : "+ myArr[i] + " : " + start + " : " + myColumn); 
            }
            else
            {
                var newColumn = 12 - myArr[i].length;
                newStart = $(".individual[data-row=" + myRow + "][data-column=" + newColumn + "]").index();
                // console.log(" no space in row : "+ myArr[i] + " : " + start + " : " + myColumn + " : " + newStart);
            }
        }

        //Column Orientation
        else if (orientation == "column")
        {
            nextLetter = 12;
                        
            if((myRow*1) + myArr[i].length<=12)
            {
                newStart = start;
                // console.log("space in column : "+ myArr[i] + " : " + start + " : " + myRow);
            }
            else
            {
                var newRow = 12 - myArr[i].length;
                newStart = $(".individual[data-row=" + newRow + "][data-column=" + myColumn + "]").index();
                // console.log("no space in column : "+ myArr[i] + " : " + start + " : " + myRow + " : " + newStart);
            }
        }

        //Diagonal Orientation
        else if (orientation == "diagonal"){
            nextLetter = 13;
            
            if(((myColumn*1) + myArr[i].length <= 12) && ((myRow*1) + myArr[i].length <= 12)){
                newStart=start;
            }
            
            if((myColumn*1) + myArr[i].length > 12){
                var newColumn = 12-myArr[i].length;
                newStart=$(".individual[data-row=" + myRow + "][data-column=" + newColumn + "]").index();
            }
                    
            if((myRow*1) + myArr[i].length > 12){
                var newRow = 12-myArr[i].length;
                newStart = $(".individual[data-row=" + newRow + "][data-column=" + myColumn + "]").index();
            }
            
            if(((myColumn*1) + myArr[i].length > 12) && ((myRow*1) + myArr[i].length > 12)){
                var newColumn = 12-myArr[i].length;
                var newRow = 12-myArr[i].length;
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
                $(".individual:eq(" + (newStart + nextPosition) + ")" ).css("background","pink");
                nextPosition += nextLetter;
            })
        }
        else{
            tempWords.push(myArr[i]);
        }
        // console.log(tempWords);
    }
}

