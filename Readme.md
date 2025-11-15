# Gym Kiosk - Bernat Sampera

## Architecture

The app has two parts. backend and fronted. The backend is just there to server a langgraph graph and is used in the check in mat function of the app in the frontend, all of the other functions work without the backend.

Decided to load from json files as it was optional to handle everything from the backend and for simplicity reasons decided to go for it.

For the same reason decided to save everything in memory rather than in localStorage, the app can show all the functionalities without it.

### Frontend Directory Structure

- **app/**: Main application screens and navigation layout, contains core pages like CheckInChat, home, member-check-in, etc.
- **components/**: Reusable UI components split into ui/ (basic UI elements like buttons, cards, text) and tools/ (specialized tools like CheckInMatTool)
- **lib/**: Core library files including theming, fonts, AI integration (bleakai.ts), and utility functions
- **utils/**: Application utilities including fuzzy matching, GymContext for state management, and SSE helper for real-time updates
- **assets/**: Static assets including images (icons, splash screens) and fonts
- **data/**: JSON data files and TypeScript definitions for classes, members, and instructors
- **types/**: TypeScript type definitions (gym.ts)

## Tech Stack

- Platform: React Native (IOS)
- Backend: Fastapi as is the easiest way to serve the stream of the langgraph graph.
- State Management: Context. Why Context over other options? (Redux, Zustand, mobx, rxjs....)

Mostly I am more used to work with context and the state management logic was small enough that id didn't require to use of anything else.

- Additional libraries: Nativewind (to install this I needed a bunch of other things, tailwind, tailwind-merge, clsx, babel-preset.), rn-primitives (maybe this could be removed for simplicity).

For components I pulled a lot of things from https://reactnativereusables.com/, I still have some doubts regarding the font family Geist but I think I managed to include it everywhere with the component ThemedText (this was tricky).

As a bonus I used also langchain for the ai part to handle the types of the messages, ideally I wanted to use directly the os library I'm developing, https://github.com/bleak-ai/bleakai, but there were some problems with the event-streams in ios. As this was the extra feature, decided to copy directly all the relevant code into sseHelper.ts and bleakai.ts files (Not ideal but for time and simplicity decided to go for it.)

## Design Decisions

Tried to keep it pretty simple and clear, nothing to fancy and a bit based on the initial mockup of the home screen.

The scroll of the members list could be a bit finetuned, but as it's right now it's pretty easy and simple to use.

## Trade-offs

I considered implementing some of the optional stuff like the lock in or the qr code, but these are pretty standard things that also don't show that much my skills.

Also depriorised testing the app on Android and focused on ios. Have done mostly web in the past and to set up ios was tedious enough.

I priorised instead the AI Check In Chat as it's I'm currently working on and, though the current version is just an example that it would require much more functionalities, it shows the capabilities of what can be done with Generative AI and a possible use for Maat.

## Future Improvements

For a production grade app I'd probably throw everything away and give much more though on the components like class-card that are reused in multiple places. As they are now are usable, but could be more intuitive for the users.

Would also check if it's possible to remove the rn-primitives library and do what it does in some other way. I'd investigate a bit further what are the best practices in react-native development, maybe decide to keep if it makes sense.

## Running the App

[Step-by-step instructions]
