import { useState } from 'react'
import './index.css'
import { Calculator, DollarSign, Clock, Download, RefreshCcw, TrendingUp, Moon, Shield, Gift, Users, UserCheck, Tag, CheckCircle } from 'lucide-react'

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

// Delivery options
const DELIVERY_OPTIONS = [
  { id: 'none', label: 'None', price: 0 },
  { id: 'setup-haul', label: 'Setup + Haul Away', price: 100 },
  { id: 'base-setup-haul', label: 'Adjustable Base Setup + Haul Away', price: 150 },
  { id: 'base-setup-base-haul', label: 'Adjustable Base Setup + Adjustable Base Haul Away', price: 180 },
]

// Instant Gift options
const INSTANT_GIFT_OPTIONS = [
  { id: 'none', label: 'None', price: 0 },
  { id: '200', label: '$200', price: 200 },
  { id: '300', label: '$300', price: 300 },
]

function App() {
  // Core inputs
  const [mattressPrice, setMattressPrice] = useState<number>(2499)
  const [basePrice, setBasePrice] = useState<number>(0)
  const [downPayment, setDownPayment] = useState<number>(0)
  
  // Protection plans
  const [mattressProtection, setMattressProtection] = useState<boolean>(false)
  const [baseProtection, setBaseProtection] = useState<boolean>(false)
  const mattressProtectionPrice = 100
  const baseProtectionPrice = 250
  
  // New add-ons
  const [protectionPlan, setProtectionPlan] = useState<boolean>(false)
  const [mattressProtectorCount, setMattressProtectorCount] = useState<number>(0)
  const [deliveryOption, setDeliveryOption] = useState<string>('none')
  const [pillowCount, setPillowCount] = useState<number>(0)
  const [sheets, setSheets] = useState<boolean>(false)
  const [instantGift, setInstantGift] = useState<string>('none')
  
  // Get delivery price
  const deliveryPrice = DELIVERY_OPTIONS.find(d => d.id === deliveryOption)?.price || 0
  const instantGiftPrice = INSTANT_GIFT_OPTIONS.find(g => g.id === instantGift)?.price || 0
  
  // Total Investment calculation
  const totalPrice = mattressPrice 
    + basePrice 
    + (mattressProtection ? mattressProtectionPrice : 0)
    + (baseProtection ? baseProtectionPrice : 0)
    + (protectionPlan ? 350 : 0)
    + (mattressProtectorCount * 100)
    + deliveryPrice
    + (pillowCount * 100)
    + (sheets ? 100 : 0)
  
  const financedAmount = totalPrice - downPayment
  
  // Manager Approval calculation
  const managerDiscount = 
    (mattressProtection ? mattressProtectionPrice : 0)
    + (baseProtection ? baseProtectionPrice : 0)
    + (protectionPlan ? 350 : 0)
    + (mattressProtectorCount * 100)
    + deliveryPrice
    + (pillowCount * 100)
    + (sheets ? 100 : 0)
    + instantGiftPrice
  
  const managerNewTotal = totalPrice - managerDiscount
  
  // Friends & Family - CORRECTED MATH: F&F = (Total - managerDiscount) × 0.10 = managerNewTotal × 0.10
  const ffDiscount = managerNewTotal * 0.10
  const ffNewTotal = managerNewTotal - ffDiscount
  
  // Clearance section - uses ONLY mattress price × 0.50
  const clearanceDiscount = mattressPrice * 0.50
  const clearanceNewTotal = mattressPrice * 0.50
  
  // Calculate monthly payment
  const calculateMonthly = (months: number) => {
    if (months === 0) return 0
    return financedAmount / months
  }
  
  // Calculate gift card amount
  const calculateGiftCard = (months: number) => {
    if (months <= 24 && totalPrice >= 1999) {
      return totalPrice * 0.03
    }
    return 0
  }
  
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

  const availableOptions = FINANCING_OPTIONS.filter(option => 
    totalPrice >= option.minSpend
  )

  // Build "What's Included Free" list - dynamic, only show selected items
  const freeItems: string[] = []
  if (mattressProtection) freeItems.push(`Free 10-Year Mattress Protection (${formatCurrency(mattressProtectionPrice)})`)
  if (baseProtection) freeItems.push(`Free 10-Year Base Protection (${formatCurrency(baseProtectionPrice)})`)
  if (protectionPlan) freeItems.push(`Free Protection Plan (${formatCurrency(350)})`)
  if (mattressProtectorCount > 0) freeItems.push(`Free Mattress Protector × ${mattressProtectorCount} (${formatCurrency(mattressProtectorCount * 100)})`)
  if (deliveryOption === 'setup-haul') freeItems.push(`Free Setup + Haul Away (${formatCurrency(100)})`)
  if (deliveryOption === 'base-setup-haul') freeItems.push(`Free Adjustable Base Setup + Haul Away (${formatCurrency(150)})`)
  if (deliveryOption === 'base-setup-base-haul') freeItems.push(`Free Adjustable Base Setup + Adjustable Base Haul Away (${formatCurrency(180)})`)
  if (pillowCount > 0) freeItems.push(`Free Pillows × ${pillowCount} (${formatCurrency(pillowCount * 100)})`)
  if (sheets) freeItems.push(`Free Sheets (${formatCurrency(100)})`)
  if (instantGift === '200') freeItems.push(`$200 Cash Back`)
  if (instantGift === '300') freeItems.push(`$300 Cash Back`)
  
  const hasFreeItems = freeItems.length > 0

  // Reset function
  const handleReset = () => {
    setMattressPrice(2499)
    setBasePrice(0)
    setDownPayment(0)
    setMattressProtection(false)
    setBaseProtection(false)
    setProtectionPlan(false)
    setMattressProtectorCount(0)
    setDeliveryOption('none')
    setPillowCount(0)
    setSheets(false)
    setInstantGift('none')
  }

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
        {/* Build Your Sleep System */}
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
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="mattressProtection"
                checked={mattressProtection}
                onChange={(e) => setMattressProtection(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600"
              />
              <label htmlFor="mattressProtection" className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>10-Year Mattress Protection ({formatCurrency(mattressProtectionPrice)})</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="baseProtection"
                checked={baseProtection}
                onChange={(e) => setBaseProtection(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600"
              />
              <label htmlFor="baseProtection" className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>10-Year Base Protection ({formatCurrency(baseProtectionPrice)})</span>
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="protectionPlan"
                checked={protectionPlan}
                onChange={(e) => setProtectionPlan(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600"
              />
              <label htmlFor="protectionPlan" className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Protection Plan ({formatCurrency(350)})</span>
              </label>
            </div>
            
            {/* CHANGE 1: Mattress Protector as stepper (0-10) */}
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-2">Mattress Protector ({formatCurrency(100)} each)</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMattressProtectorCount(Math.max(0, mattressProtectorCount - 1))}
                  className="w-10 h-10 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600"
                >
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  value={mattressProtectorCount}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setMattressProtectorCount(Math.min(10, Math.max(0, val)))
                  }}
                  min={0}
                  max={10}
                  className="w-20 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:border-primary-500 focus:outline-none"
                />
                <button
                  onClick={() => setMattressProtectorCount(Math.min(10, mattressProtectorCount + 1))}
                  className="w-10 h-10 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Delivery radio group */}
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-2">Delivery & Setup</label>
              <div className="space-y-2">
                {DELIVERY_OPTIONS.map((option) => (
                  <div key={option.id} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      id={`delivery-${option.id}`}
                      checked={deliveryOption === option.id}
                      onChange={() => setDeliveryOption(option.id)}
                      className="w-5 h-5 border-gray-600 bg-gray-700 text-primary-600"
                    />
                    <label htmlFor={`delivery-${option.id}`} className="flex items-center gap-2">
                      <span>{option.label}</span>
                      {option.price > 0 && <span className="text-gray-400">({formatCurrency(option.price)})</span>}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Pillows stepper */}
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-2">Pillows ({formatCurrency(100)} each)</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPillowCount(Math.max(0, pillowCount - 1))}
                  className="w-10 h-10 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600"
                >
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  value={pillowCount}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setPillowCount(Math.min(10, Math.max(0, val)))
                  }}
                  min={0}
                  max={10}
                  className="w-20 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center focus:border-primary-500 focus:outline-none"
                />
                <button
                  onClick={() => setPillowCount(Math.min(10, pillowCount + 1))}
                  className="w-10 h-10 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Sheets checkbox */}
            <div className="flex items-center gap-3 mt-4">
              <input
                type="checkbox"
                id="sheets"
                checked={sheets}
                onChange={(e) => setSheets(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-primary-600"
              />
              <label htmlFor="sheets" className="flex items-center gap-2">
                <span>Sheets ({formatCurrency(100)})</span>
              </label>
            </div>
            
            {/* Instant Gift radio group */}
            <div className="mt-4">
              <label className="block text-sm text-gray-400 mb-2">Instant Gift (manager approval ask only — does NOT add to customer total)</label>
              <div className="space-y-2">
                {INSTANT_GIFT_OPTIONS.map((option) => (
                  <div key={option.id} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="instantGift"
                      id={`instantGift-${option.id}`}
                      checked={instantGift === option.id}
                      onChange={() => setInstantGift(option.id)}
                      className="w-5 h-5 border-gray-600 bg-gray-700 text-primary-600"
                    />
                    <label htmlFor={`instantGift-${option.id}`} className="flex items-center gap-2">
                      <span>{option.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
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
          </div>
          
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            0% APR Payment Options
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableOptions.map((option) => {
              const monthly = calculateMonthly(option.months)
              const giftCardAmount = calculateGiftCard(option.months)
              
              return (
                <div 
                  key={option.months}
                  className="p-4 rounded-lg border-2 transition-all bg-green-500/20 border-green-500/50"
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
                </div>
              )
            })}
          </div>
          
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
          
          {totalPrice < 3299 && (
            <p className="mt-3 text-xs text-primary-200">
              * 72 months requires $3,299 minimum purchase
            </p>
          )}
        </div>

        {/* Close CTA */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-center">
          <Moon className="w-12 h-12 mx-auto mb-3 text-green-200" />
          <h2 className="text-2xl font-bold mb-2">Ready to Sleep Better?</h2>
          <p className="text-green-100 mb-4">
            {formatCurrency(totalPrice / 365 / 10)} per night over 10 years
          </p>
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

        {/* Manager Approval Section - REORDERED: Discount Off ABOVE New Total */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-yellow-400" />
            Manager Approval
          </h2>
          <p className="text-gray-400 text-sm mb-4">Discount to offer with manager approval</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
              <p className="text-green-200 text-sm">Discount Off</p>
              <p className="text-3xl font-bold text-green-400">{formatCurrency(managerDiscount)}</p>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-center">
              <p className="text-yellow-200 text-sm">New Total</p>
              <p className="text-3xl font-bold text-yellow-400">{formatCurrency(managerNewTotal)}</p>
            </div>
          </div>
          
          {/* CHANGE 5: What's Included Free - dynamic list */}
          {hasFreeItems && (
            <div className="mt-4 pt-4 border-t border-gray-600">
              <p className="text-sm text-gray-400 mb-2">What's Included Free</p>
              <p className="text-xs text-gray-500 mb-2">Use this list when presenting to the customer.</p>
              <ul className="space-y-1">
                {freeItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-green-300">
                    <CheckCircle className="w-4 h-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Friends & Family - WITH New Total line */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Friends & Family Discount
          </h2>
          <p className="text-gray-400 text-sm mb-4">10% of the manager-approved savings</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4 text-center">
              <p className="text-purple-200 text-sm">Discount Off</p>
              <p className="text-3xl font-bold text-purple-400">{formatCurrency(ffDiscount)}</p>
            </div>
            <div className="bg-indigo-500/20 border border-indigo-500/50 rounded-lg p-4 text-center">
              <p className="text-indigo-200 text-sm">New Total</p>
              <p className="text-3xl font-bold text-indigo-400">{formatCurrency(ffNewTotal)}</p>
            </div>
          </div>
        </div>

        {/* CHANGE 6: Clearance Section - at bottom */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <Tag className="w-5 h-5 text-red-400" />
            Clearance
          </h2>
          <p className="text-gray-400 text-sm mb-4">If the mattress is on 50% off clearance</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
              <p className="text-red-200 text-sm">Discount Off</p>
              <p className="text-3xl font-bold text-red-400">{formatCurrency(clearanceDiscount)}</p>
            </div>
            <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4 text-center">
              <p className="text-orange-200 text-sm">New Total</p>
              <p className="text-3xl font-bold text-orange-400">{formatCurrency(clearanceNewTotal)}</p>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button 
            onClick={handleReset}
            className="px-8 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset Calculator
          </button>
        </div>
      </main>
    </div>
  )
}

export default App