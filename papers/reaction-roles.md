# Reaction Roles

### Command
```
-reaction-roles [ text? ]
```
*I may change this to be one cmd `-action-roles`*

### Document

When user clicks on reaction:

- Check if user is *unreacting* or *reacting* to the message
	- If reacting: Give role licked to reaction
	- If unreacting: Remove role licked to reaction
	
In the database:

```
Guild: String
Channel: String
Message: String
Roles: Array
```

```json
Roles: [
	{
		"reaction": "",
		"role": ""
	}
]
```