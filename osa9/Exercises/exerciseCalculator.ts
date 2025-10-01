type Rating =   { ratingNumber: 1, ratingDescription: "bad" } | 
                { ratingNumber: 2, ratingDescription: "ok" } | 
                { ratingNumber: 3, ratingDescription: "good" }

interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

const calculateExercise = (dailyHours: number[], target: number): Result => {

    const average = dailyHours.reduce((acc, curr) => acc + curr, 0) / dailyHours.length
    const result: Result = {
        periodLength: dailyHours.length,
        trainingDays: dailyHours.filter(num => num !== 0).length,
        success: average >= target,
        rating: getRatingObject(average, target).ratingNumber,
        ratingDescription: getRatingObject(average, target).ratingDescription,
        target: target,
        average: average
    }

    return result
}   

const getRatingObject = (average: number, target: number): Rating => {
    switch (true) {
        case average < target / 2:
            return {  ratingNumber: 1, ratingDescription: "bad" }
        case average >= target:
            return { ratingNumber: 3, ratingDescription: "good" }
        default:
            return { ratingNumber: 2, ratingDescription: "ok" }
    }
}

console.log(calculateExercise([3, 0, 2, 4.5, 0, 3, 1], 2))