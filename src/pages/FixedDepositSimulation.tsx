import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import EducatorHeader from "../components/EducatorHeader";
import Button from "../components/Button";
import SimplePieChart from "../components/SimplePieChart";

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

interface Emergency {
  type: string;
  cost: number;
  icon: string;
  description: string;
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

  // Detect if this is educator or student path
  const isEducator = location.pathname.startsWith("/educator");
  const basePath = isEducator ? "/educator" : "/student";

  const [depositAmount, setDepositAmount] = useState(500);
  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [fdAmount, setFdAmount] = useState(1000);
  const [fdTerm, setFdTerm] = useState(12); // months
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
  ];

  const getFDInterestRate = (termMonths: number) => {
    if (termMonths === 12) return 5.5; // 1 year
    if (termMonths === 36) return 6.5; // 3 years
    if (termMonths === 60) return 7.5; // 5 years
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

          // Add monthly interest to savings (3.5% annually)
          const monthlyInterest = prev.savingsBalance * 0.0029;
          const newSavingsBalance = prev.savingsBalance + monthlyInterest;

          // Add monthly allowance to pocket cash
          const newPocketCash = prev.pocketCash + 500;

          // Update Fixed Deposits
          const updatedFDs = prev.fixedDeposits.map((fd) => {
            const newRemainingMonths = Math.max(0, fd.remainingMonths - 1);
            return {
              ...fd,
              remainingMonths: newRemainingMonths,
              isMatured: newRemainingMonths === 0,
            };
          });

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
              fixedDeposits: updatedFDs,
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
      }, 2000);
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
          return {
            ...prev,
            savingsBalance: prev.savingsBalance - currentEmergency.cost,
          };
        } else if (prev.pocketCash >= currentEmergency.cost) {
          return {
            ...prev,
            pocketCash: prev.pocketCash - currentEmergency.cost,
          };
        } else {
          const remainingCost = currentEmergency.cost - prev.pocketCash;
          return {
            ...prev,
            pocketCash: 0,
            savingsBalance: prev.savingsBalance - remainingCost,
          };
        }
      } else {
        return {
          ...prev,
          pocketCash: 0,
          savingsBalance: 0,
        };
      }
    });

    setShowEmergency(false);
    setCurrentEmergency(null);
    setIsRunning(true);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  const totalFDValue = simulation.fixedDeposits.reduce(
    (sum, fd) => sum + (fd.isMatured ? fd.maturityAmount : fd.amount),
    0,
  );
  const overallNetWorth =
    simulation.pocketCash + simulation.savingsBalance + totalFDValue;

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
                <p className="text-red-600 text-sm mt-2">
                  Note: You cannot break Fixed Deposits for emergencies!
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
                      You don't have enough liquid money! This shows why
                      emergency funds are important.
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
                Level 2 Complete!
              </h3>
              <p className="text-xl text-gray-600 mb-6">
                You've mastered both Savings Accounts and Fixed Deposits!
              </p>

              <div className="bg-green-50 rounded-2xl p-6 mb-6">
                <h4 className="text-lg font-bold text-green-800 mb-4">
                  Your Final Portfolio:
                </h4>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Savings Balance:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(simulation.savingsBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fixed Deposits:</span>
                    <span className="font-bold text-orange-600">
                      {formatCurrency(totalFDValue)}
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
                    navigate(`${basePath}/course/financial-foundations`)
                  }
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-4"
                >
                  🎓 Back to Course
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
          {/* Piggy Bank */}{" "}
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

        {/* Right Side - Split into Savings and FD */}
        <div className="flex-1 bg-green-100 p-4 flex flex-col space-y-4">
          {/* Savings Account - Top 50% */}
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

          {/* Fixed Deposit - Bottom 50% */}
          <div className="flex-1 bg-white rounded-3xl shadow-2xl p-6 border-4 border-orange-200">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">📜</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                FIXED DEPOSIT
              </h2>
              <div className="w-24 h-0.5 bg-orange-500 mx-auto"></div>
            </div>

            {/* Active FDs */}
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
                          <div className="text-xs text-gray-600">
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
                              {fd.remainingMonths}m left
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

            {/* Create New FD */}
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
