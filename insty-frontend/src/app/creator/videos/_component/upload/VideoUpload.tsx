"use client";
import React, { useState } from 'react'
import VideoForm from '../common/VideoForm'
import { UploadformData } from '@/app/types';
import { useVideoUploadStore } from '@/app/stores/videos/videoUploadStore';
import PreviewInfomation from './PreviewInfomation';

function VideoUpload() {
  const [step, setStep] = useState<'upload' | 'preview' | 'edit'>('upload');
  const { data, setData } = useVideoUploadStore();

  const handleUpload = (formData: UploadformData) => {
    setData(formData);
    console.log(data);
    setStep('preview');
  };

  const handleEdit = () => {
    setStep('edit');
  };

  return (
    <>
      {step === 'upload' && <VideoForm subject="영상 업로드" onSubmit={handleUpload} onBack={() => {}} />}
      {step === 'preview' && data && <PreviewInfomation data={data} onEdit={() => handleEdit()} />}
      {step === 'edit' && data && <VideoForm subject="영상 수정" initialData={data} onSubmit={handleUpload} onBack={() => setStep('preview')} />}
    </>
  )
}

export default VideoUpload