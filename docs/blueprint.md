# **App Name**: DebrisFlow

## Core Features:

- Dashboard Overview: Display a dashboard with key metrics like ticket activity, active projects, and a project summary.
- Project Management: Enable users to view and manage a list of projects with details like client, region, and status, with options to create and edit.
- Ticket Management: Provide a ticket management system with filters, creation, and detailed views of each debris ticket including status, events, and associated data.
- Equipment Management: Allow management of equipment with details such as ID, type, status, and contractor.
- Validation Rule Engine: Implement a rule engine to define validation rules with an editor, switch for active/inactive status, and display a list of existing rules.
- AI-Powered Project Insights: Incorporate a tool powered by Genkit to generate project summaries based on project details and recent changes.
- Mobile-First Design: The layout should adapt to different screen sizes, providing a seamless experience from mobile devices to desktops. Responsive prefixes like sm:, md:, lg:, and xl: are necessary for implementation

## Style Guidelines:

- Primary color: Soft Blue (#64B5F6) evokes trust and efficiency.
- Background color: Light Gray (#F0F4F8) provides a clean, uncluttered backdrop.
- Accent color: Muted Purple (#9575CD) for highlighting key actions and elements.
- Use GeistSans for general text and GeistMono for code snippets.
- Employ a mobile-first approach using Tailwind CSS. Base styles target small screens, adapting for larger screens with responsive prefixes (sm:, md:, lg:, xl:).
- Sidebar navigation with collapsible functionality, displaying the app name, navigation items, and user details.  Main content has sticky header with mobile trigger.