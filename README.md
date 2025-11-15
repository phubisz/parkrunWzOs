# parkrun Wzniesienie Osowy Diploma Generator

A web application that generates personalized diplomas for parkrun participants using data from a JSON file and template images.

## Features

- **Dynamic PDF Generation**: Creates personalized diplomas with participant names, dates, and locations
- **Template-based Design**: Uses image templates for diploma backgrounds
- **Responsive UI**: Works on desktop and mobile devices
- **Error Handling**: Graceful error handling for missing data or files
- **Modern Styling**: Clean interface using Tailwind CSS

## How It Works

1. Loads participant data from `reports-data.json`
2. Displays a table of available reports
3. Generates PDF diplomas using jsPDF and template images
4. Downloads personalized diplomas directly to the browser

## File Structure

```
.
├── index.html          # Main application page
├── reports-data.json   # Participant data (must be in same directory)
├── templates/          # Diploma template images (PNG format)
│   ├── template1.png
│   └── ...
└── README.md           # This file
```

## Setup Instructions

1. **Prerequisites**:
   - A web server (local server recommended for image loading)
   - `reports-data.json` file in the same directory
   - Template images in the `templates/` folder

2. **Running Locally**:
   - Start a local HTTP server in the project directory
   - Open `index.html` in your browser

## Data Format (reports-data.json)

```json
[
  {
    "Report_Title": "Monthly Report",
    "Name": "John Doe",
    "CelebDate": "2023-12-01",
    "Report_Template": "template1.png"
  }
]
```

## Dependencies

- [Tailwind CSS](https://cdn.tailwindcss.com)
- [jsPDF](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js)
- Custom fonts (Zeyada-Regular.js, CaveatBrush-Regular.js)

## Notes

- Template images must be placed in the `templates/` folder
- The application requires a local HTTP server for image loading due to CORS restrictions
- All template files should be PNG format