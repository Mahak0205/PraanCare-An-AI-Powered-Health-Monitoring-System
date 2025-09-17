import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DemographicForm from '../components/ProfileInfo/DemographicForm';
import { useAuth } from '../context/authContext';
import {useEffect} from 'react';

const BasicInfo = () => {
  const navigate = useNavigate();

  const { token } = useAuth();
  
    // useEffect(()=>{
    //   if(isPersonalityReq)
    //   {
    //     navigate('/personality');
    //   }
    //   else{
    //     navigate('/dashboard');
    //   }
    // },[isPersonalityReq, navigate])

  const handleNext = async (formData) => {
    try {
      await axios.patch('http://localhost:8080/api/users/update-basic-info', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/personality')

    } catch (err) {
      console.error('Error saving basic info:', err);
    }
  };

  return <DemographicForm onNext={handleNext} />;
};

export default BasicInfo;
