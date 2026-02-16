import { useState } from 'react'
import './index.css'
import { Calculator, DollarSign, Clock, Download, RefreshCcw, TrendingUp, Moon, Shield } from 'lucide-react'

// Financing options (typical Mattress Firm rates)
const FINANCING_OPTIONS = [
  { months: 0, name: 'Pay in Full', apr: 0 },
  { months: 12, name: '12 Months', apr: 0 },
  { months: 24, name: '24 Months', apr: 0 },
  { months: 36, name: '36 Months', apr: 9.99 },
  { months: 48, name: '48 Months', apr: 9.99 },
]

// Sleep ROI data
const SLEEP_BENEFITS = [
  { label: 'Productivity Gain', value: 13, unit: '%' },
  { label: 'Health Cost Savings', value: 540, unit: '$/year' },
  { label: 'Energy/Alertness', value: 25, unit: '%' },
]

function App() {
  const [mattressPrice, setMattressPrice] = useState<number>(2499)
  const [basePrice, setBasePrice] = useState<number>(0)
  const [protectionPlan, setProtectionPlan] = useState<boolean>(true)
  const protectionPrice = 199
  const [customerIncome, setCustomerIncome] = useState<number>(65000)
  const [downPayment, setDownPayment] = useState<number>(0)
  
  const totalPrice = mattressPrice + basePrice + (protectionPlan ? protectionPrice : 0)
  const financedAmount = totalPrice - downPayment
  
  // Calculate monthly payment
  const calculateMonthly = (months: number, apr: number) => {
    if (months === 0) return 0
    if (apr === 0) return financedAmount / months
    
    const monthlyRate = apr / 100 / 12
    const payment = (financedAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1)
    return payment
  }
  
  // Qualification check (debt-to-income)
  const maxMonthlyPayment = (customerIncome / 12) * 0.15 // 15% of monthly income
  
  // Competitor comparison (rough market data)
  const competitors = [
    { name: 'Casper', price: mattressPrice * 0.95, type: 'Online' },
    { name: 'Tempur-Pedic', price: mattressPrice * 1.4, type: 'Premium' },
    { name: 'Sleep Number', price: mattressPrice * 1.6, type: 'Adjustable' },
  ]
  
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Quote-to-Close</h1>
                <p className="text-xs text-gray-400">Mattress Financing Calculator</p>
              </div>
            </div>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Print Quote
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Price Inputs */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary-400" />
            Build Your Sleep System
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Mattress Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={mattressPrice}
                  onChange={(e) => setMattressPrice(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Adjustable Base (optional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Down Payment</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Customer Annual Income</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={customerIncome}
                  onChange={(e) => setCustomerIncome(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">For qualification estimate</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="protection"
              checked={protectionPlan}
              onChange={(e) => setProtectionPlan(e.target.checked)}
              className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600"
            />
            <label htmlFor="protection" className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Include Protection Plan ({formatCurrency(protectionPrice)})</span>
            </label>
          </div>
        </div>

        {/* Total & Financing */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-primary-200 text-sm">Total Investment</p>
              <p className="text-4xl font-bold">{formatCurrency(totalPrice)}</p>
              <p className="text-primary-200 text-sm mt-1">
                Financed: {formatCurrency(financedAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-primary-200 text-sm">Qualification</p>
              <p className={`text-lg font-semibold ${financedAmount / 36 > maxMonthlyPayment ? 'text-red-300' : 'text-green-300'}`}>
                {financedAmount / 36 > maxMonthlyPayment ? 'Review Required' : 'Pre-Qualified'}
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Payment Options
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {FINANCING_OPTIONS.map((option) => {
              const monthly = calculateMonthly(option.months, option.apr)
              const totalCost = option.apr === 0 ? totalPrice : (monthly * option.months) + downPayment
              const interestCost = totalCost - totalPrice
              
              return (
                <div 
                  key={option.months}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    option.months === 0 
                      ? 'bg-white/10 border-white/30' 
                      : monthly <= maxMonthlyPayment
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-yellow-500/20 border-yellow-500/50'
                  }`}
                >
                  <p className="text-xs text-primary-200">{option.name}</p>
                  <p className="text-2xl font-bold">
                    {option.months === 0 ? 'Pay Now' : formatCurrency(monthly)}
                  </p>
                  {option.months > 0 && (
                    <>
                      <p className="text-xs text-primary-200">/month</p>
                      {interestCost > 0 && (
                        <p className="text-xs text-red-300 mt-1">
                          +{formatCurrency(interestCost)} interest
                        </p>
                      )}
                      {option.apr === 0 && (
                        <p className="text-xs text-green-300 mt-1">0% APR</p>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ROI Section */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Sleep System ROI
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Better sleep pays for itself. Here's the value you're getting:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {SLEEP_BENEFITS.map((benefit) => (
              <div key={benefit.label} className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-400">
                  {benefit.unit === '$/year' ? '$' : ''}{benefit.value}{benefit.unit === '%' ? '%' : ''}
                </p>
                <p className="text-sm text-gray-300 mt-1">{benefit.label}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">10-Year Sleep Value</span>
              <span className="text-2xl font-bold text-green-400">{formatCurrency(5400)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Based on health savings, productivity gains, and improved quality of life
            </p>
          </div>
        </div>

        {/* Competitor Comparison */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Market Comparison</h2>
          <div className="space-y-3">
            {competitors.map((comp) => (
              <div key={comp.name} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">{comp.name}</p>
                  <p className="text-xs text-gray-400">{comp.type}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(comp.price)}</p>
                  <p className={`text-xs ${comp.price > totalPrice ? 'text-green-400' : 'text-gray-400'}`}>
                    {comp.price > totalPrice ? 'We save you ' + formatCurrency(comp.price - totalPrice) : ''}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center p-3 bg-primary-600 rounded-lg border-2 border-primary-400">
              <div>
                <p className="font-bold">Your Quote</p>
                <p className="text-xs text-primary-200">Mattress Firm + Expert Service</p>
              </div>
              <p className="text-xl font-bold">{formatCurrency(totalPrice)}</p>
            </div>
          </div>
        </div>

        {/* Close CTA */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-center">
          <Moon className="w-12 h-12 mx-auto mb-3 text-green-200" />
          <h2 className="text-2xl font-bold mb-2">Ready to Sleep Better?</h2>
          <p className="text-green-100 mb-4">
            {formatCurrency(totalPrice / 365 / 10)} per night over 10 years
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-white text-green-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
              Schedule Delivery
            </button>
            <button 
              onClick={() => {
                setMattressPrice(2499)
                setBasePrice(0)
                setDownPayment(0)
                setProtectionPlan(true)
              }}
              className="px-8 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
