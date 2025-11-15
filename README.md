📜 parkrun Wzniesienie Osowy Diploma Generator✨ OverviewThis is a static web application designed to quickly generate and download personalized PDF diplomas for parkrun participants based on external report data. The entire process runs client-side in the user's browser.🚀 Key FeaturesAsynchronous Data Loading: Loads report data from a single external reports-data.json file using the fetch API.Dynamic UI: Renders a clean, functional table (styled with Tailwind CSS) listing all available reports for generation.Client-Side PDF Generation: Uses jsPDF to combine a static background image template with dynamic participant data (Name, Date, etc.).Custom Fonts: Integrates custom Polish fonts (Zeyada and Caveat Brush) using jsPDF's VFS (Virtual File System) for accurate text rendering.Instant Download: Generates and triggers the download of the personalized PDF diploma upon a single button click.⚙️ Technical StackComponentPurposeKey DependencyData SourceStores participant details and template filenames.reports-data.jsonPDF LibraryCreates, renders, and saves the final PDF document.jsPDFStylingUtility-first CSS framework for rapid UI development.Tailwind CSS (CDN)FontsCustom script fonts required for diploma aesthetics.Zeyada-Regular.js, CaveatBrush-Regular.js📁 Project StructureThis application runs entirely client-side and requires a local or remote web server (like VS Code's Live Server or GitHub Pages) to correctly load the external assets.parkrun-diploma-generator/
├── index.html            <-- Main application interface and script logic
├── reports-data.json     <-- Array of participant data
├── fonts/                <-- Custom fonts converted specifically for jsPDF
│   ├── CaveatBrush-Regular.js
│   └── Zeyada-Regular.js
└── templates/            <-- Diploma background images (e.g., DYPLOMB10.png)
Data File (reports-data.json)The application relies on this file being an array of objects structured as follows:JSON[
    {
        "Name": "Kasia Nowak",
        "Report_Title": "10 Runs: Kasia Nowak",
        "Report_Template": "DYPLOMB10.png",
        "CelebDate": "01.12.2025"
    }
]
🖥️ Setup and DeploymentRunning LocallyEnsure you have all the necessary files structured as shown above.Use a simple local server (e.g., the Live Server extension in VS Code) to open index.html. Opening the file directly (file://...) will cause errors due to strict security rules preventing the loading of images and JSON data.Deployment on GitHub Pages (Recommended)GitHub Pages is the easiest way to host this static app for free:Create a Repository and push all project files.Go to the Settings tab of your repository.Select the Pages section.Choose your source branch (e.g., main) and the root directory (/).Click Save. Your application will be live at the provided GitHub Pages URL.