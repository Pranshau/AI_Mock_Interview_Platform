import { Lightbulb, Volume } from "lucide-react";
import React from "react";


function QestionSection({ mockInterviewQuestion, activeQueIndex }) {
  const textToSpeach = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert(
        "Sorry for the inconvenience. Your browser does not support Text-to-Speech."
      );
    }
  };
  return (
    mockInterviewQuestion && (
      <div className="p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {mockInterviewQuestion &&
            mockInterviewQuestion.map((question, index) => (
              // <h2
              //   className={
              //     `p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQueIndex==index&&'bg-green-600 text-black'}`
              //   }
              //   key={index}

              // >
              //   Question #{index + 1}
              // </h2>
              <h2
                className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${
                  activeQueIndex === index
                    ? "bg-primary text-black"
                    : ""
                }`}
                key={index}
              >
                Question #{index + 1}
              </h2>
            ))}
        </div>
        <h2 className="my-5 text-md md:text-lg">
          {mockInterviewQuestion[activeQueIndex]?.Question}
        </h2>
        <Volume
          className="cursor-pointer"
          onClick={() =>
            textToSpeach(mockInterviewQuestion[activeQueIndex]?.Question)
          }
        />
        <div className="border rounded-lg p-5 bg-blue-100 mt-20">
          <h2 className="flex gap-2 items-center text-blue-700">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-sm text-primary my-2">
            Click On Record Answer when you want to answer the Question.At end
            you'll get All answers with comparision of your answers.
          </h2>
        </div>
      </div>
    )
  );
}

export default QestionSection;
