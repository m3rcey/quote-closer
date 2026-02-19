import { useState } from 'react'
import './index.css'
import { Calculator, DollarSign, Clock, Download, RefreshCcw, TrendingUp, Moon, Shield, Gift } from 'lucide-react'

// Mattress Firm financing - all 0% APR
// 24mo or less: 3% back as Visa gift card (min $1,999)
// 72mo: requires min $3,299
const FINANCING_OPTIONS = [
  { months: 6, name: '6 Months', apr: 0, minSpend: 0, giftCard: true },
  { months: 12, name: '12 Months', apr: 0, minSpend: 0, giftCard: true },
  { months: 24, name: '24 Months', apr: 0, minSpend: 1999, giftCard: true },
  { months: 36, name: '36 Months', apr: 0, minSpend: 0, giftCard: false },
  { months: 48, name: '48 Months', apr: 0, minSpend: 0, giftCard: false },
  { months: 60, name: '60 Months', apr: 0, minSpend: 0, giftCard: false },
  { months: 72, name: '72 Months', apr: 0, minSpend: 3299, giftCard: false },
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
  
  // Calculate monthly payment (all 0% APR, so simple division)
  const calculateMonthly = (months: number) => {
    if (months === 0) return 0
    return financedAmount / months
  }
  
  // Calculate gift card amount (3% back for 24mo or less, min $1,999)
  const calculateGiftCard = (months: number) => {
    if (months <= 24 && totalPrice >= 1999) {
      return totalPrice * 0.03
    }
    return 0
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

  // Filter available options based on minimum spend
  const availableOptions = FINANCING_OPTIONS.filter(option => 
    totalPrice >= option.minSpend
  )

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
                  type="text"
                  inputMode="numeric"
                  value={mattressPrice || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d]/g, '')
                    setMattressPrice(val ? Number(val) : 0)
                  }}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Adjustable Base (optional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={basePrice || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d]/g, '')
                    setBasePrice(val ? Number(val) : 0)
                  }}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Down Payment</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={downPayment || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d]/g, '')
                    setDownPayment(val ? Number(val) : 0)
                  }}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Customer Annual Income</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={customerIncome || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d]/g, '')
                    setCustomerIncome(val ? Number(val) : 0)
                  }}
                  placeholder="0"
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
              <p className={`text-lg font-semibold ${financedAmount / 24 > maxMonthlyPayment ? 'text-red-300' : 'text-green-300'}`}>
                {financedAmount / 24 > maxMonthlyPayment ? 'Review Required' : 'Pre-Qualified'}
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            0% APR Payment Options
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableOptions.map((option) => {
              const monthly = calculateMonthly(option.months)
              const giftCardAmount = calculateGiftCard(option.months)
              const isAffordable = monthly <= maxMonthlyPayment
              
              return (
                <div 
                  key={option.months}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isAffordable
                      ? 'bg-green-500/20 border-green-500/50'
                      : 'bg-yellow-500/20 border-yellow-500/50'
                  }`}
                >
                  <p className="text-xs text-primary-200">{option.name}</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(monthly)}
                  </p>
                  <p className="text-xs text-primary-200">/month</p>
                  
                  {giftCardAmount > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-300 bg-green-900/30 px-2 py-1 rounded">
                      <Gift className="w-3 h-3" />
                      +{formatCurrency(giftCardAmount)} back
                    </div>
                  )}
                  
                  {!isAffordable && (
                    <p className="text-xs text-yellow-300 mt-1">High payment</p>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Gift Card Promo Banner */}
          {totalPrice >= 1999 && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
              <Gift className="w-6 h-6 text-green-400" />
              <div>
                <p className="font-semibold text-green-300">3% Back Promo!</p>
                <p className="text-sm text-green-200">
                  Choose 6, 12, or 24 months and get {formatCurrency(totalPrice * 0.03)} back as a Visa gift card
                </p>
              </div>
            </div>
          )}
          
          {/* 72 Month Requirement */}
          {totalPrice < 3299 && (
            <p className="mt-3 text-xs text-primary-200">
              * 72 months requires $3,299 minimum purchase
            </p>
          )}
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
          <div className="flex justify-center">
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
              Reset Calculator
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
