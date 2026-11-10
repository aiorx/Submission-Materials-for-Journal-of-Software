//Assisted using common GitHub development utilities

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';

const CalorieCalculator = () => {
  
  const { user } = useAuth();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [gender, setGender] = useState('male');
  const [unit, setUnit] = useState('metric');
  const [calories, setCalories] = useState(null);
  

  const calculateCalories = () => {
    let weightInKg = parseFloat(weight);
    let heightInCm = parseFloat(height);
    if (unit === 'imperial') {
      weightInKg = weightInKg * 0.453592;
      heightInCm = heightInCm * 2.54;
    }

    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * parseFloat(age) + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * parseFloat(age) - 161;
    }

    const activityFactors = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
      athlete: 2.0,
    };

    const dailyCalories = bmr * activityFactors[activityLevel];
    setCalories(dailyCalories.toFixed(2));
  };

  const uploadDailyCalorieIntake = async () => {
    const timestamp = new Date().toISOString();
    const { data, error } = await supabase
      .from('dailyIntake')
      .insert([
        { 
          calories, 
          activityLevel, 
          user_id: user.id, 
          timestamp 
        }
      ]);

    if (error) {
      console.error('Error uploading daily calorie intake:', error);
    } else {
      console.log('Daily calorie intake uploaded successfully:', data);
    }
  };

  return (
    <div className="flex-col border-4 py-8 px-4 rounded-xl border-zinc-300 flex items-center gap-4">
      <label>
        <select className="select select-bordered text-lg border-2 text-secondary lg:text-2xl w-full max-w-xs" value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="metric">Metric (kg/cm)</option>
          <option value="imperial">Imperial (lbs/inches)</option>
        </select>
      </label>
      <div className="flex gap-4">
      <label>
        <select className="select text-lg select-bordered text-secondary border-2 w-full max-w-xs" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </label>
        <label className="input max-w-[200px] lg:max-w-[300px] input-bordered py-4 text-secondary flex border-2 items-center gap-2">
            <input
                type="number"
                placeholder="Age"
                className="text-md"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />
        </label>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
      <label className="input max-w-[300px] input-bordered py-4 text-secondary flex border-2 items-center gap-2">
        <input
            type="number"
            placeholder={unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
            value={weight}
            className="text-md"
            onChange={(e) => setWeight(e.target.value)}
        />
        </label>
        <label className="input max-w-[300px] input-bordered py-4 text-secondary flex border-2 items-center gap-2">
      <input
        type="number"
        placeholder={unit === 'metric' ? 'Height (cm)' : 'Height (inches)'}
        value={height}
        className="text-md"
        onChange={(e) => setHeight(e.target.value)}
      />
      </label>
      </div>
      <label>
        <label className="text-lg text-secondary">Activity Level:</label>
        <select className="select min-w-[235px] lg:max-w-[300px] text-lg select-bordered text-secondary border-2 w-full" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
          <option value="sedentary">Sedentary</option>
          <option value="lightly_active">Lightly Active</option>
          <option value="moderately_active">Moderately Active</option>
          <option value="very_active">Very Active</option>
          <option value="extra_active">Extra Active</option>
          <option value="Athlete">Athlete</option>
        </select>
      </label>
      <button className="btn btn-secondary text-2xl" onClick={calculateCalories}>Calculate</button>
      {calories && 
      <div>
        <h3 className="text-2xl">Your Daily Calorie Intake is: 
        <br /> 
        <span className="font-bold">{calories} kcal</span></h3>
        <br />
        <button className="btn btn-accent text-white text-2xl" onClick={uploadDailyCalorieIntake}>Save Daily Calorie Intake</button>
      </div>
      }
    </div>
  );
};

export default CalorieCalculator;