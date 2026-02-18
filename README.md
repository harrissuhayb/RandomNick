# RandomNick

![demo](visuals/demo.gif)

A [Vencord](https://github.com/Vendicated/Vencord) plugin that adds a button to a server's context menu that continuously randomizes your server nickname with random-length printable ASCII characters.

## What it does

Every 15 seconds, it generates a random nickname between 1 and 32 characters long (32 being the maximum Discord allows) and applies it to your account in the selected server. Through trial-and-error, I found 15 seconds to be the sweet spot for the Discord API which is fast enough to keep the nickname changing without hitting rate limits.

The nickname is built from printable ASCII characters, specifically the 94 characters ranging from `!` (0x21) to `~` (0x7E). This covers every visible, typeable character on a standard keyboard; uppercase and lowercase letters, digits, and symbols like `!`, `@`, `#`, `$`, `%`, `+`, `=`, `?` but excluding space, since Discord doesn't allow it in nicknames. Both the length and the characters are chosen completely at random each time.

## Usage

1. Right-click target server icon in the sidebar.
2. Toggle **Start Random Nick** in the context menu.
![start](visuals/start.png)
3. Toggle **Stop Random Nick** in the context menu.
![stop](visuals/stop.png)

You can have it running in multiple servers at the same time.

## Installation

1. Place the `RandomNick-main` folder in your Vencord userplugins folder:
    ```
    Vencord/src/userplugins/RandomNick-main
    ```
2. Rebuild Vencord:
    ```
    pnpm build
    ```
3. Restart Discord. 
4. In Discord, navigate to **User Settings > Vencord > Plugins**, search for `RandomNick` and enable it.

## License

GPL-3.0-or-later