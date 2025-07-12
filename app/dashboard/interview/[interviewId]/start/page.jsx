"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { use } from "react";
import QestionSection from "./_components/QestionSection";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RecordAns = dynamic(() => import("./_components/RecordAns"), {
  ssr: false,
});

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQueIndex, setactiveQueIndex] = useState(0);
  const { interviewId } = use(params);

  useEffect(() => {
    getInterviewDetails();
  }, []);
  // used to getinterviewData by mockid
  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    const jsonMockResp = JSON.parse(result[0].jsonMockResp);

    console.log(jsonMockResp);

    setMockInterviewQuestion(jsonMockResp);
    setInterviewData(result[0]);
  };
  return (
    <div>
      <div className="grid gird-cols-1 md:grid-cols-2 gap-10">
        <QestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQueIndex={activeQueIndex}
        />
        <RecordAns
          mockInterviewQuestion={mockInterviewQuestion}
          activeQueIndex={activeQueIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQueIndex > 0 && <Button onClick={()=>setactiveQueIndex(activeQueIndex-1)}>Prev Question</Button>}
        {activeQueIndex != mockInterviewQuestion?.length - 1 && (
          <Button onClick={()=>setactiveQueIndex(activeQueIndex+1)}>Next Question</Button>
        )}

        {activeQueIndex == mockInterviewQuestion?.length - 1 && (
          <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
          <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;
