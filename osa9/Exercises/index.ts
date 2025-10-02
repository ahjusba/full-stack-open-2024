import express from 'express';
import calculateBmi from './bmiCalculator';
import { calculateExercise } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send("Hello Full Stack!");
});

app.get('/bmi', (req, res) => {
    const { height, weight } = req.query;

    const heightNum = Number(height);
    const weightNum = Number(weight);

    if (!height || !weight || isNaN(heightNum) || isNaN(weightNum)) {
        return res.status(400).json({ error: "malformatted parameters." });
    }

    const bmiDescription = calculateBmi(heightNum, weightNum);
    return res.json({
        height: heightNum,
        weight: weightNum,
        bmi: bmiDescription
    });
});

app.post('/exercises', (req, res) => {
    console.log("Body:", req.body);
    const { daily_exercises, target } = req.body;

    if (!daily_exercises || !target) 
        return res.status(400).json({ error: "Missing parameters." });
    if (!Array.isArray(daily_exercises) 
        || !daily_exercises.every((n: any) => typeof n === 'number')
        || isNaN(Number(target)))
        return res.status(400).json({ error: "Malformatted parameters." });

    const result = calculateExercise(Number(target), daily_exercises);
    return res.send(result);
});

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});