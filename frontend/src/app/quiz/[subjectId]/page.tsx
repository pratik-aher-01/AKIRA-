'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Loader2, XCircle } from 'lucide-react'
import * as api from '@/lib/api'
import type { QuizQuestion } from '@/lib/types'
import { useSubjects } from '@/hooks/useSubjects'
import { useSubjectStore } from '@/store/subjectStore'

interface Props {
  params: { subjectId: string }
}

export default function QuizPage({ params }: Props) {
  const subjectId = Number(params.subjectId)
  const { isLoaded } = useSubjects()
  const subject = useSubjectStore((state) => state.getById(subjectId))

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [score, setScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateQuiz = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const data = await api.generateQuiz({ subject_id: subjectId, count: 5 })
      setQuestions(data)
      setCurrentIndex(0)
      setSelectedAnswer(null)
      setScore(0)
      setQuizComplete(false)
    } catch (err) {
      console.error('Failed to generate quiz', err)
      setError(err instanceof Error ? err.message : 'Failed to generate quiz.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(index)
    if (index === questions[currentIndex].correct_index) {
      setScore((current) => current + 1)
    }
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((current) => current + 1)
      setSelectedAnswer(null)
      return
    }

    setQuizComplete(true)
  }

  if (!isLoaded) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center">
        <Loader2 size={24} className="animate-spin text-purple-500" />
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="flex h-screen flex-1 flex-col items-center justify-center text-slate-400">
        <p className="font-syne text-xl text-white">Subject not found</p>
        <Link href="/" className="mt-4 text-blue-400 hover:underline">
          Return home
        </Link>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href={`/subject/${subject.id}`} className="glass-panel rounded-full p-2 transition-colors hover:bg-white/10">
          <ArrowLeft size={20} className="text-slate-300" />
        </Link>
        <div>
          <h1 className="font-syne text-3xl font-bold tracking-tight text-white">{subject.name} Quiz</h1>
          <p className="mt-1 text-slate-400">Test your knowledge against your notes.</p>
        </div>
      </div>

      {questions.length === 0 && !isGenerating && (
        <div className="glass-panel flex flex-col items-center rounded-3xl p-12 text-center">
          <div className="mb-6 text-6xl">📝</div>
          <h2 className="mb-2 text-2xl font-bold text-white">Ready to test yourself?</h2>
          <p className="mb-8 max-w-md text-slate-400">
            Akira will read through your notes and generate a custom 5-question multiple choice quiz to test your understanding.
          </p>
          {error && (
            <p className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}
          <button
            onClick={generateQuiz}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40"
          >
            Generate Quiz
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="glass-panel flex flex-col items-center rounded-3xl p-12 text-center">
          <Loader2 size={48} className="mb-6 animate-spin text-purple-500" />
          <h2 className="text-xl font-bold text-white">Analyzing your notes...</h2>
          <p className="mt-2 text-slate-400">Crafting custom questions based on your material.</p>
        </div>
      )}

      {currentQuestion && !quizComplete && (
        <div className="glass-panel rounded-3xl p-8">
          <div className="mb-6 flex items-center justify-between text-sm font-semibold text-slate-400">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>

          <h3 className="mb-6 text-xl font-medium leading-relaxed text-white">{currentQuestion.question}</h3>

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx
              const isCorrect = idx === currentQuestion.correct_index
              const showResult = selectedAnswer !== null

              let buttonStyle = 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200'
              if (showResult) {
                if (isCorrect) buttonStyle = 'bg-green-500/20 border-green-500/50 text-green-200'
                else if (isSelected) buttonStyle = 'bg-red-500/20 border-red-500/50 text-red-200'
                else buttonStyle = 'bg-white/5 border-white/10 opacity-50'
              }

              return (
                <button
                  key={`${currentQuestion.id}-${idx}`}
                  onClick={() => handleAnswer(idx)}
                  disabled={showResult}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${buttonStyle}`}
                >
                  <span>{option}</span>
                  {showResult && isCorrect && <CheckCircle2 size={20} className="text-green-400" />}
                  {showResult && isSelected && !isCorrect && <XCircle size={20} className="text-red-400" />}
                </button>
              )
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="animate-in fade-in slide-in-from-bottom-4 mt-8">
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                <p className="mb-1 text-sm font-medium text-blue-200">Akira&apos;s Explanation:</p>
                <p className="text-slate-300">{currentQuestion.explanation}</p>
              </div>
              <button
                onClick={nextQuestion}
                className="mt-6 w-full rounded-xl bg-white/10 py-3 font-semibold text-white transition-colors hover:bg-white/20"
              >
                {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            </div>
          )}
        </div>
      )}

      {quizComplete && (
        <div className="glass-panel animate-in zoom-in-95 flex flex-col items-center rounded-3xl p-12 text-center">
          <div className="mb-4 text-6xl">🏆</div>
          <h2 className="mb-2 text-3xl font-bold text-white">Quiz Complete!</h2>
          <p className="mb-8 text-xl text-slate-300">
            You scored <span className="font-bold text-purple-400">{score}</span> out of {questions.length}
          </p>
          <div className="flex gap-4">
            <button
              onClick={generateQuiz}
              className="rounded-xl bg-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/20"
            >
              Try Another
            </button>
            <Link
              href={`/subject/${subject.id}`}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/20"
            >
              Back to Chat
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
