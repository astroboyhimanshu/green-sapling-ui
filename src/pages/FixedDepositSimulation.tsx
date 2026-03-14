import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import StudentHeader from "../components/StudentHeader";
import EducatorHeader from "../components/EducatorHeader";
import Button from "../components/Button";
import SimplePieChart from "../components/SimplePieChart";
import XPToast from "../components/XPToast";

interface SimulationState {
  savingsBalance: number;
  pocketCash: number;
  yearsLeft: number;
  monthsLeft: number;
  totalMonthsElapsed: number;
  fixedDeposits: FixedDeposit[];
}

interface FixedDeposit {
  id: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  remainingMonths: number;
  maturityAmount: number;
  isMatured: boolean;
}

// --- CFO Score Tracking ---
interface CfoScores {
  securityScore: number; // chose savings for high-cost emergencies
  liquidityScore: number; // chose pocket cash for low-cost wants
  disciplineScore: number; // finished without "breaking" savings for wants
}

// --- Emergency Q&A Types ---
interface EmergencyQuestion {
  question: string;
  options: { label: string; value: "A" | "B" }[];
  correctAnswer: "A" | "B";
  explanation: string;
}

interface Emergency {
  type: string;
  cost: number;
  icon: string;
  description: string;
  severity: "high" | "low";
  questions: EmergencyQuestion[];
  /** After all 3 questions, the final action is determined by the last answer */
  finalPaymentFromSavings: boolean; // true = correct final answer uses savings
}

export default function FixedDepositSimulation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [simulation, setSimulation] = useState<SimulationState>({
    savingsBalance: 0,
    pocketCash: 5000,
    yearsLeft: 5,
    monthsLeft: 0,
    totalMonthsElapsed: 0,
    fixedDeposits: [],
  });

  const isEducator = location.pathname.startsWith("/educator");
  const basePath = isEducator ? "/educator" : "/student";

  const [depositAmount, setDepositAmount] = useState(500);
  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [fdAmount, setFdAmount] = useState(1000);
  const [fdTerm, setFdTerm] = useState(12);
  const [isRunning, setIsRunning] = useState(false);

  // Emergency Q&A state
  const [showEmergency, setShowEmergency] = useState(false);
  const [currentEmergency, setCurrentEmergency] = useState<Emergency | null>(
    null,
  );
  const [questionStep, setQuestionStep] = useState(0); // 0, 1, 2
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState<("A" | "B")[]>([]);

  const [showCompletion, setShowCompletion] = useState(false);
  const [xpEvent, setXpEvent] = useState<{ label: string; xp: number } | null>(
    null,
  );

  // CFO Score
  const [cfoScores, setCfoScores] = useState<CfoScores>({
    securityScore: 0,
    liquidityScore: 0,
    disciplineScore: 3, // starts at 3, decremented on wrong choices
  });

  const yearlyInterestRef = useRef({ savings: 0, fd: 0 });
  const toastedYearsRef = useRef(new Set<number>());

  // ---- Emergency definitions with 3-part questions ----
  const emergencies: Emergency[] = [
    {
      type: "Family Emergency",
      cost: 5000,
      icon: "👨‍👩‍👧‍👦",
      severity: "high",
      description: "A family emergency requires ₹5,000 immediately!",
      finalPaymentFromSavings: true,
      questions: [
        {
          question:
            "A family emergency requires ₹5,000 immediately. Where is your money right now?",
          options: [
            { label: "Most of it is in my pocket/cupboard.", value: "A" },
            { label: "Most of it is in my Savings Account.", value: "B" },
          ],
          correctAnswer: "B",
          explanation:
            "Keeping money in a Savings Account protects it from small daily spending. Pocket cash often gets nibbled away on snacks or toys without us realising!",
        },
        {
          question:
            "If your money was in your pocket, you might have spent small bits of it already. In a Savings Account, it stays untouched. Which is safer for emergencies?",
          options: [
            {
              label: "Pocket Cash — easy to grab, but easy to waste.",
              value: "A",
            },
            {
              label: "Savings Account — protected and ready for big needs.",
              value: "B",
            },
          ],
          correctAnswer: "B",
          explanation:
            "A Savings Account acts like a vault. It's there when you need it for something important, and not wasted on impulse buys.",
        },
        {
          question:
            "The bank interest helped your ₹5,000 grow to ₹5,100 over the last year. Pocket cash stayed exactly ₹5,000. Which choice helps you solve the emergency better?",
          options: [
            {
              label: "Savings Account — interest gave me 'free' extra money.",
              value: "A",
            },
            {
              label: "Pocket Cash — I didn't have to go to the bank.",
              value: "B",
            },
          ],
          correctAnswer: "A",
          explanation:
            "Correct! Savings Account wins — your money grew on its own AND it was safe. Pay the emergency from your Savings Account.",
        },
      ],
    },
    {
      type: "New Clothes",
      cost: 1500,
      icon: "👕",
      severity: "low",
      description: "There's a festive sale! You want a new outfit for ₹1,500.",
      finalPaymentFromSavings: false,
      questions: [
        {
          question:
            "There's a festive sale! You want a new outfit for ₹1,500. Where should this 'fun' money come from?",
          options: [
            { label: "My Savings Account.", value: "A" },
            { label: "My Pocket Cash (allowance I saved up).", value: "B" },
          ],
          correctAnswer: "B",
          explanation:
            "Pocket Cash is your spending money — exactly the right tool for fun wants like new clothes. Keep your Savings Account for growing your wealth!",
        },
        {
          question:
            "If you take money from your Savings Account, you stop interest from growing on that amount. Is it better to use your pocket cash for clothes?",
          options: [
            {
              label: "Pocket Cash — keep my 'growing' money untouched.",
              value: "A",
            },
            {
              label: "Savings Account — easier to just withdraw it.",
              value: "B",
            },
          ],
          correctAnswer: "A",
          explanation:
            "Every rupee withdrawn from savings loses future interest. Using Pocket Cash preserves your 'Wealth Tree'!",
        },
        {
          question:
            "Using Pocket Cash for clothes teaches you to live within a budget. Using Savings makes you 'dip into your future.' Which choice makes you a better CFO of your life?",
          options: [
            {
              label: "Pocket Cash — smart budgeting for small wants.",
              value: "A",
            },
            {
              label: "Savings Account — slows down my long-term growth.",
              value: "B",
            },
          ],
          correctAnswer: "A",
          explanation:
            "Smart! Pocket Cash for wants, Savings for the future. Pay for clothes from Pocket Cash.",
        },
      ],
    },
    {
      type: "Phone Repair",
      cost: 2500,
      icon: "📱",
      severity: "high",
      description:
        "Your phone screen is shattered. You need ₹2,500 to fix it today.",
      finalPaymentFromSavings: true,
      questions: [
        {
          question:
            "Your phone screen is shattered. You need ₹2,500 to fix it today. How are you carrying that money to the shop?",
          options: [
            { label: "Hard cash in my wallet.", value: "A" },
            { label: "Securely in my Savings Account.", value: "B" },
          ],
          correctAnswer: "B",
          explanation:
            "Hard cash in a wallet is vulnerable — it can be lost, stolen, or accidentally spent. Bank money is digitally secure.",
        },
        {
          question:
            "If you drop your wallet or a thief grabs your cash, it's gone forever. If you lose your bank card, your money is still safe. Which feels safer?",
          options: [
            { label: "Pocket Cash — high physical risk.", value: "A" },
            { label: "Savings Account — digital security.", value: "B" },
          ],
          correctAnswer: "B",
          explanation:
            "Exactly! Your bank account is protected by a PIN and the bank's security. Cash in your pocket is one pickpocket away from gone.",
        },
        {
          question:
            "While waiting for the repair, the bank paid you interest on that money. Pocket cash gave you nothing. Which choice makes your money 'work' for you?",
          options: [
            { label: "Savings Account — smart Baniya move.", value: "A" },
            { label: "Pocket Cash — stagnant money.", value: "B" },
          ],
          correctAnswer: "A",
          explanation:
            "Smart! Your Savings Account earns interest even while you wait in the repair queue. Pay from Savings Account.",
        },
      ],
    },
    {
      type: "School Trip",
      cost: 800,
      icon: "🚌",
      severity: "low",
      description: "A school trip to a nearby museum costs ₹800!",
      finalPaymentFromSavings: false,
      questions: [
        {
          question:
            "A school trip to a nearby museum costs ₹800. It's a small, fun expense. Where do you reach first?",
          options: [
            { label: "My Pocket Cash.", value: "A" },
            { label: "My Savings Account.", value: "B" },
          ],
          correctAnswer: "A",
          explanation:
            "Pocket Cash is exactly for small, everyday expenses like this. No need to touch your Savings Account for a small outing!",
        },
        {
          question:
            "For a small ₹800 payment, is it worth the time and effort to go to a bank or ATM, or is the cash in your hand better?",
          options: [
            {
              label: "Pocket Cash — fast and convenient for small things.",
              value: "A",
            },
            {
              label: "Savings Account — worth the trip to the bank.",
              value: "B",
            },
          ],
          correctAnswer: "A",
          explanation:
            "For small amounts, Pocket Cash saves you time and hassle. Reserve the bank trip for when it really matters.",
        },
        {
          question:
            "If you use Pocket Cash for the trip, your Savings Account keeps earning interest on its full balance. Which choice keeps your 'Tree' growing the fastest?",
          options: [
            {
              label: "Pocket Cash — spend the small stuff, save the big stuff.",
              value: "A",
            },
            {
              label: "Savings Account — the bank should pay for everything.",
              value: "B",
            },
          ],
          correctAnswer: "A",
          explanation:
            "Exactly! Every rupee left in your Savings Account keeps growing. Use Pocket Cash for small joys and let your savings compound undisturbed.",
        },
      ],
    },
    {
      type: "Birthday Gift",
      cost: 500,
      icon: "🎁",
      severity: "low",
      description:
        "Your best friend's birthday is tomorrow! You need ₹500 for a gift.",
      finalPaymentFromSavings: false,
      questions: [
        {
          question:
            "Your best friend's birthday is tomorrow. You need ₹500 for a gift. What's the best way to pay?",
          options: [
            {
              label: "With the cash I have from my last allowance.",
              value: "A",
            },
            {
              label: "By withdrawing from my Savings Account.",
              value: "B",
            },
          ],
          correctAnswer: "A",
          explanation:
            "Your allowance (Pocket Cash) is meant for exactly these small social expenses. Keep your Savings Account untouched!",
        },
        {
          question:
            "Your Savings Account is your 'Foundation.' If you keep withdrawing small amounts like ₹500, will you ever reach your Age-18 goal?",
          options: [
            { label: "Yes, ₹500 doesn't matter.", value: "A" },
            {
              label:
                "No, small leaks sink big ships. Pocket Cash is better here.",
              value: "B",
            },
          ],
          correctAnswer: "B",
          explanation:
            "Small withdrawals add up over time and slow your savings growth. Protect your foundation — use Pocket Cash for small wants.",
        },
        {
          question:
            "Pocket Cash is like the 'Fruit' of your labor — meant for sharing and small joys. The Savings Account is the 'Root.' Which should you protect?",
          options: [
            {
              label: "Pocket Cash — use it for gifts and small joys.",
              value: "A",
            },
            {
              label: "Savings Account — break the roots for the gift.",
              value: "B",
            },
          ],
          correctAnswer: "A",
          explanation:
            "Protect your roots! Pocket Cash is the fruit — spend it on gifts and joys. Your Savings Account is the root that keeps your wealth tree alive.",
        },
      ],
    },
  ];

  const getFDInterestRate = (termMonths: number) => {
    if (termMonths === 12) return 5.5;
    if (termMonths === 36) return 6.5;
    if (termMonths === 60) return 7.5;
    return 5.5;
  };

  const createFixedDeposit = () => {
    if (simulation.pocketCash >= fdAmount) {
      const interestRate = getFDInterestRate(fdTerm);
      const maturityAmount =
        fdAmount * Math.pow(1 + interestRate / 100, fdTerm / 12);
      const newFD: FixedDeposit = {
        id: Date.now().toString(),
        amount: fdAmount,
        interestRate,
        termMonths: fdTerm,
        remainingMonths: fdTerm,
        maturityAmount,
        isMatured: false,
      };
      setSimulation((prev) => ({
        ...prev,
        pocketCash: prev.pocketCash - fdAmount,
        fixedDeposits: [...prev.fixedDeposits, newFD],
      }));
    }
  };

  const collectMaturedFD = (fdId: string) => {
    setSimulation((prev) => {
      const fd = prev.fixedDeposits.find((f) => f.id === fdId);
      if (!fd || !fd.isMatured) return prev;
      return {
        ...prev,
        pocketCash: prev.pocketCash + fd.maturityAmount,
        fixedDeposits: prev.fixedDeposits.filter((f) => f.id !== fdId),
      };
    });
  };

  // Timer countdown
  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = setInterval(() => {
        setSimulation((prev) => {
          let newMonthsLeft = prev.monthsLeft - 1;
          let newYearsLeft = prev.yearsLeft;
          let newTotalMonthsElapsed = prev.totalMonthsElapsed + 1;

          if (newMonthsLeft < 0) {
            newMonthsLeft = 11;
            newYearsLeft = Math.max(0, prev.yearsLeft - 1);
          }

          const monthlyInterest = prev.savingsBalance * 0.0029;
          const newSavingsBalance = prev.savingsBalance + monthlyInterest;
          yearlyInterestRef.current.savings += monthlyInterest;

          const newPocketCash = prev.pocketCash + 500;

          const updatedFDs = prev.fixedDeposits.map((fd) => {
            const newRemainingMonths = Math.max(0, fd.remainingMonths - 1);
            if (!fd.isMatured && newRemainingMonths > 0) {
              yearlyInterestRef.current.fd +=
                fd.amount * (fd.interestRate / 100 / 12);
            }
            return {
              ...fd,
              remainingMonths: newRemainingMonths,
              isMatured: newRemainingMonths === 0,
            };
          });

          if (newTotalMonthsElapsed >= 60) {
            setIsRunning(false);
            setShowCompletion(true);
            return {
              ...prev,
              savingsBalance: newSavingsBalance,
              pocketCash: newPocketCash,
              yearsLeft: 0,
              monthsLeft: 0,
              totalMonthsElapsed: 60,
              fixedDeposits: updatedFDs,
            };
          }

          if (
            newTotalMonthsElapsed > 0 &&
            newTotalMonthsElapsed % 12 === 0 &&
            !showEmergency
          ) {
            const year = newTotalMonthsElapsed / 12;
            if (!toastedYearsRef.current.has(year)) {
              toastedYearsRef.current.add(year);
              const { savings, fd } = yearlyInterestRef.current;
              const totalInterest = savings + fd;
              const parts = [];
              if (savings > 0)
                parts.push(
                  `Savings: ₹${savings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
                );
              if (fd > 0)
                parts.push(
                  `FD: ₹${fd.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
                );
              toast.success(
                `📈 Year ${year} complete! Interest earned — ${parts.length ? parts.join(" • ") : "₹0"} (Total: ₹${totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })})`,
                { icon: false },
              );
              yearlyInterestRef.current = { savings: 0, fd: 0 };
              setTimeout(
                () =>
                  setXpEvent({
                    label: `Year ${year} complete — FD Simulation`,
                    xp: 10,
                  }),
                100,
              );
            }

            // Pick emergency in fixed order (rotate through all 3)
            const emergencyIndex = (year - 1) % emergencies.length;
            const chosenEmergency = emergencies[emergencyIndex];
            setCurrentEmergency(chosenEmergency);
            setQuestionStep(0);
            setSelectedAnswer(null);
            setShowFeedback(false);
            setQuestionAnswers([]);
            setShowEmergency(true);
            setIsRunning(false);
          }

          return {
            ...prev,
            savingsBalance: newSavingsBalance,
            pocketCash: newPocketCash,
            yearsLeft: newYearsLeft,
            monthsLeft: newMonthsLeft,
            totalMonthsElapsed: newTotalMonthsElapsed,
            fixedDeposits: updatedFDs,
          };
        });
      }, 833);
    }
    return () => clearInterval(interval);
  }, [isRunning, showEmergency]);

  // ---- Emergency Q&A handlers ----
  const handleSelectAnswer = (answer: "A" | "B") => {
    if (showFeedback) return; // already answered this step
    setSelectedAnswer(answer);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (!currentEmergency || selectedAnswer === null) return;

    const newAnswers = [...questionAnswers, selectedAnswer];
    setQuestionAnswers(newAnswers);

    if (questionStep < 2) {
      // Move to next question
      setQuestionStep(questionStep + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Final question answered — apply payment and update scores
      const finalAnswer = selectedAnswer;

      const usedSavings =
        currentEmergency.questions[2].correctAnswer === finalAnswer
          ? currentEmergency.finalPaymentFromSavings
          : !currentEmergency.finalPaymentFromSavings;

      applyEmergencyPayment(
        usedSavings,
        currentEmergency,
        finalAnswer === currentEmergency.questions[2].correctAnswer,
      );

      setShowEmergency(false);
      setCurrentEmergency(null);
      setIsRunning(true);
    }
  };

  const applyEmergencyPayment = (
    useFromSavings: boolean,
    emergency: Emergency,
    answeredCorrectly: boolean,
  ) => {
    setSimulation((prev) => {
      const cost = emergency.cost;
      const totalAvailable = prev.pocketCash + prev.savingsBalance;

      if (totalAvailable < cost) {
        return { ...prev, pocketCash: 0, savingsBalance: 0 };
      }

      if (useFromSavings && prev.savingsBalance >= cost) {
        return { ...prev, savingsBalance: prev.savingsBalance - cost };
      } else if (!useFromSavings && prev.pocketCash >= cost) {
        return { ...prev, pocketCash: prev.pocketCash - cost };
      } else {
        // Mixed payment
        const remainingCost = cost - prev.pocketCash;
        return {
          ...prev,
          pocketCash: 0,
          savingsBalance: prev.savingsBalance - remainingCost,
        };
      }
    });

    // Update CFO scores
    setCfoScores((prev) => {
      const newScores = { ...prev };
      if (answeredCorrectly) {
        if (emergency.severity === "high") {
          newScores.securityScore = Math.min(5, prev.securityScore + 1);
        } else {
          newScores.liquidityScore = Math.min(5, prev.liquidityScore + 1);
        }
      } else {
        newScores.disciplineScore = Math.max(0, prev.disciplineScore - 1);
      }
      return newScores;
    });
  };

  // ---- CFO Profile logic ----
  const getCfoProfile = () => {
    const { securityScore, liquidityScore, disciplineScore } = cfoScores;
    const total = securityScore + liquidityScore + disciplineScore;

    if (total >= 7)
      return {
        title: "THE CALCULATED PROTECTOR",
        emoji: "🛡️",
        color: "bg-green-600",
        strengths: [
          "Protected savings for big emergencies",
          "Used pocket cash wisely for small wants",
          "Maintained financial discipline",
        ],
        lesson:
          "You have a strong instinct for safety and discipline. Challenge yourself to learn more about growing wealth through investments next!",
      };
    if (securityScore >= 2 && liquidityScore < 1)
      return {
        title: "THE FORTRESS BUILDER",
        emoji: "🏰",
        color: "bg-blue-600",
        strengths: [
          "Excellent at protecting savings for emergencies",
          "Very security-focused mindset",
        ],
        lesson:
          "You're great at safety! Try using Pocket Cash more for small wants so your Savings Account keeps growing uninterrupted.",
      };
    if (liquidityScore >= 2 && securityScore < 1)
      return {
        title: "THE SMART SPENDER",
        emoji: "🛒",
        color: "bg-yellow-500",
        strengths: [
          "Great at using Pocket Cash for everyday wants",
          "Understands budgeting for small purchases",
        ],
        lesson:
          "Good spending habits! Now focus on keeping your Savings Account untouched during big emergencies to grow your financial safety net.",
      };
    return {
      title: "THE GROWING LEARNER",
      emoji: "🌱",
      color: "bg-purple-600",
      strengths: [
        "You're building financial awareness",
        "Each mistake is a learning moment",
      ],
      lesson:
        "You're on your way! Keep practicing: Savings Account for emergencies, Pocket Cash for wants. You'll get there!",
    };
  };

  const handleDeposit = () => {
    if (simulation.pocketCash >= depositAmount) {
      setSimulation((prev) => ({
        ...prev,
        pocketCash: prev.pocketCash - depositAmount,
        savingsBalance: prev.savingsBalance + depositAmount,
      }));
    }
  };

  const handleWithdraw = () => {
    if (simulation.savingsBalance >= withdrawAmount) {
      setSimulation((prev) => ({
        ...prev,
        savingsBalance: prev.savingsBalance - withdrawAmount,
        pocketCash: prev.pocketCash + withdrawAmount,
      }));
    }
  };

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const totalFDValue = simulation.fixedDeposits.reduce(
    (sum, fd) => sum + (fd.isMatured ? fd.maturityAmount : fd.amount),
    0,
  );
  const overallNetWorth =
    simulation.pocketCash + simulation.savingsBalance + totalFDValue;

  const cfoProfile = getCfoProfile();

  // ---- Current question being shown ----
  const currentQuestion = currentEmergency?.questions[questionStep] ?? null;

  return (
    <div className="min-h-screen bg-green-800 flex flex-col">
      {isEducator ? <EducatorHeader /> : <StudentHeader />}

      {/* XP Toast */}
      {xpEvent && (
        <XPToast
          label={xpEvent.label}
          xp={xpEvent.xp}
          onDone={() => setXpEvent(null)}
        />
      )}

      {/* ===== Emergency Q&A Modal ===== */}
      {showEmergency && currentEmergency && currentQuestion && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-orange-200 overflow-hidden">
            {/* Header */}
            <div className="bg-orange-500 px-6 py-4 text-white">
              <div className="flex items-center justify-between mb-1">
                <span className="text-3xl">{currentEmergency.icon}</span>
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full border-2 border-white transition-all ${
                        i < questionStep
                          ? "bg-white"
                          : i === questionStep
                            ? "bg-yellow-300"
                            : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <h3 className="text-xl font-bold">{currentEmergency.type}</h3>
              <p className="text-orange-100 text-sm">
                {currentEmergency.description}
              </p>
              <div className="mt-2 inline-block bg-white/20 rounded-full px-3 py-1 text-sm font-semibold">
                Cost: {formatCurrency(currentEmergency.cost)} • Question{" "}
                {questionStep + 1} of 3
              </div>
            </div>

            {/* Question body */}
            <div className="p-6">
              <p className="text-gray-800 font-semibold text-base mb-4 leading-relaxed">
                {currentQuestion.question}
              </p>

              {/* Options */}
              <div className="space-y-3 mb-4">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.value;
                  const isCorrect = opt.value === currentQuestion.correctAnswer;
                  let btnClass =
                    "w-full text-left p-4 rounded-2xl border-2 font-medium transition-all text-sm ";

                  if (!showFeedback) {
                    btnClass +=
                      "border-gray-200 hover:border-orange-400 hover:bg-orange-50 cursor-pointer";
                  } else if (isCorrect) {
                    btnClass += "border-green-500 bg-green-50 text-green-800";
                  } else if (isSelected && !isCorrect) {
                    btnClass += "border-red-400 bg-red-50 text-red-800";
                  } else {
                    btnClass += "border-gray-200 bg-gray-50 text-gray-400";
                  }

                  return (
                    <button
                      key={opt.value}
                      className={btnClass}
                      onClick={() => handleSelectAnswer(opt.value)}
                      disabled={showFeedback}
                    >
                      <span className="font-bold mr-2">{opt.value})</span>
                      {opt.label}
                      {showFeedback && isCorrect && (
                        <span className="ml-2 text-green-600">✓</span>
                      )}
                      {showFeedback && isSelected && !isCorrect && (
                        <span className="ml-2 text-red-500">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback box */}
              {showFeedback && (
                <div
                  className={`rounded-2xl p-4 mb-4 text-sm leading-relaxed ${
                    selectedAnswer === currentQuestion.correctAnswer
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-amber-50 border border-amber-200 text-amber-800"
                  }`}
                >
                  <span className="font-semibold mr-1">
                    {selectedAnswer === currentQuestion.correctAnswer
                      ? "✅ Correct!"
                      : "💡 Good try!"}
                  </span>
                  {currentQuestion.explanation}
                </div>
              )}

              {/* Next button */}
              {showFeedback && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 bg-orange-500 text-white rounded-2xl font-bold text-base hover:bg-orange-600 transition-all"
                >
                  {questionStep < 2
                    ? "Next Question →"
                    : "Apply Decision & Continue ✓"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Completion Modal with CFO Scorecard ===== */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border-4 border-green-200 overflow-hidden">
            {/* Header — compact */}
            <div
              className={`${cfoProfile.color} px-8 py-5 text-white flex items-center gap-5`}
            >
              <div className="text-6xl shrink-0">{cfoProfile.emoji}</div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest opacity-75">
                  Level 2 Complete!
                </div>
                <div className="text-sm opacity-80">
                  Your Financial Personality
                </div>
                <h2 className="text-2xl font-extrabold leading-tight">
                  {cfoProfile.title}
                </h2>
              </div>
            </div>

            {/* Two-column body */}
            <div className="grid grid-cols-2 gap-4 p-6">
              {/* Left col */}
              <div className="space-y-4">
                {/* CFO Scorecard */}
                <div>
                  <h4 className="text-gray-600 font-bold text-xs uppercase tracking-wider mb-2">
                    CFO Scorecard
                  </h4>
                  <div className="space-y-2">
                    {[
                      {
                        label: "Security",
                        value: cfoScores.securityScore,
                        max: 3,
                        color: "bg-blue-500",
                        icon: "🛡️",
                      },
                      {
                        label: "Liquidity",
                        value: cfoScores.liquidityScore,
                        max: 3,
                        color: "bg-green-500",
                        icon: "💧",
                      },
                      {
                        label: "Discipline",
                        value: cfoScores.disciplineScore,
                        max: 3,
                        color: "bg-purple-500",
                        icon: "🎯",
                      },
                    ].map((score) => (
                      <div key={score.label}>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-xs font-semibold text-gray-700">
                            {score.icon} {score.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {score.value}/{score.max}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`${score.color} h-2 rounded-full`}
                            style={{
                              width: `${(score.value / score.max) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div className="bg-green-50 rounded-2xl p-3">
                  <h4 className="text-green-800 font-bold text-xs mb-1.5">
                    💪 Strengths
                  </h4>
                  <ul className="space-y-1">
                    {cfoProfile.strengths.map((s, i) => (
                      <li
                        key={i}
                        className="text-green-700 text-xs flex items-start gap-1.5"
                      >
                        <span>✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right col */}
              <div className="space-y-4">
                {/* Growth Lesson */}
                <div className="bg-amber-50 rounded-2xl p-3">
                  <h4 className="text-amber-800 font-bold text-xs mb-1">
                    📚 Growth Lesson
                  </h4>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    {cfoProfile.lesson}
                  </p>
                </div>

                {/* Final Portfolio */}
                <div className="bg-gray-50 rounded-2xl p-3">
                  <h4 className="text-gray-600 font-bold text-xs uppercase tracking-wider mb-2">
                    💼 Final Portfolio
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    {[
                      {
                        label: "Savings",
                        value: simulation.savingsBalance,
                        color: "text-green-600",
                      },
                      {
                        label: "Fixed Deposits",
                        value: totalFDValue,
                        color: "text-orange-600",
                      },
                      {
                        label: "Pocket Cash",
                        value: simulation.pocketCash,
                        color: "text-blue-600",
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-gray-500 text-xs">
                          {item.label}
                        </span>
                        <span className={`font-bold text-xs ${item.color}`}>
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t pt-1.5 mt-1">
                      <span className="text-gray-700 font-semibold text-xs">
                        Net Worth
                      </span>
                      <span className="font-bold text-base text-green-700">
                        {formatCurrency(overallNetWorth)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer button */}
            <div className="px-6 pb-5">
              <Button
                onClick={() =>
                  navigate(`${basePath}/course/financial-foundations`, {
                    state: { completedLevel: 2 },
                  })
                }
                className="w-full bg-green-600 hover:bg-green-700 text-base py-3"
              >
                🎓 Back to Course
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Main Layout ===== */}
      <div className="flex flex-1 min-h-0">
        {/* Left Panel */}
        <div className="w-1/3 bg-green-900/50 p-6 text-white">
          <div className="mb-8">
            <div className="text-lg font-medium mb-2">
              YEAR {5 - simulation.yearsLeft} OF {5}
            </div>
            <div className="w-full bg-green-800 rounded-full h-3">
              <div
                className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((5 - simulation.yearsLeft) / 5) * 100}%` }}
              />
            </div>
            <div className="text-sm mt-2 text-green-200">
              {simulation.yearsLeft} years, {simulation.monthsLeft} months
            </div>
          </div>

          <div className="mb-8 flex justify-center">
            <div className="w-48 h-48 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="animate-bounce [animation-duration:3s] [animation-iteration-count:2]">
                <img src="/piggy_logo.png" alt="" />
              </div>
            </div>
          </div>

          {/* Live CFO mini-scorecard */}
          <div className="mb-4 bg-green-800/50 rounded-2xl p-3">
            <div className="text-xs text-green-300 font-semibold uppercase tracking-wider mb-2">
              CFO Score
            </div>
            <div className="space-y-1.5">
              {[
                {
                  label: "Security",
                  value: cfoScores.securityScore,
                  max: 3,
                  color: "bg-blue-400",
                },
                {
                  label: "Liquidity",
                  value: cfoScores.liquidityScore,
                  max: 3,
                  color: "bg-green-400",
                },
                {
                  label: "Discipline",
                  value: cfoScores.disciplineScore,
                  max: 3,
                  color: "bg-purple-400",
                },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-xs text-green-200 w-16">{s.label}</span>
                  <div className="flex-1 bg-green-900/60 rounded-full h-1.5">
                    <div
                      className={`${s.color} h-1.5 rounded-full transition-all`}
                      style={{ width: `${(s.value / s.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-green-300">
                    {s.value}/{s.max}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-sm text-green-200 mb-1">POCKET CASH</div>
              <div className="text-3xl font-bold">
                {formatCurrency(simulation.pocketCash)}
              </div>
            </div>
            <div>
              <div className="text-sm text-green-200 mb-1">
                OVERALL NET WORTH
              </div>
              <div className="text-3xl font-bold">
                {formatCurrency(overallNetWorth)}
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              className={`w-full ${isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
            >
              {isRunning ? "⏸️ Pause Time" : "▶️ Start Time"}
            </Button>
            <Button
              onClick={() => {
                setIsRunning(false);
                setSimulation((prev) => ({
                  ...prev,
                  yearsLeft: 0,
                  monthsLeft: 0,
                  totalMonthsElapsed: 60,
                }));
                setShowCompletion(true);
              }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              ⏭️ Skip to End
            </Button>
            <Button
              onClick={() =>
                navigate(`${basePath}/course/financial-foundations`)
              }
              variant="outline"
              className="w-full text-white border-white hover:bg-white hover:text-green-800"
            >
              Exit Simulation
            </Button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-green-100 p-4 flex flex-col space-y-4">
          {/* Savings Account */}
          <div className="flex-1 bg-white rounded-3xl shadow-2xl p-6 border-4 border-green-200">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🏛️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                SAVINGS ACCOUNT
              </h2>
              <div className="w-24 h-0.5 bg-green-500 mx-auto"></div>
            </div>
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-1">BALANCE</div>
              <div className="text-3xl font-bold text-gray-800">
                {formatCurrency(simulation.savingsBalance)}
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-24 p-2 border-2 border-gray-300 rounded-lg text-center mb-2 text-sm"
                  min="100"
                  max={simulation.savingsBalance}
                  step="100"
                />
                <br />
                <Button
                  onClick={handleWithdraw}
                  disabled={simulation.savingsBalance < withdrawAmount}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  withdraw
                </Button>
              </div>
              <div className="text-center">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-24 p-2 border-2 border-gray-300 rounded-lg text-center mb-2 text-sm"
                  min="100"
                  max={simulation.pocketCash}
                  step="100"
                />
                <br />
                <Button
                  onClick={handleDeposit}
                  disabled={simulation.pocketCash < depositAmount}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  deposit
                </Button>
              </div>
            </div>
          </div>

          {/* Fixed Deposit */}
          <div className="flex-1 bg-white rounded-3xl shadow-2xl p-6 border-4 border-orange-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                FIXED DEPOSIT
              </h2>
              <div className="w-24 h-0.5 bg-orange-500 mx-auto"></div>
            </div>
            <div className="mb-4">
              {simulation.fixedDeposits.length === 0 ? (
                <p className="text-gray-500 text-center text-sm">
                  No Fixed Deposits yet
                </p>
              ) : (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {simulation.fixedDeposits.map((fd) => {
                    const completionPercentage =
                      ((fd.termMonths - fd.remainingMonths) / fd.termMonths) *
                      100;
                    return (
                      <div
                        key={fd.id}
                        className="shrink-0 bg-orange-50 rounded-lg p-3 text-center min-w-[100px]"
                      >
                        <SimplePieChart
                          percentage={completionPercentage}
                          size={50}
                          color={fd.isMatured ? "#22c55e" : "#f97316"}
                          backgroundColor="#fed7aa"
                        />
                        <div className="mt-2">
                          <div className="text-xs font-semibold text-gray-800">
                            {formatCurrency(fd.amount)}
                          </div>
                          <div className="text-xs text-gray-600 p-1">
                            {fd.interestRate}% • {fd.termMonths}m
                          </div>
                          {fd.isMatured ? (
                            <Button
                              onClick={() => collectMaturedFD(fd.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs mt-1"
                            >
                              collect
                            </Button>
                          ) : (
                            <div className="text-orange-600 text-xs mt-1">
                              {fd.remainingMonths}s left
                            </div>
                          )}
                          {fd.isMatured && (
                            <div className="text-green-600 font-bold text-xs">
                              {formatCurrency(fd.maturityAmount)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-600 mb-1">PROFIT</div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency(
                    totalFDValue -
                      simulation.fixedDeposits.reduce(
                        (sum, fd) => sum + fd.amount,
                        0,
                      ),
                  )}
                </div>
              </div>
              <div className="flex justify-center space-x-2 mb-4">
                <input
                  type="number"
                  value={fdAmount}
                  onChange={(e) => setFdAmount(Number(e.target.value))}
                  className="w-20 p-2 border-2 border-gray-300 rounded-lg text-center text-sm"
                  min="1000"
                  max={simulation.pocketCash}
                  step="500"
                />
                <select
                  value={fdTerm}
                  onChange={(e) => setFdTerm(Number(e.target.value))}
                  className="p-2 border-2 border-gray-300 rounded-lg text-sm"
                >
                  <option value={12}>1Y (5.5%)</option>
                  <option value={36}>3Y (6.5%)</option>
                  <option value={60}>5Y (7.5%)</option>
                </select>
              </div>
              <div className="text-center">
                <Button
                  onClick={createFixedDeposit}
                  disabled={simulation.pocketCash < fdAmount}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  buy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
