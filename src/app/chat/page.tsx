"use client";
import { useState } from "react";
import getGenerate from "@/hooks/generate.hooks";

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
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [generatedLesson, setGeneratedLesson] = useState<LessonPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        subject,
        gradelevel: grade,
        topic,
      };
      const response = await getGenerate(payload);
      console.log(response);
      setGeneratedLesson(response || null);
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
    if (typeof data === "object") {
      return (
        <div className="space-y-1 text-gray-700">
          {Object.entries(data).map(([key, value], idx) => (
            <p key={idx}>
              <strong>{key}:</strong>{" "}
              {typeof value === "string" ? value : JSON.stringify(value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 flex flex-col items-center justify-start px-4 py-10 space-y-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Let’s Create Your First Lesson Plan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Subject</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
              placeholder="e.g., Math, Science"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Grade Level</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
              placeholder="e.g., 5th Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Lesson Topic</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-black"
              placeholder="e.g., Fractions, Photosynthesis"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-purple-700 transition"
            disabled={loading}
          >
            {loading ? "Generating..." : "Continue"}
          </button>
        </form>
      </div>

      {generatedLesson && (
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-3xl w-full space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Generated Lesson Plan</h3>

          {generatedLesson.topic && (
            <div>
              <h4 className="text-xl font-semibold text-purple-700">📘 Topic</h4>
              <p className="text-gray-700">{generatedLesson.topic}</p>
            </div>
          )}

          {generatedLesson.objective && (
            <div>
              <h4 className="text-xl font-semibold text-purple-700">🎯 Objective</h4>
              <p className="text-gray-700">{generatedLesson.objective}</p>
            </div>
          )}

          {generatedLesson.target_audience && (
            <div>
              <h4 className="text-xl font-semibold text-purple-700">👥 Target Audience</h4>
              <p className="text-gray-700">{generatedLesson.target_audience}</p>
            </div>
          )}

          {generatedLesson.duration && (
            <div>
              <h4 className="text-xl font-semibold text-purple-700">⏱ Duration</h4>
              <p className="text-gray-700">{generatedLesson.duration}</p>
            </div>
          )}

          {generatedLesson.introductions?.definition && (
            <div>
              <h4 className="text-xl font-semibold text-purple-700">📚 Introduction</h4>
              {renderTextOrObject(generatedLesson.introductions.definition)}
            </div>
          )}

          {generatedLesson.methods && generatedLesson.methods.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold text-purple-700">⚙️ Methods</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {generatedLesson.methods.map((method, index) => (
                  <li key={index}>{method}</li>
                ))}
              </ul>
            </div>
          )}

          {generatedLesson.examples && generatedLesson.examples.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold text-purple-700">🧪 Examples</h4>
              <ul className="space-y-2 text-gray-700">
                {generatedLesson.examples.map((ex, index) => (
                  <li key={index} className="border border-gray-200 p-3 rounded-lg">
                    <strong>Problem:</strong> {ex.problem}
                    <br />
                    <strong>Solution:</strong> {ex.solution}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(generatedLesson.quiz?.leet_code_link ||
            generatedLesson.quiz?.gfg_link ||
            (generatedLesson.quiz?.questions?.length ?? 0) > 0) && (
            <div>
              <h4 className="text-xl font-semibold text-purple-700">📝 Quiz</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {generatedLesson.quiz?.leet_code_link && (
                  <li>
                    <a
                      href={generatedLesson.quiz.leet_code_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      LeetCode Problem
                    </a>
                  </li>
                )}
                {generatedLesson.quiz?.gfg_link && (
                  <li>
                    <a
                      href={generatedLesson.quiz.gfg_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      GeeksForGeeks Problem
                    </a>
                  </li>
                )}
                {generatedLesson.quiz?.questions?.map((q, i) => (
                  <li key={i}>
                    <strong>Q:</strong> {q.question}
                    <br />
                    <strong>A:</strong> {q.answer}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {generatedLesson.application && (
            <div>
              <h4 className="text-xl font-semibold text-purple-700">🔍 Applications</h4>
              {renderTextOrObject(generatedLesson.application)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonSetupPage;
