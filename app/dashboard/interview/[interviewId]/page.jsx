"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import React, { useState, useEffect } from "react";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { use } from "react";
import Link from "next/link";

export default function Interview({ params }) {
  const [interviewData, setInterviewData] = useState({});
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  const { interviewId } = use(params);
  useEffect(() => {
    console.log(interviewId);
    getInterviewDetails();
  }, []);

  // used to getinterviewData by mockid
  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    // console.log(result);
    setInterviewData(result[0]);
  };

  return (
    <div className="my-10 ">
      <h2 className="font-bold text-2xl">Lets Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
          <div className="flex flex-col  p-5 rounded-lg border">
            <h2 className="text-lg">
              <strong>Job Role/Job Position:</strong>
              {interviewData.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description:</strong>
              {interviewData.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Job Experience:</strong>
              {interviewData.jobExp} Years
            </h2>
          </div>

          <div className="p-5 rounded-lg border  border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb /> <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500">
              Enable your video camera and microphone to start your AI-generated
              mock interview. It contains 10 questions that you need to answer.
              At the end, you will receive a report based on your answers.
              <br></br>
              <b>Note:</b>
              Your webcam will not be recorded.
            </h2>
          </div>
        </div>
        <div>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <>
              <WebcamIcon className=" h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <div className="flex justify-center">
              <Button variant="ghost"   onClick={() => setWebCamEnabled(true)}>
                Enable Webcam and Microphone
              </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end items-end">
        <Link href={'/dashboard/interview/'+interviewId+'/start'}>
      <Button>Start Interview</Button>
      </Link>
      </div>
    </div>

  );
}
// {interviewData.jobPosition}
// {interviewData.jobDesc}
// {interviewData.jobExp}
