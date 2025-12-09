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


--------------------------------------------------

In order to ensure that the copilot's generation is aligned with the API documentation, I copied the USDA food API schema from their OpenAPI documentation into `docs/`, and attached it in a conversation with copilot. I sent the following propmt together:

> Analyze the nutrient data schema used in the food tracking app and its alignment with what the API will return. Also identify the difference between labelNutrients and foodNutrients in the API response to see what we should use. The app should track the total amount of nutrients in the food that the user enters and be comprehensive (capture all data returned by the API)

Aligned with my observation, the copilot identified that the existing database schema and data structure does not match the API response. I then prompted:

> Redesign the schema from scratch to maximize alignment and maintainability. Ignore the existing schema and don't be limited by it

After the copilot update the database schemas, I instructed it to update the Java code to integrate the API. Finding that it hardcoded the API key, I asked it to instead read it from a `.env` file. I also asked it to provide type definitions for the front end team to work on.

--------------------------------------------------

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

1) Prompt:
"The default <Legend /> for a Recharts BarChart sorts the items alphabetically. Is there an easy way to remove this sorting so that the legend displays in the same order as the stacked bars?"

[AI responds]

"It's still displaying in alphabetical order. Explain the process for how Recharts decides how to order the bars in a stacked bar chart, and the exact process we use to order items in this custom Legend. Why do they not match?"

[AI responds]

2) Issue:
After adding the custom legend code the legend still displayed in alphabetical order, while the bars did not.

3) Fix:
Instead of trying to reorder the legend, I realized that an easier fix would be to reorder the bars themselves by sorting the food data array.

4) Explanation:
This process demonstrates how using AI prompts is useful not only for generating code but for understanding it. Instead of brute-forcing the initial idea of creating
a manually sorted legend, the second AI prompt helped me understand that there was a simpler and more user-friendly approach. By keeping the alphabetical order and 
instead displaying the bars in that order, the dashboard is easier to read (the same items are always on the same side of the legend, for example), and the code is simpler to understand.

--------------------------------------------------

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

--------------------------------------------------

I didn't use AI to write any code until around 2 hours before the code deadline in an attempt to learn and understand the codebase as much as possible.

During the majority of the project, I used AI in addition to standard google searches to learn how to do the things I was trying to do. Here is an example exchange from this type of AI use:

prompt: each of these items now has an attribute called "show". If show is always, it should always be shown. if it's logged_in, it should only be shown when {user} is not null. if it's logged_out, it should only be shown when the it IS null. Explain how to accomplish this.

          {siteConfig.navLeft.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "white" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="white"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}

ChatGPT 5.1 Thinking responded with two options. I could either use .filter() before the map, or I could use an early return of null from within the function passed to .map(). After reading this and using google for a quick refresher .filter() works in js, I decided I liked the first option that the AI provided. I then typed it out myself in the text editor to help me remember this in the future.

During the last phase of the project, I was working on using threading to parallelize a for loop that contained multiple SQL queries. Here are the prompts from this exchange:

prompt 1: I have this rough outline. Instead of converting each food item into a single number and returning an array of numbers, I want to return the same list of fooditems but with all of the nutrient values multiplied.
<pasted code>

prompt 2: Inside of dailyfoodlog there is an arraylist of fooditems. Add another for loop after this for loop to allow this calculation to be run on each day's list of fooditems in parallel.
<pasted code>

prompt 3: Actually maybe you should combine this with the original function. Make a single function that takes in a DailyFoodLog and pulls every individual foodItem from it and multiples that in its own thread. Let's try that and see how it looks.

prompt 4: Actually at this point we may as well get each food log in parallel instead of this. LogEntry has a quantity() field.
<pasted code>

prompt 5: So that just gets the food in parallel for each day?

prompt 6: Why split into chunks? Why not just run a thread for each individual foodItem?

By the end of this exchange I had learned a few things and also had some code to accomplish my goal. However, I had an issue.

issue/fix 1: the code provided by ChatGPT 5.1 Thinking used a getter method that did not exist in our codebase. So I manually created it and tried to run again.

issue/fix 2: the code provided by the AI also used doubles where the rest of the codebase used floats. I manually changes this as well.

explanation: I was able to iterate with the AI to slightly change what I was originally trying to do and generate code that I understood well. However, the AI didn't have full knowledge of the codebase and tried to use methods that weren't there and incorrect datatypes. These errors were fairly simple, so I just manually created the infrastructure that it was expecting and fixed the small mistakes that it made.

--------------------------------------------------

AI Tools Used: ChatGPT

I used ChatGPT to help design and implement the nutrient visibility settings feature, specifically the settings page UI, the toggle logic, and the filtering functionality that updates the Day and Week dashboards. I also used it while integrating a peer’s barcode-scanner feature into our updated JavaScript tech stack.

Issues:
The AI suggested a visibility object structure that didn’t match our existing nutrient constants.

It omitted proper localStorage handling, which would have caused missing or corrupted settings.

Some generated code referenced helper functions that didn’t exist.

The barcode example assumed a backend workflow that didn’t fit our client-side design.

Fixes:
I rewrote the visibility model to match our data shape, added safe merging/fallback logic when loading preferences, and corrected the toggle + filtering logic so dashboards update reliably. For the scanner, I rebuilt the AI’s example to work with our browser upload flow and preserved functionality from the original implementation.

Explanation:
The settings feature affects every part of the nutrition dashboard, so aligning the AI’s suggestions with our real codebase was crucial. AI provided a useful starting structure, but I refined and corrected the details to ensure stable behavior and full integration with the rest of the app.