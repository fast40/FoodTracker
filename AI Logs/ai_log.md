TEAMMATE 1:

AI Tools Used:
> Claude

General Uses:
> Asking for general advice for java specific implementation details
    > ex. Using Records as a DTO (Data Transfer Object) in place of C++ structs

Specific Prompts
> As the implementation surrounding Users is work in progress from a different contributor
> could you help me finish this temporary test java class that generates test foodItems, and
> foodLogs and adds them to the SQL database. I have attached my current skeleton code, 
> data access objects (DAOs), and wrapper classes.
    > Attached FoodDAO
    > Attached HistoryDAO
    > Attached Setup.sql
    > Attached FoodItem (Wrapper)
    > Attached FoodLog (Wrapper)
    > Attached Dashboard (Servlet)



TEAMMATE 2:

In order to ensure that the copilot's generation is aligned with the API documentation, I copied the USDA food API schema from their OpenAPI documentation into `docs/`, and attached it in a conversation with copilot. I sent the following propmt together:

> Analyze the nutrient data schema used in the food tracking app and its alignment with what the API will return. Also identify the difference between labelNutrients and foodNutrients in the API response to see what we should use. The app should track the total amount of nutrients in the food that the user enters and be comprehensive (capture all data returned by the API)

Aligned with my observation, the copilot identified that the existing database schema and data structure does not match the API response. I then prompted:

> Redesign the schema from scratch to maximize alignment and maintainability. Ignore the existing schema and don't be limited by it

After the copilot update the database schemas, I instructed it to update the Java code to integrate the API. Finding that it hardcoded the API key, I asked it to instead read it from a `.env` file. I also asked it to provide type definitions for the front end team to work on.



TEAMMATE 3:

AI Tools Used:
> ChatGPT

~~~~~~~~~~~~~
Successful prompt sample:

[attached dayGraph.jsx]
Given this .jsx file for a stacked bar graph, please complete the following task:

> Recall that order of the stacked bars is crucial--the first color in the palette & first element in alphabetical order should always be on the bottom. When switching the date between 2 days with a *shared food item*, however, Recharts displays that shared item at the bottom instead of its correct position. I've verified that the foodsSorted array is computed correctly, so this is purely an issue with how Recharts is updating the BarChart between date changes. You need to re-render the order so that items maintain the correct color/alphabetical order regardless of previous values.

First explain your conceptual approach, and then provide minimal code snippets necessary for solving the task, highlighting only lines changed or added, not full code blocks. Explain each key line added so that your code is easy to follow.

~~ The AI explained a correct single-line fix, which I implemented into my code

~~~~~~~~~~~~~
Iteration sample:

// TODO: add more prompt samples



TEAMMATE 4:

AI Tools Used:
> ChatGPT

1) Prompt: 
“Write a helper function that loads nutrient visibility settings from localStorage. It should read the nutrientVisibility key, parse it safely, and fall back to default visibility settings if anything is missing.”

2) Issue: 
The AI produced a version that just grabbed the localStorage value and tried to parse it with JSON.parse without any protection which caused two major issues: 
If the saved JSON was corrupted, the whole page crashed because the AI did not include error handling.
It didn’t merge missing values with the default settings. Because of that the visibility object could have gaps that caused certain nutrient fields to disappear or behave incorrectly.

3) Fix (correctness):
I added proper error handling so that if the stored JSON is invalid, the app doesn’t crash and instead falls back to safe defaults
I made sure that even when a user only changes some visibility settings, any missing ones are filled in automatically using default values 
I made the function return a complete, clean visibility object every time, and it prevented undefined fields from breaking the UI

4) Explanation (depth): 
These fixes matter because without safety checks, the entire AddFood page would break whenever localStorage contained bad or incomplete data. By adding fallback logic and merging defaults, the visibility system stays consistent with the rest of the app, and the form always works correctly regardless of user settings or corrupted storage. This improves stability, user experience, and prevents unpredictable UI behavior.


1) Prompt: 
“Write a helper function that transforms the backend’s ‘days’ array into the format my History page expects. Each day should contain: date, entries[], and each entry should include id, name, nutrients, servings, and the time consumed.”

2) Issue: 
The first issue was that the AI didn’t match the backend nutrient IDs correctly. The AI assumed the nutrient IDs would match the keys directly (like "protein_g"), but my backend uses numeric IDs, and I must map them using the NUTRIENTS array. The incorrect assumption caused nutrients to show up as undefined or missing entirely in the History table.
The second isse was that the AI ignored the serving field. The transformation always set servings to 1, even when the backend provided the correct servings under food.consumed.servings. This caused the final totals, averages, and daily nutrient chips to show the wrong numbers, making the history calculation inaccurate.

3) Fix (correctness): 
I rewrote the mapping logic so that each backend nutrient ID is properly matched to one of my defined NUTRIENTS objects. This makes sure every nutrient goes into the correct bucket (protein_g, carbs_g, etc.)
I made sure servings are fully preserved by reading the servings value from the backend’s consumed object instead of defaulting to 1.
I cleaned up the transformation structure so that the History page receives entries in the exact shape required by the daily totals calculator and table display.
These changes made sure that the History page displays the right nutrient values, the right totals, and the right averages.

4) Explanation (depth):
Fixing these problems was important because incorrect nutrient-to-ID mapping breaks every nutrient calculation on the History page, including totals, averages, daily chips, and table columns. Servings also play a major role in accurate nutrition tracking. Making sure that the transformation function matches backend IDs correctly and preserves servings guarantees consistency across the entire UI and prevents misleading nutrition data.



//TODO: fill out AI logs for remaining teammates
