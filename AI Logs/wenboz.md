In order to ensure that the copilot's generation is aligned with the API documentation, I copied the USDA food API schema from their OpenAPI documentation into `docs/`, and attached it in a conversation with copilot. I sent the following propmt together:

> Analyze the nutrient data schema used in the food tracking app and its alignment with what the API will return. Also identify the difference between labelNutrients and foodNutrients in the API response to see what we should use. The app should track the total amount of nutrients in the food that the user enters and be comprehensive (capture all data returned by the API)

Aligned with my observation, the copilot identified that the existing database schema and data structure does not match the API response. I then prompted:

> Redesign the schema from scratch to maximize alignment and maintainability. Ignore the existing schema and don't be limited by it

After the copilot update the database schemas, I instructed it to update the Java code to integrate the API. Finding that it hardcoded the API key, I asked it to instead read it from a `.env` file. I also asked it to provide type definitions for the front end team to work on.
