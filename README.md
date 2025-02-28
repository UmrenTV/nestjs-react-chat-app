# Basic chat app
I have completed this app in couple hours, and it's extremely basic, with lots of things to improve.  
I wanted to test NestJS as backend with MongoDB, and React with Redux, and Typescript... and how fast I can create a real-time chat using Websockets  
Most of the things are hardcoded, and it's in no-way secure at this point.  
The idea was to create a chat that can be used publicly, that saves no data of users, no verifications needed, no censoring, just pure freedom of speech in real-time, with ability to create public rooms (at start), and lots of other high-end features later.
  
There are lots of things that Has to be done like:  
- Add routing guards for logged in users (to not access register page)
- and encryption of messages
- change password
- if there is donations / payments included I want them to be somehow not connected to the actual user, so no one can track who is vip, except the user (I need to figure out a way how to make this) - I guess I can bind the payment to user_id instead of username, and make the person change the username (as recommendation) when payment is being made, with purging the data of his previous username, so if someone wants to be trully anonymous but still pay... system should know that this userId has montlhy subscription, but if he decides to change the username, it purges the history of previous username so you cannot track it back to him, and based on the payment name, to be able to track him or soemthing. So litteraly 0 history of usernames, previous usernames, etc. Also no one can see your user_id, except the server, so if you lets say pay, and change the username, even the user cannot know his userId. For all purposes to the front-end only thing that is being send is always the username, never the user_id. Whenever One makes purchase, server sees who is that user_id and username, attaches the vip status to the user_id, and it sends to the front end "this username has vip status" but never sends the user.id, or something. I will have to brainstorm more about this :D
- Make slow mode of messages, so you cannot spam 100 messages / second or flood it, with character limit as well
- Maybe remove slow mode if you are owner of the room and if it's locked / private
- personalization of profile (color of name, maybe avatar, messages background color, etc)  
- room creation and room search functionality + special encryption key for each room so chat can be encrypted
- room toggle selection upon creation to make it Public, or private. (Link to share room should be available)
- maybe later make feature where you can make "Locked" room, so only those that are invited by owner can join
- end-to-end encryption of all messages  
- fix styles, navigation, look and feel
- no ability to add links or images in chat (to prevent spam of p**n / or advertisements at least visually)

I just want to make chill platform where whoever wanna chat about something, can do it super quick, with no registration needed, or any verifications, neither to be afraid that someone will "track him", or anything.  
Main goal is to allow people to just chat, and chill... with random people around the world, maybe share ideas, talk privately in private rooms if they want to, etc.
