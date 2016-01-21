#Richards-Spratt Lakemont LLC
##A mobile-first application for family members to notify each other of their plans to be at the lake
And additional functionality as identified!

##Under Development!

###Primary Technologies:
####Back-end:
* Mongo Db
* Mongoose ORM
* DateJs

####Front-end:
* Angular JS


###Demo (best viewed on a phone)
The demo login is a real user identity, but cannot save a booking or otherwise update any data.

* The "Book" view allows input of arrival, departure and "who". Note the "Quick Book" feature
* The "Bookings" view is a chronological view of who is present. It has the most intense styling.
* The "Persons" view is a accordion list of members with optional detail. Only the logged in member self data can be updated

User Id: Tracy

Password: demo

[Demo App: https://rslllc.herokuapp.com/](https://rslllc.herokuapp.com/)

##Proposed Enhancements:
* Limit depart date selection to only allowdates after the arrive date. (bug)
* Implement "Remember Me" functionality
  * Use localStorage to save Username and password.
  * On startup, pre-fill the login view fields, but do not automaticaly log-in.
* Expose entity (person, member, room, etc) update functionality via REST interface. Very low priority because this data changes very rarely.
* Implement entity update functionality in the UI. Low priority
* Implement "Guest Request" and Accept functionality. 
  * Invoke from "Book" view
  * Display a guest book view that includes:
    * Arrive and depart selection controls
    * Text box for notes, like who the guests are and any other info or requests.
    * Send email to all members who are not currently booked for the selected dates
    * Email to provide single "Request Granted" button.
    * Button sends http request to RSL app, which Books the room of the responder.
      * Booking member will be the requesting member
      * Booking room will be the default room of the accepting member
      * The "Who" array will be a single element "Guests"
      * The booking notes will be the notes entered in the guest request form.
* Display member contribution
  * Will require admin functionality to download and parse bank transactions.