import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import EducatorHeader from "../components/EducatorHeader";
import Button from "../components/Button";

interface SimulationState {
  savingsBalance: number;
  pocketCash: number;
  yearsLeft: number;
  monthsLeft: number;
  totalMonthsElapsed: number;
}

interface Emergency {
  type: string;
  cost: number;
  icon: string;
  description: string;
}

export default function SavingsSimulation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [simulation, setSimulation] = useState<SimulationState>({
    savingsBalance: 0,
    pocketCash: 5000, // Starting with ₹5000 as mentioned in pre-course form
    yearsLeft: 5, // This should come from user's age input
    monthsLeft: 0,
    totalMonthsElapsed: 0,
  });

  // Detect if this is educator or student path
  const isEducator = location.pathname.startsWith("/educator");
  const basePath = isEducator ? "/educator" : "/student";

  const [depositAmount, setDepositAmount] = useState(500);
  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [isRunning, setIsRunning] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [currentEmergency, setCurrentEmergency] = useState<Emergency | null>(
    null,
  );
  const [showCompletion, setShowCompletion] = useState(false);

  const emergencies: Emergency[] = [
    {
      type: "Family Emergency",
      cost: 2000,
      icon: "👨‍👩‍👧‍👦",
      description:
        "Your family needs urgent financial help for medical expenses.",
    },
    {
      type: "New Clothes",
      cost: 1200,
      icon: "👕",
      description: "You've outgrown your clothes and need new ones for school.",
    },
    {
      type: "Phone Repair",
      cost: 800,
      icon: "📱",
      description: "Your phone screen cracked and needs expensive repair.",
    },
    {
      type: "School Trip",
      cost: 1500,
      icon: "🚌",
      description:
        "An exciting educational trip opportunity came up at school.",
    },
    {
      type: "Birthday Gift",
      cost: 600,
      icon: "🎁",
      description:
        "Your best friend's birthday is coming and you want to buy a nice gift.",
    },
    {
      type: "Laptop Repair",
      cost: 2500,
      icon: "💻",
      description:
        "Your laptop stopped working and needs repair for school work.",
    },
  ];

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

          // Add monthly interest (3.5% annually = ~0.29% monthly)
          const monthlyInterest = prev.savingsBalance * 0.0029;
          const newSavingsBalance = prev.savingsBalance + monthlyInterest;

          // Add monthly allowance to pocket cash
          const newPocketCash = prev.pocketCash + 500;

          // Check for completion (5 years = 60 months)
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
            };
          }

          // Check for emergency every 24 months (2 years)
          if (
            newTotalMonthsElapsed > 0 &&
            newTotalMonthsElapsed % 24 === 0 &&
            !showEmergency
          ) {
            const randomEmergency =
              emergencies[Math.floor(Math.random() * emergencies.length)];
            setCurrentEmergency(randomEmergency);
            setShowEmergency(true);
            setIsRunning(false); // Pause simulation during emergency
          }

          return {
            ...prev,
            savingsBalance: newSavingsBalance,
            pocketCash: newPocketCash,
            yearsLeft: newYearsLeft,
            monthsLeft: newMonthsLeft,
            totalMonthsElapsed: newTotalMonthsElapsed,
          };
        });
      }, 2000); // 2 seconds = 1 month
    }
    return () => clearInterval(interval);
  }, [isRunning, showEmergency, emergencies]);

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

  const handleEmergencyPayment = (useFromSavings: boolean) => {
    if (!currentEmergency) return;

    setSimulation((prev) => {
      const totalAvailable = prev.pocketCash + prev.savingsBalance;

      if (totalAvailable >= currentEmergency.cost) {
        if (useFromSavings && prev.savingsBalance >= currentEmergency.cost) {
          // Pay from savings account
          return {
            ...prev,
            savingsBalance: prev.savingsBalance - currentEmergency.cost,
          };
        } else if (prev.pocketCash >= currentEmergency.cost) {
          // Pay from pocket cash
          return {
            ...prev,
            pocketCash: prev.pocketCash - currentEmergency.cost,
          };
        } else {
          // Pay from both (pocket cash first, then savings)
          const remainingCost = currentEmergency.cost - prev.pocketCash;
          return {
            ...prev,
            pocketCash: 0,
            savingsBalance: prev.savingsBalance - remainingCost,
          };
        }
      } else {
        // Not enough money - use all available funds
        return {
          ...prev,
          pocketCash: 0,
          savingsBalance: 0,
        };
      }
    });

    setShowEmergency(false);
    setCurrentEmergency(null);
    setIsRunning(true); // Resume simulation
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  const overallNetWorth = simulation.pocketCash + simulation.savingsBalance;

  return (
    <div className="min-h-screen bg-linear-to-br from-green-800 via-green-700 to-green-900">
      {isEducator ? <EducatorHeader /> : <StudentHeader />}

      {/* Emergency Modal */}
      {showEmergency && currentEmergency && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl border-4 border-red-200">
            <div className="text-center">
              <div className="text-6xl mb-4">{currentEmergency.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {currentEmergency.type}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {currentEmergency.description}
              </p>
              <div className="bg-red-50 rounded-2xl p-4 mb-6">
                <p className="text-red-700 font-bold text-xl">
                  Cost: {formatCurrency(currentEmergency.cost)}
                </p>
              </div>

              <div className="space-y-3">
                {simulation.savingsBalance >= currentEmergency.cost && (
                  <Button
                    onClick={() => handleEmergencyPayment(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    💳 Pay from Savings Account
                  </Button>
                )}

                {simulation.pocketCash >= currentEmergency.cost && (
                  <Button
                    onClick={() => handleEmergencyPayment(false)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    💰 Pay from Pocket Cash
                  </Button>
                )}

                {simulation.pocketCash + simulation.savingsBalance >=
                  currentEmergency.cost &&
                  simulation.pocketCash < currentEmergency.cost &&
                  simulation.savingsBalance < currentEmergency.cost && (
                    <Button
                      onClick={() => handleEmergencyPayment(false)}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      💸 Use All Available Money
                    </Button>
                  )}

                {simulation.pocketCash + simulation.savingsBalance <
                  currentEmergency.cost && (
                  <div className="bg-red-100 rounded-2xl p-4">
                    <p className="text-red-700 text-sm mb-3">
                      You don't have enough money! This will use all your funds.
                    </p>
                    <Button
                      onClick={() => handleEmergencyPayment(false)}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      😰 Pay What You Can
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-lg mx-4 shadow-2xl border-4 border-green-200">
            <div className="text-center">
              <div className="text-8xl mb-6">🎉</div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                Congratulations!
              </h3>
              <p className="text-xl text-gray-600 mb-6">
                You've successfully completed 5 years of financial simulation!
              </p>

              <div className="bg-green-50 rounded-2xl p-6 mb-6">
                <h4 className="text-lg font-bold text-green-800 mb-4">
                  Your Final Results:
                </h4>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Savings Balance:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(simulation.savingsBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pocket Cash:</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(simulation.pocketCash)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-800 font-semibold">
                      Total Net Worth:
                    </span>
                    <span className="font-bold text-2xl text-green-700">
                      {formatCurrency(overallNetWorth)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() =>
                    navigate(
                      `${basePath}/course/financial-foundations/lesson/2`,
                    )
                  }
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-4"
                >
                  🚀 Continue to Next Lesson
                </Button>
                <Button
                  onClick={() =>
                    navigate(`${basePath}/course/financial-foundations`)
                  }
                  variant="outline"
                  className="w-full"
                >
                  📚 Back to Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-screen pt-16">
        {/* Left Side Panel */}
        <div className="w-1/3 bg-green-900/50 p-6 text-white">
          {/* Timer */}
          <div className="mb-8">
            <div className="text-lg font-medium mb-2">
              YEAR {5 - simulation.yearsLeft} OF {5}
            </div>
            <div className="w-full bg-green-800 rounded-full h-3">
              <div
                className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((5 - simulation.yearsLeft) / 5) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm mt-2 text-green-200">
              {simulation.yearsLeft} years, {simulation.monthsLeft} months until
              18
            </div>
          </div>

          {/* Piggy Bank */}
          <div className="mb-8 flex justify-center">
            <div className="w-48 h-48 bg-yellow-100 rounded-full flex items-center justify-center ">
              {/* Piggy Bank SVG placeholder - replace with actual SVG */}
              <div className="animate-bounce [animation-duration:3s] [animation-iteration-count:2]">
                <img src="/src/assets/piggy_logo.png" alt="" />
              </div>
            </div>
          </div>

          {/* Financial Stats */}
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

          {/* Control Buttons */}
          <div className="mt-8 space-y-4">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              className={`w-full ${isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
            >
              {isRunning ? "⏸️ Pause Time" : "▶️ Start Time"}
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

        {/* Right Side - Savings Account */}
        <div className="flex-1 bg-green-100 p-8">
          <div className="bg-white rounded-3xl shadow-2xl h-full p-8 border-4 border-green-200">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🏛️</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                SAVINGS ACCOUNT
              </h1>
              <div className="w-32 h-1 bg-green-500 mx-auto"></div>
            </div>

            {/* Balance Display */}
            <div className="text-center mb-12">
              <div className="text-lg text-gray-600 mb-2">BALANCE</div>
              <div className="text-6xl font-bold text-gray-800 mb-8">
                {formatCurrency(simulation.savingsBalance)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-8">
              {/* Withdraw */}
              <div className="text-center">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-32 p-3 border-2 border-gray-300 rounded-lg text-center mb-4 text-lg"
                  min="100"
                  max={simulation.savingsBalance}
                  step="100"
                />
                <br />
                <Button
                  onClick={handleWithdraw}
                  disabled={simulation.savingsBalance < withdrawAmount}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  withdraw
                </Button>
              </div>

              {/* Deposit */}
              <div className="text-center">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-32 p-3 border-2 border-gray-300 rounded-lg text-center mb-4 text-lg"
                  min="100"
                  max={simulation.pocketCash}
                  step="100"
                />
                <br />
                <Button
                  onClick={handleDeposit}
                  disabled={simulation.pocketCash < depositAmount}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  deposit
                </Button>
              </div>
            </div>

            {/* Interest Info */}
            <div className="mt-12 text-center">
              <div className="bg-blue-50 rounded-2xl p-6 max-w-md mx-auto">
                <div className="text-blue-600 font-semibold mb-2">
                  💡 Did you know?
                </div>
                <div className="text-gray-700">
                  Your savings account earns 3.5% interest per year. Watch your
                  money grow automatically!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
