# Richards-Spratt Lakemont LLC
## A mobile-first application for family members to notify each other of their plans to be at the lake
And additional functionality as identified!

## Under Development!

### Primary Technologies:
#### Back-end:
* Mongo Db
* Mongoose ORM
* DateJs

#### Front-end:
* Angular JS
* Bootstrap
* Angular-Bootstrap component directives


### Demo (best viewed on a phone)
The demo login is a real user identity, but cannot save a booking or otherwise update any data.

* The "Book" view allows input of arrival, departure and "who". Note the "Quick Book" feature
* The "Bookings" view is a chronological view of who is present. It has the most intense styling.
* The "Persons" view is a accordion list of members with optional detail. Only the logged in member self data can be updated

User Id: Tracy

Password: demo

[Demo App: https://rslllc.herokuapp.com/](https://rslllc.herokuapp.com/)

## Proposed Enhancements (no particular order):
* Fix overlap issues. Overlaps corrupt the Bookings display (bug)
* Clean up "back key" behavior. Tab should close when user hits "back" from login screen. Currently attempts to load local history.
* Implement "Remember Me" functionality
  * Use localStorage to save Username and password.
  * On startup, pre-fill the login view fields, but do not automatically log-in.
* Expose entity (person, member, room, etc) update functionality via REST interface. Very low priority because this data changes very rarely.
* Implement entity update functionality in the UI. Low priority
* Provide update to member default room. This value will change yearly for many.
  * Add dropdown to Member Detail.
* Implement "Guest Request" and Accept functionality. 
  * Invoke from "Book" view
  * Display a guest book view that includes:
    * Arrive and depart selection controls
    * Text box for notes, like who the guests are and any other info or requests.
    * Send email to all members who are not currently booked for the selected dates.
    * Email to provide single "Request Granted" button.
    * Button sends http request to RSL app, which Books the room of the responder.
      * Booking member will be the requesting member.
      * Booking room will be the default room of the accepting member.
      * The "Who" array will be a single element "Guests".
      * The booking notes will be the notes entered in the guest request form.
* Display member contribution
  * Will require admin functionality to download and parse bank transactions.
* Admin only: download and parse bank transaction data.
* Implement Admin role/permissions.
* Implement Admin view, perhaps under "Other".
* Implement OAuth service with access tokens and protect back-end methods.
* Apply client side unit tests.
* Implement sub-view/controller routing on Other View for future use.
* Implement "Add User". Any member should be able to add a user. 
* Provide tabular booking display
* On graphical bookings display, show columns and headers even if no data. Currently is empty screen
* Show week and month dividers on Bookings
* Persons List: scroll into view on opening accordion section
* Improve display performance
  * Benchmark to determine bottlenecks.
  * Pre-generate residence schedule on any change to Bookings collection
* Minimize "flash" on calendar refresh. 
  * Perhaps a static background image of the color bands
  * Or a static collection of data elements that produce it.
  * Or separate the background from the dynamic overlay data
