import React from 'react';
import { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import './WritePost';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  PageHeader,
  Radio,
  Space,
} from 'antd';
import axios from 'axios';
import LocalSeraching from 'components/LocalSearching';
import 'routes/WritePost.css';
import Swal from 'sweetalert2';
import { selectEvent } from 'components/Options';
import { getToken } from 'components/Token';
import { getEmail } from 'components/Token';
import { baseApiUrl } from 'components/Options';

const WritePost = ({ history }) => {
  const [post, setPost] = useState({
    addressName: '　',
    content: '',
    event: '',
    eventTime: '',
    locationX: '',
    locationY: '',
    needPeopleNum: 1,
    placeName: '　',
    region1Depth: '　',
    region2Depth: '　',
    title: '',
    email: '',
  }); //게시글

  const [visible, setVisible] = useState(false);

  const [inputLocation, setInputLocation] = useState(null);

  const { title, content } = post; //구조분해할당

  //------------------------onChange등등

  const onsubmitForm = async () => {
    await Swal.fire({
      title: '등록하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '등록',
      cancelButtonText: '취소',
    }).then(result => {
      if (result.isConfirmed) {
        try {
          axios.post(`${baseApiUrl}/api/board/posts`, post).then(() => {
            Swal.fire('저장 완료!', '', 'success');
            history.push('/');
          });
        } catch (error) {
          console.log('에러');
        }
      }
    });
  }; //전송하고 홈으로

  const onChangeDate = dateString => {
    const nextPost = {
      ...post,
      eventTime: dateString,
    };
    setPost(nextPost);
  }; //date picker

  const onChange = e => {
    const nextPost = {
      ...post,
      [e.target.name]: e.target.value,
      email: getEmail(),
    };
    setPost(nextPost);
  }; //제목과 내용

  const onChangeNumber = value => {
    console.log(value);
    const nextPost = {
      ...post,
      needPeopleNum: value,
    };
    setPost(nextPost);
  }; //인원수

  const onChangeEvent = value => {
    const nextPost = {
      ...post,
      event: value.value,
    };
    setPost(nextPost);
  }; //종목

  //--------------------위치 관련-------------------------

  const myLocation = () => {
    //클릭하면 나의 위치를 넘김

    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude; //위도 (y)
        var lng = position.coords.longitude; //경도 (x)

        getAddress(lat, lng);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '현재 위치를 불러올 수 없습니다!',
      });
    } //
  };

  const getAddress = async (lat, lng) => {
    const REST_API_KEY = 'b848a4ccc1802d07fa250ac646972888';

    await axios({
      method: 'get',
      url: 'https://dapi.kakao.com//v2/local/geo/coord2address',
      headers: { Authorization: 'KakaoAK ' + REST_API_KEY },
      params: {
        x: lng,
        y: lat,
      },
    }).then(res => {
      const myAddress = res.data.documents[0].address;

      const {
        address_name,
        region_1depth_name,
        region_2depth_name,
      } = myAddress;

      Swal.fire({
        title: '이 위치를 등록할까요?',
        text: address_name,
        showCancelButton: true,
        confirmButtonText: '등록',
        cancelButtonText: '취소',
      }).then(result => {
        if (result.isConfirmed) {
          const nextPost = {
            ...post,
            locationX: lng,
            locationY: lat,
            placeName: '사용자 위치',
            region1Depth: region_1depth_name, //시도 단위
            region2Depth: region_2depth_name, //구 단위
            addressName: address_name,
          };
          setPost(nextPost);
          setInputLocation(address_name);
          setVisible(false);
        }
      });
    });
  };

  //키워드 검색--------------------------------------------------------------------

  const keywordLocation = () => {
    setVisible(!visible);
  }; //컴포넌트 토글 버튼

  const saveKeywordAddress = item => {
    const { place_name, address_name, x, y } = item;

    Swal.fire({
      title: '이 위치를 등록할까요?',
      text: address_name,
      showCancelButton: true,
      confirmButtonText: '등록',
      cancelButtonText: '취소',
    }).then(result => {
      if (result.isConfirmed) {
        const nextPost = {
          ...post,
          locationX: x,
          locationY: y,
          placeName: place_name,
          region1Depth: address_name.split(' ')[0], //시도 단위
          region2Depth: address_name.split(' ')[1], //구 단위로 자릅니다
          addressName: address_name,
        };
        setPost(nextPost);
        setInputLocation(address_name);
        setVisible(false);
      }
    });
  };

  useEffect(() => {}, [visible]);
  useEffect(() => {
    if (!getToken()) {
      history.push('/loginpage');
    }
  }, []);

  //-----------------------------------------------------------

  return (
    <div className="writePost">
      <PageHeader
        className="site-page-header"
        onBack={() => history.goBack()}
        title="게시글 작성"
        subTitle="모집글을 작성합니다."
      />
      <div className="postForm" style={{ padding: '20px' }}>
        <Form
          layout="horizontal"
          onFinish={onsubmitForm}
          size="large"
          onsubmit="return false"
        >
          <Form.Item
            rules={[{ required: true, message: '제목을 입력하세요' }]}
            name="제목"
          >
            <Input
              placeholder="제목"
              name="title"
              value={title}
              onChange={onChange}
              maxLength="50"
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '종목을 고르세요' }]}
            name="종목"
          >
            <Select
              labelInValue
              name="종목"
              value="종목"
              placeholder="종목"
              onChange={onChangeEvent}
            >
              {selectEvent()}
            </Select>
          </Form.Item>
          <Form.Item>
            <Radio.Group size="large" defaultValue="a">
              <Space size="middle">
                {/* <Radio.Button value="a" onClick={() => setInputLocation('')}>
                  미지정
                </Radio.Button> */}
                <Radio.Button value="b" onClick={myLocation}>
                  내 위치
                </Radio.Button>
                <Radio.Button value="c" onClick={keywordLocation}>
                  키워드로 검색
                </Radio.Button>
              </Space>
            </Radio.Group>

            {visible && (
              <LocalSeraching saveKeywordAddress={saveKeywordAddress} />
            )}
          </Form.Item>
          <Form.Item>
            <Input
              disabled
              placeholder="위치"
              name="adress"
              value={inputLocation}
            />
          </Form.Item>

          <Form.Item
            name="date-picker"
            rules={[
              {
                type: 'object',
                required: true,
                message: '날짜와 시간을 입력하세요',
              },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              onChange={onChangeDate}
            />
          </Form.Item>

          <Form.Item
            name="인원수"
            rules={[{ required: true, message: '1 이상의 수를 입력하세요' }]}
          >
            <InputNumber
              name="Number"
              min={1}
              placeholder="인원수"
              onChange={onChangeNumber}
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '소개글을 입력하세요' }]}
            name="소개글"
          >
            <Input.TextArea
              placeholder="소개글"
              name="content"
              value={content}
              onChange={onChange}
              maxLength="500"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              style={{ marginTop: '25px' }}
              htmlType="submit"
            >
              등록
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default WritePost;
