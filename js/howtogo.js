function findPath2(){


    // 지도 삽입 전 map div 초기화
    initMap()



    var map = new Tmap.Map({
         div:'map',  // 결과 지도를 표시할 곳
         height: "500px"
     });

     var prtcl;
     var headers = {};

     headers["appKey"]=authKey; // 발급받은 인증키를 넣어야 한다
     $.ajax({
         method:"POST",
         headers : headers,
         url:"https://api2.sktelecom.com/tmap/routes?version=1&format=xml",
         async:false,
         data:{
             startX : startX,
             startY : startY,
             endX : endX,
             endY : endY,
             passList : passList,
             reqCoordType : "WGS84GEO",
             resCoordType : "EPSG3857",
             angle : "172",
             searchOption : "0",
             trafficInfo : "Y" //교통정보 표출 옵션입니다.
         },

         success:function(response){ //API가 제대로 작동할 경우 실행될 코드
             prtcl = response;

             var prtclString = new XMLSerializer().serializeToString(prtcl);//xml to String
             xmlDoc = $.parseXML( prtclString ),
             $xml = $( xmlDoc ),
             $intRate = $xml.find("Document");

             var tDistance = " 총 거리 : "+($intRate[0].getElementsByTagName("tmap:totalDistance")[0].childNodes[0].nodeValue/1000).toFixed(1)+"km,";
             var tTime = " 예상 소요 시간 : "+($intRate[0].getElementsByTagName("tmap:totalTime")[0].childNodes[0].nodeValue/60).toFixed(0)+"분";
         
            document.querySelector(".main__header__result").innerText = tDistance+ tTime

             // 실시간 교통정보 추가
             var trafficColors = {
                 extractStyles:true,
                 /* 실제 교통정보가 표출되면 아래와 같은 Color로 Line이 생성됩니다. */
                 trafficDefaultColor:"#000000", //Default
                 trafficType1Color:"#009900", //원활
                 trafficType2Color:"#8E8111", //지체
                 trafficType3Color:"#FF0000", //정체
             };    
             var kmlForm = new Tmap.Format.KML(trafficColors).readTraffic(prtcl);
             routeLayer = new Tmap.Layer.Vector("vectorLayerID"); //백터 레이어 생성
             routeLayer.addFeatures(kmlForm); //교통정보를 백터 레이어에 추가   

             map.addLayer(routeLayer); // 지도에 백터 레이어 추가

             // 경로탐색 결과 반경만큼 지도 레벨 조정
             map.zoomToExtent(routeLayer.getDataExtent());
         },
         error:function(request,status,error){ // API가 제대로 작동하지 않을 경우
         console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
         }
     });
 }
 