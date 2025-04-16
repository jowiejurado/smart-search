<h1 align="center">
 Smart Search App
</h1>

🔗 Live Demo: <a href="https://smart-search-app.netlify.app/" target="_blank">smart-search-app.netlify.app</a>

#### 🚀 Features
- <b>Blazing Fast Search:</b> Leveraging Typesense for real-time, typo-tolerant search results.
- <b>Modern Frontend:</b> Built with Next.js and TypeScript for scalability and maintainability.
- <b>Responsive Design:</b> Styled with TailwindCSS and Sass for a sleek, mobile-friendly interface.
- <b>Easy Deployment:</b> Configured for seamless deployment on platforms like Netlify.

#### ⚙️ Tools Required
- Node.js (v14 or higher)
- Code Editor (e.g., Visual Studio Code)
- Modern Web Browser (e.g., Google Chrome)

#### 🛠️ Tech Stack
- Frontend: Next.js, TypeScript, TailwindCSS, Sass
- Search Engine: Typesense

#### 📦 Installation & Setup

Follow these steps to set up the project locally:

1. Clone the Repository
```shell
git clone https://github.com/jowiejurado/smart-search.git

cd smart-search
```

2. Install Dependencies
```shell
npm install
```

3. Configure Environment Variables

	Create a .env.local file in the root directory and add the following variables:
```env
NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY=xxx
NEXT_PUBLIC_TYPESENSE_HOST=xxx.typesense.net
NEXT_PUBLIC_TYPESENSE_PORT=443
NEXT_PUBLIC_TYPESENSE_PROTOCOL=https
TYPESENSE_ADMIN_API_KEY=xxx
OPENAI_API_KEY=sk-xxx
```
Replace the placeholders with your actual Typesense credentials.

4. Import Data into Typesense (Optional if data still doesn't exist)
	Ensure your Typesense server is running, then execute:
```shell
npm run import:typesense
```
This script will import the necessary data/collections into your Typesense server.

5. Start the Development Server
```shell
npm run dev
```
Open http://localhost:3000 in your browser to view the application. ✌️
