const calculateBmi = (height: number, weigth: number): string => {
    const bmi = weigth / (height / 100) ** 2    
    switch (true) {
        case (bmi < 16.0):
        return "Underweight (Severe thinness)";
        case (bmi >= 16.0 && bmi < 17.0):
        return "Underweight (Moderate thinness)";
        case (bmi >= 17.0 && bmi < 18.5):
        return "Underweight (Mild thinness)";
        case (bmi >= 18.5 && bmi < 25.0):
        return "Normal range";
        case (bmi >= 25.0 && bmi < 30.0):
        return "Overweight (Pre-obese)";
        case (bmi >= 30.0 && bmi < 35.0):
        return "Obese (Class I)";
        case (bmi >= 35.0 && bmi < 40.0):
        return "Obese (Class II)";
        case (bmi >= 40.0):
        return "Obese (Class III)";
        default:
      return "Invalid BMI";
    }
}

const parseArguments = ( args: string[] ): { height: number, weight: number } => {
    if (args.length < 4) throw new Error("There are too few arguments.")
    if (args.length > 6) throw new Error("There are too many arguments.")
    
    const height = Number(args[2])
    const weight = Number(args[3])

    if((isNaN(height)) || isNaN(weight)) throw new Error("Input was not a number.")

    return { height, weight }
}

if(require.main === module) {
    try {
    const { height, weight } = parseArguments(process.argv)
    console.log("BMI: ", calculateBmi(height, weight))    
    } catch (error: unknown) {
        let errorMessage = "Failure occured. "
        if (error instanceof Error) {
            errorMessage += 'Error: ' + error.message
        }
        console.log(errorMessage)
    }
}

export default calculateBmi