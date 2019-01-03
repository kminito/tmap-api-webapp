
var startName;
var startX;
var startY;

var endName;
var endX;
var endY;

var wayName;
var wayX;
var wayY;

//
var passList = null;

var timeOffset = 1 //1시간 후의 경로 탐색

var timeCrntISO; // 현재 시간 UTC 기준 값
var timeAfterISO; // offset 후의 시간 UTC 기준 값

var timeCrntText; //위의 값을 hh시 mm분 형태로 변환
var timeAfterText; //위의 값을 hh시 mm분 형태로 변환


function getTimeISO(){
    var today= new Date()
    timeCrntISO = today.toISOString().slice(0,-5)+"+0000"
    timeCrntText = today.getHours() + "시 " + today.getHours() +"분"
    
    var timeAfter = new Date()
    timeAfter.setHours(timeAfter.getHours()+timeOffset)
    timeAfterISO = timeAfter.toISOString().slice(0,-5)+"+0000"
    timeAfterText = timeAfter.getHours() + "시 " + timeAfter.getHours() +"분"
}


var idToLoc = function(start, end, way){ //출발, 도착, 경유지의 id

        startName = places[start].name
        startX = places[start].locX
        startY = places[start].locY

        endName = places[end].name
        endX = places[end].locX
        endY = places[end].locY
        
        wayName = places[way].name
        wayX = places[way].locX
        wayY = places[way].locY
}


getTimeISO()
idToLoc("workplace","home","samsan")


var renderButtons = function(){
    document.getElementById("button1").innerText = startName +" -> " + endName; 
}

renderButtons()


document.querySelector("#map").style.backgroundImage = "url('images/bg-puppy.jpg')"
document.querySelector("#map").style.opacity = 0.7;

var initMap = function(){
    document.querySelector("#map").innerHTML = ""
    document.querySelector("#map").style.backgroundImage = ""
    document.querySelector("#map").style.opacity = 1;
}


document.getElementById("button1").onclick = function(){
        findPath2();
}
