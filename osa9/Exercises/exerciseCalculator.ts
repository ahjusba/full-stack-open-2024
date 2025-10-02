
type Rating = {
  ratingNumber: 1 | 2 | 3
  ratingDescription: string
}

interface Result {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

const getRatingObject = (average: number, target: number): Rating => {
  if (average < target / 2) {
    return { ratingNumber: 1, ratingDescription: "bad" }
  } else if (average >= target) {
    return { ratingNumber: 3, ratingDescription: "good" }
  } else {
    return { ratingNumber: 2, ratingDescription: "ok" }
  }
}

const calculateExercise = (target: number, dailyHours: number[]): Result => {
  if (dailyHours.length === 0) {
    throw new Error("dailyHours array cannot be empty")
  }

  const average = dailyHours.reduce((acc, curr) => acc + curr, 0) / dailyHours.length
  const trainingDays = dailyHours.filter(h => h > 0).length
  const success = average >= target
  const ratingObj = getRatingObject(average, target)

  return {
    periodLength: dailyHours.length,
    trainingDays,
    success,
    rating: ratingObj.ratingNumber,
    ratingDescription: ratingObj.ratingDescription,
    target,
    average
  }
}

const parseArguments = (args: string[]): { target: number, dailyHours: number[] } => {
  if (args.length < 4) throw new Error('Not enough arguments')

  const numericArgs = args.slice(3)
  if (numericArgs.some(arg => isNaN(Number(arg)))) {
    throw new Error('Provided values were not numbers.')
  }

  const target: number = Number(args[2])
  const dailyHours: number[] = numericArgs.map(Number)

  return { target, dailyHours }
}

try {
  const { target, dailyHours } = parseArguments(process.argv)
  console.log(calculateExercise(target, dailyHours))

} catch (error: unknown) {
  let errorMessage = "Failure occured. "
  if (error instanceof Error) {
    errorMessage += 'Error: ' + error.message
  }
  console.log(errorMessage)
}

export { calculateExercise }

// console.log(calculateExercise([3, 0, 2, 4.5, 0, 3, 1], 2))