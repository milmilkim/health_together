import React, { useRef, useEffect } from 'react';

const Map = ({ lat, lng }) => {
  const { kakao } = window;

  const options = {
    center: new kakao.maps.LatLng(lat, lng), //중심위치 초기 설정(카카오)
    level: 3,
  };

  const container = useRef(null);
  //useRef로 div map에 접근

  useEffect(() => {
    const map = new kakao.maps.Map(container.current, options); //지도 생성
    var locPosition = new kakao.maps.LatLng(lat, lng);
    map.setCenter(locPosition);
    // 마커가 표시될 위치입니다
    var markerPosition = new kakao.maps.LatLng(lat, lng);

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);

    //
    return () => {};
  }, [lat, lng]); //위도 경도 바뀔 때마다 실행

  return (
    <div
      className="map"
      style={{ width: '100%', height: '400px', zIndex: '0' }}
      ref={container}
    />
  );
};

export default Map;
