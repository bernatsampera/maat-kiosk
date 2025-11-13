# Core User Flow Todo List

## Overview

- [ ] Implement the following screens and functionality

## A. Home / Entry Screen

- [ ] Base on the Figma style
- [ ] Display welcome state
- [ ] Show today's classes
- [ ] Provide navigation to class details

## B. Class Screen

- [ ] Create internal overview of the selected class
- [ ] Display basic class information (name, time, instructor, etc.)
- [ ] Show list of attendees with:
  - [ ] Display name
  - [ ] Profile picture
  - [ ] Status (e.g., confirmed, registered)
  - [ ] Registration time (optional)
- [ ] Provide ability to add new check-ins

## C. Member Search

- [ ] Implement search by name (simple client-side filter is sufficient)
- [ ] Display scrollable list of members
- [ ] Show "no results" state when search yields no matches

## D. Member Check-In

- [ ] After selecting a member:
  - [ ] Display member's name
  - [ ] Show today's date
  - [ ] Present clear call-to-action: "Check In" button
  - [ ] Handle check-in action

## E. Success State

- [ ] After successful check-in:
  - [ ] Show confirmation screen
  - [ ] Auto-reset to home screen after 2–3 seconds
  - [ ] Ensure kiosk returns to "ready" state
