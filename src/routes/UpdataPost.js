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
import { baseApiUrl } from 'components/Options';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/ko_KR';
import { selectEvent } from 'components/Options';
import 'routes/UserProfile.css';

const UpdatePost = ({ history, match }) => {
  //글쓰기 페이지+불러온 데이터.

  const [form] = Form.useForm();

  const { idx } = match.params;

  const [post, setPost] = useState({
    addressName: '',
    content: '',
    event: '',
    eventTime: '',
    locationX: '',
    locationY: '',
    needPeopleNum: '',
    placeName: '',
    region1Depth: '',
    region2Depth: '',
    title: '',
    email: '',
  }); //포스트

  const [visible, setVisible] = useState(false);

  const [inputLocation, setInputLocation] = useState(null);

  const [prevDate, setPrevDate] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      await axios.get(`${baseApiUrl}/api/board/posts/${idx}`).then(res => {
        setInputLocation(res.data.addressName);
        setPrevDate(res.data.eventTime);

        form.setFieldsValue({
          title: res.data.title,
          content: res.data.content,
          needPeople: res.data.needPeopleNum,
          event: res.data.event,
          address: res.data.addressName,
        });
        setPost(res.data);
        setIsLoading(false);
      });
    } catch (e) {
      console.log(e);
    }
  };
  //글을 불러온다

  const { title, content, eventTime, event } = post; //구조분해할당

  const initialValues = {
    ['date-picker']: moment(prevDate),
    ['event']: event,
  };

  //------------------------onChange등등

  const onsubmitForm = async () => {
    await Swal.fire({
      title: '수정하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '수정',
      cancelButtonText: '취소',
    }).then(result => {
      if (result.isConfirmed) {
        axios.put(`${baseApiUrl}/api/board/posts/${idx}`, post).then(() => {
          Swal.fire('수정 완료!', '', 'success');
          history.push(`/post/${idx}`);
        });
      }
    });
  }; //전송하고 홈으로~

  const onChangeDate = (value, dateString) => {
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
    };
    setPost(nextPost);
  }; //제목과 내용

  const onChangeNumber = value => {
    const nextPost = {
      ...post,
      needPeopleNum: value,
    };
    setPost(nextPost);
  }; //인원수

  const onChangeEvent = value => {
    const nextPost = {
      ...post,
      event: value,
    };
    setPost(nextPost);
  }; //종목

  // --------------------위치 관련-------------------------

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
    } //접속 위치가 얻어지지 않으면
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
      } = myAddress; //구조분해할당

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
          form.setFieldsValue({
            address: address_name,
          });
          setVisible(false);
        }
      });
    });
  };

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
          region1Depth: address_name.split(' ')[0], //시도 단위 (서울시)
          region2Depth: address_name.split(' ')[1], //구 단위  (성동구)
          addressName: address_name,
        };
        setPost(nextPost);
        setInputLocation(address_name);
        form.setFieldsValue({
          address: address_name,
        });
        setVisible(false);
      }
    });
  };

  useEffect(() => {}, [visible]);

  useEffect(() => {
    getData();
  }, []);

  //-----------------------------------------------------------

  return (
    <div className="writePost">
      <PageHeader
        className="site-page-header"
        onBack={() => history.goBack()}
        title="게시글 수정"
        subTitle="모집글을 수정합니다."
      />
      <div className="postForm" style={{ padding: '20px' }}>
        {isLoading ? (
          <>Loading...</>
        ) : (
          <Form
            name="update"
            layout="horizontal"
            onFinish={onsubmitForm}
            size="large"
            form={form}
            initialValues={initialValues}
          >
            <Form.Item
              rules={[{ required: true, message: '제목을 입력하세요' }]}
              name="title"
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
              name="event"
            >
              <Select name="종목" placeholder="종목" onChange={onChangeEvent}>
                {selectEvent()}
              </Select>
            </Form.Item>
            <Form.Item>
              <Radio.Group size="large">
                <Space size="middle">
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
            <Form.Item name="address">
              <Input
                disabled
                placeholder="위치"
                name="address"
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
                locale={locale}
              />
            </Form.Item>
            <Form.Item
              name="needPeople"
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
              name="content"
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
        )}
      </div>
    </div>
  );
};

export default UpdatePost;
