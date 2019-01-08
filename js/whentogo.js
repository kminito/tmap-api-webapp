function whentogo() {
  initMap();
  map = new Tmap.Map({
    div: "map", // map을 표시해줄 div
    height: "500px"
  });

  // map.setCenter(new Tmap.LonLat("126.986072", "37.570028").transform("EPSG:4326", "EPSG:3857"), 15);//설정한 좌표를 "EPSG:3857"로 좌표변환한 좌표값으로 즁심점으로 설정합니다.

  var markerStartLayer = new Tmap.Layer.Markers("start"); //마커 레이어 생성
  map.addLayer(markerStartLayer); //map에 마커 레이어 추가

  var size = new Tmap.Size(24, 38); //아이콘 크기 설정
  var offset = new Tmap.Pixel(-(size.w / 2), -size.h); //아이콘 중심점 설정
  var icon = new Tmap.IconHtml(
    "<img src=http://tmapapis.sktelecom.com/upload/tmap/marker/pin_r_m_s.png />",
    size,
    offset
  ); //마커 아이콘 설정
  var marker_s = new Tmap.Marker(
    new Tmap.LonLat(startX, startY).transform("EPSG:4326", "EPSG:3857"),
    icon
  ); //설정한 좌표를 "EPSG:3857"로 좌표변환한 좌표값으로 설정합니다.
  markerStartLayer.addMarker(marker_s); //마커 레이어에 마커 추가

  var markerEndLayer = new Tmap.Layer.Markers("end"); // 마커 레이어 생성
  map.addLayer(markerEndLayer); //map에 마커 레이어 추가

  var size = new Tmap.Size(24, 38); //아이콘 크기 설정
  var offset = new Tmap.Pixel(-(size.w / 2), -size.h); //아이콘 중심점 설정
  var icon = new Tmap.IconHtml(
    "<img src=http://tmapapis.sktelecom.com/upload/tmap/marker/pin_r_m_e.png />",
    size,
    offset
  ); //마커 아이콘 설정
  var marker_e = new Tmap.Marker(
    new Tmap.LonLat(endX, endY).transform("EPSG:4326", "EPSG:3857"),
    icon
  ); //설정한 좌표를 "EPSG:3857"로 좌표변환한 좌표값으로 설정합니다.
  markerEndLayer.addMarker(marker_e); //마커 레이어에 마커 추가

  var headers = {};
  headers["appKey"] = authKey; //실행을 위한 키 입니다. 발급받으신 AppKey를 입력하세요.
  headers["Content-Type"] = "application/json";
  var urlStr =
    "https://api2.sktelecom.com/tmap/routes/prediction?version=1&reqCoordType=WGS84GEO&resCoordType=EPSG3857&format=xml"; //타임머신 자동차 길 안내 api 요청 url입니다. 요청 좌표계 유형을 WGS84GEO로 지정합니다.
  var params = JSON.stringify({
    routesInfo: {
      //길 안내 요청 정보 입니다.
      departure: {
        name: "출발지",
        lon: startX,
        lat: startY
      },
      destination: {
        name: "도착지",
        lon: endX,
        lat: endY
      },

      predictionType: "departure",
      predictionTime: departureTime,

      //경로탐색 시 우선순위를 정하는 옵션입니다.
      searchOption: "00"
    }
  });

  if (passList) {
    var wayPoints = {
      wayPoint: [
        {
          lon: wayX,
          lat: wayY
        }
      ]
    };

    let parsed = JSON.parse(params);
    parsed.routesInfo.wayPoints = wayPoints;
    params = JSON.stringify(parsed);
  }

  var prtcl;
  $.ajax({
    method: "POST",
    url: urlStr,
    headers: headers,
    async: false,
    data: params,

    success: function(response) {
      prtcl = response;

      // 결과 출력
      var prtclString = new XMLSerializer().serializeToString(prtcl); //xml to String
      (xmlDoc = $.parseXML(prtclString)),
        ($xml = $(xmlDoc)),
        ($intRate = $xml.find("Document"));

      var tDistance =
        "총 거리 : " +
        (
          $intRate[0].getElementsByTagName("tmap:totalDistance")[0]
            .childNodes[0].nodeValue / 1000
        ).toFixed(1) +
        "km,";
      var tTime =
        " 총 시간 : " +
        (
          $intRate[0].getElementsByTagName("tmap:totalTime")[0].childNodes[0]
            .nodeValue / 60
        ).toFixed(0) +
        "분";

      document.querySelector(".main__header__result").innerText =
        tDistance + tTime;

      prtcl = new Tmap.Format.KML({
        extractStyles: true,
        extractAttributes: true
      }).read(prtcl); //데이터(prtcl)를 읽고, 벡터 도형(feature) 목록을 리턴합니다.
      var routeLayer = new Tmap.Layer.Vector("route"); // 백터 레이어 생성
      //표준 데이터 포맷인 KML을 Read/Write 하는 클래스 입니다.
      //벡터 도형(Feature)이 추가되기 직전에 이벤트가 발생합니다.
      routeLayer.events.register(
        "beforefeatureadded",
        routeLayer,
        onBeforeFeatureAdded
      );
      function onBeforeFeatureAdded(e) {
        var style = {};
        switch (e.feature.attributes.styleUrl) {
          case "#pointStyle":
            // style.externalGraphic = "http://topopen.tmap.co.kr/imgs/point.png"; //렌더링 포인트에 사용될 외부 이미지 파일의 url입니다.
            // style.graphicHeight = 16;//외부 이미지 파일의 크기 설정을 위한 픽셀 높이입니다.
            // style.graphicOpacity = 1;//외부 이미지 파일의 투명도 (0-1)입니다.
            // style.graphicWidth = 16;//외부 이미지 파일의 크기 설정을 위한 픽셀 폭입니다.
            break;
          default:
            style.strokeColor = "#ff0000"; //stroke에 적용될 16진수 color
            style.strokeOpacity = "1"; //stroke의 투명도(0~1)
            style.strokeWidth = "5"; //stroke의 넓이(pixel 단위)
        }
        e.feature.style = style;
      }

      routeLayer.addFeatures(prtcl); //레이어에 도형을 등록합니다.
      map.addLayer(routeLayer); //맵에 레이어 추가

      if (passList) {
        // 경유지 심볼 찍기
        var markerWaypointLayer = new Tmap.Layer.Markers("waypoint"); // 마커 레이어 생성
        map.addLayer(markerWaypointLayer); //map에 레이어에 마커 추가

        var size = new Tmap.Size(24, 38); //아이콘 크기 설정
        var offset = new Tmap.Pixel(-(size.w / 2), -size.h); //아이콘 중심점 설정
        var icon = new Tmap.IconHtml(
          "<img src=http://tmapapis.sktelecom.com/upload/tmap/marker/pin_b_m_p.png />",
          size,
          offset
        ); //마커 아이콘 설정
        var marker = new Tmap.Marker(
          new Tmap.LonLat(String(wayX), String(wayY)).transform(
            "EPSG:4326",
            "EPSG:3857"
          ),
          icon
        ); //설정한 좌표를 "EPSG:3857"로 좌표변환한 좌표값으로 설정합니다.

        markerWaypointLayer.addMarker(marker); //마커 레이어에 마커 추가
      }

      map.zoomToExtent(routeLayer.getDataExtent()); //map의 zoom을 routeLayer의 영역에 맞게 변경합니다.
    }
  });
}
