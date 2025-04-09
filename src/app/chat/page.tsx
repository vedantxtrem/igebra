"use client";
import { useState } from "react";
import getGenerate from "@/hooks/generate.hooks";
import { motion, AnimatePresence } from "framer-motion";

interface Example {
  problem: string;
  solution: string;
}

interface QuizQuestion {
  question: string;
  answer: string;
}

interface LessonPlan {
  topic?: string;
  objective?: string;
  target_audience?: string;
  duration?: string;
  introductions?: {
    definition?: string | Record<string, any>;
  };
  methods?: string[];
  examples?: Example[];
  quiz?: {
    leet_code_link?: string;
    gfg_link?: string;
    questions?: QuizQuestion[];
  };
  application?: string | Record<string, any>;
}

const LessonSetupPage = () => {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [generatedLesson, setGeneratedLesson] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { subject, gradelevel: grade, topic };
      const response = await getGenerate(payload);
      setGeneratedLesson(response || null);
      nextStep(); // Go to result step
    } catch (err) {
      console.error("Error generating lesson:", err);
      setGeneratedLesson(null);
    } finally {
      setLoading(false);
    }
  };

  const renderTextOrObject = (data: string | Record<string, any> | undefined) => {
    if (!data) return null;
    if (typeof data === "string") return <p className="text-gray-700">{data}</p>;
    return (
      <div className="space-y-1 text-gray-700">
        {Object.entries(data).map(([key, value], idx) => (
          <p key={idx}>
            <strong>{key}:</strong> {typeof value === "string" ? value : JSON.stringify(value)}
          </p>
        ))}
      </div>
    );
  };

  const steps = ["Subject", "Grade", "Topic", "Preview"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 px-4 py-10 flex flex-col items-center space-y-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-700 mb-2">Lesson Plan Generator</h2>
        <p className="text-gray-600">Create tailored lesson plans in seconds</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center space-x-4 mb-6">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
                i + 1 === step
                  ? "bg-purple-600 text-white"
                  : i + 1 < step
                  ? "bg-purple-300 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <span className="text-sm text-gray-700 hidden sm:block">{label}</span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-8 md:p-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              <label className="block text-gray-700 font-medium">Subject</label>
              <input
                type="text"
                placeholder="e.g., Math, Science"
                className="w-full border rounded-lg p-3 text-black"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              <button
                onClick={nextStep}
                disabled={!subject}
                className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"
              >
                Next
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              <label className="block text-gray-700 font-medium">Standard</label>
              <input
                type="text"
                placeholder="e.g., 5th Grade"
                className="w-full border rounded-lg p-3 text-black"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
              />
              <div className="flex justify-between">
                <button onClick={prevStep} className="text-purple-600 font-semibold">Back</button>
                <button
                  onClick={nextStep}
                  disabled={!grade}
                  className="bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 transition"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.form
              key="step3"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              <label className="block text-gray-700 font-medium">Lesson Topic</label>
              <input
                type="text"
                placeholder="e.g., Fractions, Photosynthesis"
                className="w-full border rounded-lg p-3 text-black"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
              <div className="flex justify-between">
                <button onClick={prevStep} className="text-purple-600 font-semibold">Back</button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 transition"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Display Result */}
      {step === 4 && generatedLesson && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl space-y-6"
        >
          <h3 className="text-2xl font-bold text-purple-700 text-center mb-4">📄 Your Lesson Plan</h3>
          {generatedLesson.topic && (
            <div><h4 className="font-semibold text-purple-600">Topic</h4><p className="text-black">{generatedLesson.topic}</p></div>
          )}
          {generatedLesson.objective && (
            <div><h4 className="font-semibold text-purple-600">Objective</h4><p className="text-black">{generatedLesson.objective}</p></div>
          )}
          {generatedLesson.target_audience && (
            <div><h4 className="font-semibold text-purple-600">Target Audience</h4><p className="text-black">{generatedLesson.target_audience}</p></div>
          )}
          {generatedLesson.duration && (
            <div><h4 className="font-semibold text-purple-600">Duration</h4><p className="text-black">{generatedLesson.duration}</p></div>
          )}
          {generatedLesson.introductions?.definition && (
            <div>
              <h4 className="font-semibold text-purple-600">Introduction</h4>
              {renderTextOrObject(generatedLesson.introductions.definition)}
            </div>
          )}
          {generatedLesson.methods?.length && (
            <div>
              <h4 className="font-semibold text-purple-600">Methods</h4>
              <ul className="list-disc pl-6 text-black">
                {generatedLesson.methods.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          )}
          {generatedLesson.examples?.length && (
            <div>
              <h4 className="font-semibold text-purple-600">Examples</h4>
              <ul className="space-y-2 text-black">
                {generatedLesson.examples.map((ex, i) => (
                  <li key={i} className="border rounded-lg p-3 bg-gray-50">
                    <strong>Problem:</strong> {ex.problem}<br />
                    <strong>Solution:</strong> {ex.solution}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {generatedLesson.quiz && (
            <div>
              <h4 className="font-semibold text-purple-600">Quiz</h4>
              <ul className="list-disc pl-6 space-y-2 text-black">
                {generatedLesson.quiz.leet_code_link && (
                  <li>
                    <a href={generatedLesson.quiz.leet_code_link} className="text-blue-600 underline" target="_blank">LeetCode</a>
                  </li>
                )}
                {generatedLesson.quiz.gfg_link && (
                  <li>
                    <a href={generatedLesson.quiz.gfg_link} className="text-blue-600 underline" target="_blank">GeeksForGeeks</a>
                  </li>
                )}
                {generatedLesson.quiz.questions?.map((q, i) => (
                  <li key={i}>
                    <strong>Q:</strong> {q.question}<br />
                    <strong>A:</strong> {q.answer}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {generatedLesson.application && (
            <div>
              <h4 className="font-semibold text-purple-600">Applications</h4>
              {renderTextOrObject(generatedLesson.application)}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default LessonSetupPage;
