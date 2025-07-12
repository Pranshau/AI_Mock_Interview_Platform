"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAImodel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDescription, setJobDescription] = useState();
  const [jobExp, setJobExp] = useState();
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDescription, jobExp);
    const inputPrompt =
      "job Position : " +
      jobPosition +
      " job Description: " +
      jobDescription +
      " years of experience :" +
      jobExp +
      " depends on this information give me 5 interview questions with answers in JSON format . Give Question and Answer as field in json and dont use anything like \n  i am parsing and converting this data into directly json format";

    const result = await chatSession.sendMessage(inputPrompt);
    const mockJsonResp = ( result.response.text())
      .replace("```json", "")
      .replace("```", "");

      
 
    //  console.log(JSON.parse(mockJsonResp));
    
    ;
    // console.log(mockJsonResp);
    setJsonResponse(mockJsonResp);

    if (mockJsonResp) {
      const Resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: mockJsonResp,
          jobPosition: jobPosition,
          jobDesc: jobDescription,
          jobExp: jobExp,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });
      console.log("INSERTED ID", Resp);
      if (Resp) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + Resp[0]?.mockId);
      }
    } else {
      console.log("No valid JSON response received");
    }

    setLoading(false);
  };
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell Us More About Your Job Interviewing
            </DialogTitle>
            <DialogDescription></DialogDescription>
            <form onSubmit={onSubmit}>
              <div>
                <h2>
                  Add More Details About Your Job Position/role Job Description
                  and Experience Years
                </h2>
                <div className="mt-7 my-3">
                  <label>Job Role/Job Position</label>
                  <Input
                    placeholder="Ex. Full Stack Developer"
                    required
                    onChange={(event) => setJobPosition(event.target.value)}
                  />
                </div>
                <div className="my-3">
                  <label>Job Description/ Tech Stack (In Short)</label>
                  <Textarea
                    placeholder="Ex. React,Angular,Node.js ,Mysql etc"
                    required
                    onChange={(event) => setJobDescription(event.target.value)}
                  />
                </div>
                <div className="my-3">
                  <label>Years of Experience </label>
                  <Input
                    placeholder="Ex. 1/2/5 "
                    type="number"
                    max="40"
                    required
                    onChange={(event) => setJobExp(event.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-5 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {" "}
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      'Generating From AI'
                    </>
                  ) : (
                    "start Interview"
                  )}
                </Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
