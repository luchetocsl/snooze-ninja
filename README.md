# Tab Snoozer Chrome Extension

A Chrome extension that lets you temporarily close tabs and have them automatically reopen at a specified time.

## Features

- Quick snooze options: 15 minutes, 30 minutes, 1 hour, or 2 hours
- Custom date/time picker for specific reopening times
- View and manage all snoozed tabs
- Automatic tab reopening at scheduled times
- Persistence across browser sessions

## Installation Instructions

1. **Build the extension**:
   ```sh
   # Install dependencies
   npm install

   # Build the extension
   npm run build
   ```

2. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" by toggling the switch in the top right corner
   - Click "Load unpacked"
   - Select the `dist` folder from your project directory

3. **Using the extension**:
   - Click the Tab Snoozer icon in your Chrome toolbar
   - Choose a snooze duration or set a custom time
   - The current tab will close and reopen at the specified time

## Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

- `src/pages/Index.tsx`: Main popup interface
- `src/background.ts`: Background service worker for managing snoozed tabs
- `public/manifest.json`: Extension manifest and permissions

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Contributing

Feel free to submit issues and pull requests.

## License

MIT