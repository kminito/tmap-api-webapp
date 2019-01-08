var startX; // 출발지 x 좌표
var startY; // 출발지 y 좌표

var endX; // 도착지 x 좌표
var endY; // 도착지 y 좌표

var wayX; // 경유지 x 좌표
var wayY; // 경유지 y 좌표

var passList = null; //경로탐색에 사용할 경유지. 경유지가 포함되어서 검색될 경우 이 변수에 경유지 리스트가 들어감.

var departureTime; //출발 시간을 담을 변수

// 언제갈까 실행시 시간을 얻음 (1시간))
function getTimeAfter() {
  var timeAfter = new Date();
  console.log("현재시각 : " + timeAfter);
  timeAfter.setHours(timeAfter.getHours() + timeOffset);
  console.log(timeOffset+"시간 후 시각 : " + timeAfter);
  return timeAfter.toISOString().slice(0, -5) + "+0000";
}

// date.js에 입력한 출발/도착/경유지의 해당 좌표를 변수에 입력토록 하는 함수
var idToLoc = function(route) {
  startX = places[route[0]].locX;
  startY = places[route[0]].locY;

  endX = places[route[1]].locX;
  endY = places[route[1]].locY;

  if (route[2]) {
    wayX = places[route[2]].locX;
    wayY = places[route[2]].locY;
  }
};

// 화면 버튼 만들기
var renderButtons = function() {
  try {
    document.getElementById("button1").innerText =
      places[route1[0]].name + " -> " + places[route1[1]].name;
  } catch {
    console.log("1번 버튼 생성 오류");
    alert("data.js 파일의 경로를 확인해주세요.");
  }

  try {
    document.getElementById("button2").innerText =
      places[route2[0]].name + " -> " + places[route2[1]].name;
  } catch {
    console.log("2번 버튼 생성 오류");
  }

  document.querySelector(".option-bar__column__checkbox").childNodes[1].childNodes[2].innerText = timeOffset+ "시간 후"
  document.querySelector(".option-bar__column__checkbox").childNodes[1].childNodes[7].innerText ="경유지 포함"
};







// 경로탐색 전 MAP div 초기화 -> 고야이 사진 삭제 및 투명도 0% 설정
var initMap = function() {
  document.querySelector(".main__map").classList.remove(".main__map-empty"); //고양이 배경 삭제 (클래스 토글)
  document.querySelector("#map").innerHTML = ""; //기존 지도 삭제
};


// 1번 버튼이 클릭되었을 경우
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


// 2번 버튼이 클릭되었을 경우 (위와 같음)
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




// 화면에 버튼을 만든다.
renderButtons();
