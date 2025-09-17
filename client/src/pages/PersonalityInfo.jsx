import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonalityForm from '../components/ProfileInfo/PersonalityForm';
import { useAuth } from '../context/authContext';
import { useEffect } from 'react';

const PersonalityInfo = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  // useEffect(()=>{
  //   if(isBasicInfoReq)
  //   {
  //     navigate('/basicinfo');
  //   }
  //   else{
  //     navigate('/dashboard');
  //   }
  // },[isBasicInfoReq, navigate])

  const handleSubmit = async (traitData) => {
    try {
      console.log("Personality data in frontend is: ",{personality: traitData})
      await axios.patch('http://localhost:8080/api/users/update-personality', {personality: traitData}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving personality info:', err);
    }
  };

  const handleBack = () => {
    navigate('/basicinfo');
  };

  return <PersonalityForm onSubmit={handleSubmit} onBack={handleBack} />;
};

export default PersonalityInfo;