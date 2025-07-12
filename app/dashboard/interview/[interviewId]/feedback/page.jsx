"use client";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import React, { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { use } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Feedback({ params }) {
  const { interviewId } = use(params);
  const [feedbackList, setfeedbackList] = useState([]);
  const router = useRouter();
  useEffect(() => {
    Getfeedback();
  }, []);
  const Getfeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockId, interviewId))
      .orderBy(UserAnswer.id);
    console.log(result);
    setfeedbackList(result);
  };
  const calculateAverageRating = () => {
    if (feedbackList.length === 0) return 0;
    const total = feedbackList.reduce(
      (acc, item) => acc + Number(item.rating),
      0
    );
    const avgOutOfFive = total / feedbackList.length;
    const avgOutOfTen = avgOutOfFive * 2;
    return avgOutOfTen.toFixed(1);
  };

  return (
    <div className="p-10">
      {feedbackList?.length == 0 ? (
        <h2 className="font-bold text-xl text-gray-500">
          {" "}
          No Interview Feedback Record Found
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-600">
            Congratulations!!
          </h2>
          <h2 className="text-2xl font-bold">
            Here is Your Interview Feedback
          </h2>
          <h2 className="text-lg text-primary my-3">
            Your Overall Interview Rating :{" "}
            <strong>{calculateAverageRating()}/10</strong>
          </h2>

          <h2 className="text-sm text-gray-500">
            Find below Interview Question With Answers, Your Answer and Feedback
            for Improvement
          </h2>
          {feedbackList &&
            feedbackList.map((item, index) => (
              <Collapsible key={index} className="mt-7">
                <CollapsibleTrigger
                  className="
        p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-10 w-full"
                >
                  {item.question}
                  <ChevronsUpDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-red-500 border rounded-lg p-2">
                      <strong>Rating : </strong>
                      {item.rating}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                      <strong>Your Answer : </strong>
                      {item.userAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                      <strong>Correct Answer : </strong>
                      {item.correctAns}
                    </h2>
                    <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                      <strong>Feedback </strong>
                      {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
        </>
      )}
      <Button onClick={() => router.replace("/dashboard")}> Go Home</Button>
    </div>
  );
}

export default Feedback;
