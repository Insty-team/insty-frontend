"use client";
import React from "react";
import Image from "next/image";
import { videosDummyList } from "@/app/constants/constants";

export default function VideoManagement() {
  return (
    <>
      <h2 className="text-2xl font-semibold mt-6 mb-4">
        업로드한 영상 리스트
      </h2>
      {videosDummyList.map((video) => (
        <div
          key={video.id}
          className="flex bg-white p-4 items-center gap-6"
        >
          <div className="overflow-hidden flex-shrink-0 flex items-center justify-center">
            {video.thumbnail ? (
              <Image
                src={video.thumbnail}
                alt="썸네일"
                width={300}
                height={150}
                className="object-cover w-full h-full"
              />
            ) : null}
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <div className="font-semibold text-2xl text-ellipsis whitespace-nowrap overflow-hidden">
              {video.title}
            </div>
            <div className="flex flex-wrap gap-1">
              {video.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-black-100 text-2lg bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xl mt-1">
              <span className="flex items-center gap-1 text-gray-500">
                <Image
                  src="/userGraph.svg"
                  alt="조회수"
                  width={36}
                  height={36}
                />
                조회수{" "}
                <span className="text-primary-blue-600 ml-1">
                  {video.views}
                </span>
              </span>
              <span className="mx-2 text-gray-300">·</span>
              <span className="flex items-center gap-1 text-gray-500">
                <Image
                  src="/date.svg"
                  alt="업로드 날짜"
                  width={36}
                  height={36}
                />
                업로드 날짜{" "}
                <span className="text-primary-blue-600 ml-1">
                  {video.uploadDate}
                </span>
              </span>
              <span className="mx-2 text-gray-300">·</span>
              <span className="flex items-center gap-1 text-gray-500">
                <Image
                  src="/money.svg"
                  alt="가격"
                  width={36}
                  height={36}
                />
                가격{" "}
                <span className="text-primary-blue-600 ml-1">
                  {video.price}
                </span>
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className={`
                group
                px-4 py-2 rounded border border-primary-blue-600
                bg-white hover:bg-primary-blue-400 active:bg-primary-blue-600
                text-primary-blue-600 hover:text-white hover:border-primary-blue-400 active:text-white active:border-primary-blue-600
                flex items-center gap-1
              `}
              >
                수정
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 ml-1"
                >
                  <path
                    d="M2.5 14.8397V17.9647H5.625L14.8417 8.74805L11.7167 5.62305L2.5 14.8397Z"
                    fill="currentColor"
                  />
                  <path
                    d="M17.2574 6.33115C17.412 6.1747 17.4987 5.96361 17.4987 5.74365C17.4987 5.5237 17.412 5.31261 17.2574 5.15615L15.3074 3.20615C15.151 3.05155 14.9399 2.96484 14.7199 2.96484C14.5 2.96484 14.2889 3.05155 14.1324 3.20615L12.6074 4.73115L15.7324 7.85615L17.2574 6.33115Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <button
                className={`
                group
                px-4 py-2 rounded border border-primary-blue-600
                bg-white hover:bg-primary-blue-400 active:bg-primary-blue-600
                text-primary-blue-600 hover:text-white hover:border-primary-blue-400 active:text-white active:border-primary-blue-600
                flex items-center gap-1
              `}
              >
                상세 보기
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 ml-1"
                >
                  <path
                    d="M18 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M7 7H17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7 11H17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7 15H12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
} 