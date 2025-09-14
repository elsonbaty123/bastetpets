/**
 * Cat nutrition calculation utilities
 * Based on NRC (National Research Council) guidelines for feline nutrition
 */

export interface CatData {
  weight_kg: number
  age_months: number
  activity_level: 'low' | 'normal' | 'high'
  neutered: boolean
  body_condition_score: number
  health_issues: string[]
  allergies: string[]
  feeding_times_per_day: number
  food_preferences: {
    wet: boolean
    dry: boolean
    raw: boolean
  }
}

export interface CalorieCalculation {
  rer: number // Resting Energy Requirement
  mer: number // Maintenance Energy Requirement
  daily_calories: number
  daily_grams: number
  activity_factor: number
  weight_factor: number
}

/**
 * Calculate Resting Energy Requirement (RER)
 * Formula: RER = 70 × (body weight in kg)^0.75
 */
export function calculateRER(weightKg: number): number {
  return 70 * Math.pow(weightKg, 0.75)
}

/**
 * Get activity factor based on cat's characteristics
 */
export function getActivityFactor(
  activityLevel: 'low' | 'normal' | 'high',
  neutered: boolean,
  ageMonths: number,
  bodyConditionScore: number
): number {
  let factor = 1.0

  // Base activity factor
  switch (activityLevel) {
    case 'low':
      factor = 1.2
      break
    case 'normal':
      factor = 1.4
      break
    case 'high':
      factor = 1.6
      break
  }

  // Adjust for neutered status - typically reduces by 10-20%
  if (neutered) {
    factor *= 0.9
  }

  // Adjust for age
  if (ageMonths < 12) {
    // Kittens need more energy
    if (ageMonths < 4) {
      factor *= 2.5
    } else if (ageMonths < 6) {
      factor *= 2.0
    } else {
      factor *= 1.8
    }
  } else if (ageMonths > 84) {
    // Senior cats (7+ years) may need slight reduction
    factor *= 0.95
  }

  // Adjust for body condition
  if (bodyConditionScore <= 3) {
    // Underweight - increase calories
    factor *= 1.2
  } else if (bodyConditionScore >= 7) {
    // Overweight - reduce calories
    factor *= 0.8
  }

  return factor
}

/**
 * Get weight adjustment factor for ideal body weight
 */
export function getWeightFactor(bodyConditionScore: number): number {
  // If overweight, calculate calories based on ideal weight
  if (bodyConditionScore >= 7) {
    return 0.85 // Assume current weight is 15% over ideal
  } else if (bodyConditionScore >= 6) {
    return 0.9 // Assume current weight is 10% over ideal
  }
  return 1.0 // Use current weight
}

/**
 * Calculate daily calorie and food requirements
 */
export function calculateDailyRequirements(
  catData: CatData,
  caloriesDensityPer100g: number = 350
): CalorieCalculation {
  const rer = calculateRER(catData.weight_kg)
  const activityFactor = getActivityFactor(
    catData.activity_level,
    catData.neutered,
    catData.age_months,
    catData.body_condition_score
  )
  const weightFactor = getWeightFactor(catData.body_condition_score)
  
  const adjustedWeight = catData.weight_kg * weightFactor
  const adjustedRER = calculateRER(adjustedWeight)
  const mer = adjustedRER * activityFactor
  
  // Add health condition adjustments
  let finalCalories = mer
  if (catData.health_issues.includes('مرض السكري')) {
    finalCalories *= 0.9 // Slight reduction for diabetic cats
  }
  if (catData.health_issues.includes('أمراض الكلى')) {
    finalCalories *= 0.95 // Moderate reduction for kidney issues
  }
  
  const dailyGrams = (finalCalories / caloriesDensityPer100g) * 100
  
  return {
    rer,
    mer,
    daily_calories: Math.round(finalCalories),
    daily_grams: Math.round(dailyGrams * 10) / 10, // Round to 1 decimal
    activity_factor: activityFactor,
    weight_factor: weightFactor
  }
}

/**
 * Generate menu rotation based on preferences and restrictions
 */
export function generateMenuRotation(
  catData: CatData,
  days: number = 7
): string[] {
  const baseProteins = ['دجاج', 'سمك السلمون', 'لحم بقري', 'تونة', 'ديك رومي']
  const allergies = catData.allergies || []
  
  // Filter out allergens
  const availableProteins = baseProteins.filter(
    protein => !allergies.some((allergy: string) => 
      protein.includes(allergy) || allergy.includes(protein)
    )
  )
  
  if (availableProteins.length === 0) {
    availableProteins.push('طعام خاص للحساسية')
  }
  
  const menu: string[] = []
  
  for (let i = 0; i < days; i++) {
    const proteinIndex = i % availableProteins.length
    const protein = availableProteins[proteinIndex]
    
    // Vary the preparation style
    const styles = ['مطبوخ طازج', 'مشوي', 'مسلوق']
    const style = styles[i % styles.length]
    
    menu.push(`${protein} ${style}`)
  }
  
  return menu
}

/**
 * Generate add-ons based on health needs
 */
export function generateAddOns(catData: CatData): string[] {
  const addOns: string[] = []
  
  if (catData.age_months < 12) {
    addOns.push('مكملات النمو للقطط الصغيرة')
  }
  
  if (catData.age_months > 84) {
    addOns.push('مكملات للقطط كبيرة السن')
  }
  
  if (catData.health_issues.includes('مشاكل المفاصل')) {
    addOns.push('مكملات الجلوكوزامين')
  }
  
  if (catData.health_issues.includes('حساسية جلدية')) {
    addOns.push('أوميجا 3 للصحة الجلدية')
  }
  
  if (catData.health_issues.includes('مشاكل هضمية')) {
    addOns.push('بروبيوتيك للهضم')
  }
  
  if (catData.body_condition_score >= 7) {
    addOns.push('مكملات التحكم في الوزن')
  }
  
  if (catData.body_condition_score <= 3) {
    addOns.push('مكملات زيادة الوزن')
  }
  
  // Default essentials
  if (addOns.length === 0) {
    addOns.push('فيتامينات أساسية')
  }
  
  return addOns
}

/**
 * Get feeding recommendations
 */
export function getFeedingRecommendations(catData: CatData): {
  timesPerDay: number
  portionSize: number
  tips: string[]
} {
  const calculation = calculateDailyRequirements(catData)
  const timesPerDay = catData.feeding_times_per_day || 2
  const portionSize = Math.round((calculation.daily_grams / timesPerDay) * 10) / 10
  
  const tips: string[] = [
    `قسم الطعام على ${timesPerDay} وجبات يومياً`,
    `كل وجبة ${portionSize} جرام`,
    'وفر مياه عذبة دائماً',
    'راقب وزن قطتك أسبوعياً'
  ]
  
  if (catData.age_months < 12) {
    tips.push('القطط الصغيرة تحتاج وجبات أكثر تكراراً')
  }
  
  if (catData.health_issues.includes('مرض السكري')) {
    tips.push('اعط الطعام قبل حقن الأنسولين')
  }
  
  if (catData.body_condition_score >= 7) {
    tips.push('استخدم ألعاب التفاعل لزيادة النشاط')
  }
  
  return {
    timesPerDay,
    portionSize,
    tips
  }
}