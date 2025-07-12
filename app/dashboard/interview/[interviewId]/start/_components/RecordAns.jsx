"use client";

import Webcam from "react-webcam";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAImodel";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { UserAnswer } from "@/utils/schema";
function RecordAns({ mockInterviewQuestion, activeQueIndex, interviewData }) {
  const [userAnswer, setuserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  useEffect(() => {
    results.map((result) =>
      setuserAnswer((prevans) => prevans + result?.transcript)
    );
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      updateUserAnsInDB();
    }
   
  }, [userAnswer]);
  const saveUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
      
    } else {
      startSpeechToText();
    }
  };

  const updateUserAnsInDB = async () => {
    console.log(userAnswer);
    setLoading(true);
    const feedbackPrompt =
      "Question:" +
      mockInterviewQuestion[activeQueIndex]?.Question +
      ",User Answer:" +
      userAnswer +
      " depends on quetion and user answer " +
      "please give us rating in min 1 & max 5 and feedback for answer as area of improvence " +
      "in just 3 to 5 lines to improve it in JSON format with Rating field and Feedback field";
    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockjsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    console.log(mockjsonResp);
    const jsonFeedbackResp = JSON.parse(mockjsonResp);
    const resp = await db.insert(UserAnswer).values({
      mockId: interviewData?.mockId,
      question: mockInterviewQuestion[activeQueIndex]?.Question,
      correctAns: mockInterviewQuestion[activeQueIndex]?.Answer,
      userAns: userAnswer,
      feedback: jsonFeedbackResp?.Feedback,
      rating: jsonFeedbackResp?.Rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM-YYYY"),
    });
    if (resp) {
      toast("user answer recorded sucessfully");
      setuserAnswer("");
      setResults([]);
    }
    setResults([]);
    setLoading(false);
  };
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center bg-secondary rounded-lg p-5 mt-20 bg-black">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute"
          alt="none"
        />
        <Webcam
          mirrored={true}
          style={{ height: 300, width: "100%", zIndex: 10 }}
        />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={saveUserAnswer}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2">
            <Mic></Mic>Stop Recording
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
     
    </div>
  );
}

export default RecordAns;
