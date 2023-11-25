# Kids on Bikes

This is a rails and react toy app to manage Kids on Bikes campaigns.

## To do

### Functionality

- Character sheet
    - [x] Relationship description editing
    - [x] Relationship deleting
    - [x] Ability to add relationship
    - [ ] Notes section
- [ ] Character strengths
    - [x] create / edit
    - [x] view
    - [ ] BUG: strengths get weird with ages changing
    - [ ] BUG: can select more than 2 strenghts
- [ ] Associations
    - [ ] BUG: Campaign list should only show Associations for this campaign
    - [ ] Rename Location to Association, at least in UI
    - [ ] Add Association type, eg, Place, Group, Family

### Enhancements and fixes

- [ ] User logins
- [ ] GM vs player visibility
- [ ] Prevent character relationships with self
- [ ] Separate relationships bewteen PCs and NPCs ?
- [ ] I think urls nested under campaigns (characters, locations) will allow GETs and PUTs across arbitrary campaign ids
- [ ] Reskin "adversity tokens" as simply "tokens" so they can cover powered characters as well
- [ ] Locations allow characters added more than once
- [ ] Prevoiusly selected strengths missing from Character edit
- [x] Description box is so tiny
- [x] Newlines from description aren't used when displaying
- [ ] Ability to delete characters, locations
- [ ] EditableText blurs on "enter"

### Cleanup

- [ ] There are tons of undefined checks all over objects from the API; some validation and cleaning could make interacting with them a little easier
- [ ] Clean up Campaign helpers to be more like other types
- [ ] Make all indentation 2 spaces

## Notes and oddities

- I started with next.js because I wanted to try it out and learn about it; it might overkill for a client-only app.
