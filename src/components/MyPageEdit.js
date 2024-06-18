import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LocationSel from './LocationSel';
import { useRecoilState } from 'recoil';
import { userState, userLocationState } from '../recoil/atoms';

export default function MyPageEdit() {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userState);
  const [userLocation, setUserLocation] = useRecoilState(userLocationState);

  const [localUser, setLocalUser] = useState({
    memberId: '',
    nickname: '',
    phoneNumber: '',
    password: '',
    region: {
      sido: '',
      gugun: '',
      eupmyeondong: '',
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('ACCESS_TOKEN');
      const memberId = localStorage.getItem('memberId');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://10.125.121.224:8080/user/profile/${memberId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLocalUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        localStorage.clear();
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalUser({
      ...localUser,
      [name]: value,
    });
  };

  const handleRegionChange = (newRegion) => {
    setLocalUser({
      ...localUser,
      region: newRegion,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!localUser.password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    try {
      const response = await axios.put(`http://10.125.121.224:8080/user/profile`, localUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('회원 정보가 성공적으로 수정되었습니다.');
      setUser(response.data);
      //
      console.log('MyPageEdit.js:',response.data.regionId);
      setUserLocation(response.data.regionId);
      navigate('/mypage');
    } catch (error) {
      console.error('Failed to update user data:', error);
      alert('회원 정보 수정에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white bg-opacity-30 p-10 rounded-lg shadow-lg w-full max-w-2xl h-auto">
      <div className="mb-8 flex justify-center items-center">
        <label className="block text-left text-2xl font-bold mb-2 text-white w-1/5">닉네임</label>
        <input 
          type="text" 
          name="nickname"
          className="w-full px-5 py-4 text-sm text-white bg-transparent placeholder-white border border-gray-300 focus:outline-none focus:border-blue-500 rounded-md" 
          placeholder="닉네임을 입력하세요." 
          value={localUser.nickname || ''}
          onChange={handleChange}
        />
      </div>
      <div className="mb-8 flex justify-center items-center">
        <label className="block text-left text-2xl font-bold mb-2 text-white w-1/5">전화번호</label>
        <input 
          type="text" 
          name="phoneNumber"
          className="w-full px-5 py-4 text-sm text-white bg-transparent placeholder-white border rounded-md border-gray-300 focus:outline-none focus:border-blue-500" 
          placeholder="전화번호를 입력하세요." 
          value={localUser.phoneNumber || ''}
          onChange={handleChange}
        />
      </div>
      <div className="mb-8 flex justify-center items-center">
        <label className="block text-left text-2xl font-bold mb-2 text-white w-1/5">비밀번호</label>
        <input 
          type="password" 
          name="password"
          className="w-full px-5 py-4 text-sm text-white bg-transparent placeholder-white border rounded-md border-gray-300 focus:outline-none focus:border-blue-500" 
          placeholder="비밀번호를 입력하세요." 
          value={localUser.password || ''}
          onChange={handleChange}
        />
      </div>
      <div className="mb-8">
        <label className="block text-center text-2xl font-bold mb-2 text-white">주소</label>
        <LocationSel onChange={handleRegionChange} />
      </div>
      <div className='flex justify-center items-center'>
      <button type='submit' className="text-[#1F487E] hover:text-white border border-[#1F487E] hover:bg-[#1F487E] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-5">완료</button>
      </div>
    </form>
  )
}
