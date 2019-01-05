var startName;
var startX;
var startY;

var endName;
var endX;
var endY;

var wayName;
var wayX;
var wayY;

var passList = null;

var departureTime;

// 언제갈까 실행시 시간을 얻음
function getTimeAfter() {
  var timeAfter = new Date();
  console.log("현재시각 : " + timeAfter);
  timeAfter.setHours(timeAfter.getHours() + timeOffset);
  console.log("1시간 후 시각 : " + timeAfter);
  return timeAfter.toISOString().slice(0, -5) + "+0000";
}

var idToLoc = function(route) {
  startX = places[route[0]].locX;
  startY = places[route[0]].locY;

  endX = places[route[1]].locX;
  endY = places[route[1]].locY;

  startName = places[route[0]].name;
  endName = places[route[1]].name;

  if (route[2]) {
    wayName = places[route[2]].name;
    wayX = places[route[2]].locX;
    wayY = places[route[2]].locY;
  }
};

// 버튼 만들기
var renderButtons = function() {
  try {
    document.getElementById("button1").innerText =
      places[route1[0]].name + " -> " + places[route1[1]].name;
  } catch {
    console.log("1번 버튼 생성 오류");
    alert("탐색 경로를 확인해주세요.");
  }

  try {
    document.getElementById("button2").innerText =
      places[route2[0]].name + " -> " + places[route2[1]].name;
  } catch {
    console.log("2번 버튼 생성 오류");
  }
};

// 경로탐색 전 MAP div 초기화 -> 고양이 사진 삭제 및 투명도 0% 설정
var initMap = function() {
  document.querySelector(".main__map").classList.remove(".main__map-empty"); //강아지 배경 삭제 (클래스 토글)
  document.querySelector("#map").innerHTML = ""; //기존 지도 삭제
};

document.getElementById("button1").onclick = function() {
  idToLoc(route1);

  if (document.querySelector("#checkbox2:checked")) {
    passList = String(wayX) + "," + String(wayY);
  } else {
    passList = null;
  }

  if (document.querySelector("#checkbox1:checked")) {
    departureTime = getTimeAfter();
    return whentogo();
  } else {
    return findpath();
  }
};

document.getElementById("button2").onclick = function() {
  try {
    //route2가 있으면 작동
    idToLoc(route2);

    if (document.querySelector("#checkbox2:checked")) {
      passList = String(wayX) + "," + String(wayY);
    } else {
      passList = null;
    }

    if (document.querySelector("#checkbox1:checked")) {
      departureTime = getTimeAfter();
      return whentogo();
    } else {
      return findpath();
    }
  } catch {}
};

renderButtons();
