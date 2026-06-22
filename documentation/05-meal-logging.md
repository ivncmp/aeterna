# Meal Logging with Claude Vision

The most differentiating feature. The user logs meals with text or photo and Claude extracts the macros automatically.

## Logging Flows

### 1. Free text
The user writes: "2 scrambled eggs with toast and coffee with milk"
→ Backend sends to Claude API → returns estimated macros → user confirms

### 2. Photo
The user uploads a photo of the plate
→ Backend sends to Claude Vision → identifies food and estimates macros → user confirms

### 3. Manual
The user enters calories and macros directly by hand.

## Claude Prompt

```
System: You are an expert nutritionist. Given food described in text or a food image,
estimate the calories and macronutrients. Respond ONLY in valid JSON with this format:

{
  "description": "brief plate description",
  "calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number
}

Be precise but conservative. If you're unsure about portion size, assume a standard serving.
```

## UI

1. Floating "+" button or in navigation
2. Modal/screen with:
   - Free text field (placeholder: "What did you eat?")
   - Camera / gallery button for photo upload
   - Toggle for manual mode
3. On text/photo submit:
   - Loading spinner
   - Preview of Claude-estimated macros
   - Editable fields to adjust before saving
4. "Save" button to confirm

## Favorite Meals

- Any meal can be marked as favorite (star)
- "Frequent Meals" section to re-log with one tap
- On re-log, macros are copied from the original meal

## Day Timeline

- Chronological list of all meals for the day
- Each entry shows: time, description, calories, P/C/F
- Day totals at the top: total calories, total protein

## API

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/meals/analyze | Text or image → estimated macros (does NOT save) |
| POST | /api/meals | Save confirmed meal |
| GET | /api/meals?date=YYYY-MM-DD | Meals for the day |
| GET | /api/meals/favorites | User's favorite meals |
| PUT | /api/meals/:id/favorite | Toggle favorite |
| DELETE | /api/meals/:id | Delete meal |

## Costs

~$0.01-0.05 per Claude API query. For personal use / friends, negligible.
With ~10 queries/day × 30 days = ~$3-15/month maximum across all users.
