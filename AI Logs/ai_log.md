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

//TODO: fill out AI logs for remaining teammates