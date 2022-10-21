# Tickets

### Command
```
-create-ticket
```

### Document

When button `create-ticket-${message.guild.id}` is presed:

	- Create a channel with the name `ticket-${message.author.id}`
		- If user has already made a ticket tell them "You already have a ticket open"
					- Send a message with buttons and pin it
									- Buttons: DELETE, CLOSE
													- Close will stop the user from messages in the channel
													- It will also change the name to `ticket-closed-${message.author.id}`