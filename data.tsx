import React from 'react';
import { GuideSection, DeploymentOption } from './types';
import { Terminal, Cloud, Github, CheckCircle2, AlertTriangle, PartyPopper, HeartHandshake } from 'lucide-react';

export const deploymentOptions: DeploymentOption[] = [
  {
    name: "Netlify",
    description: "Drag-and-drop simplicity. Perfect for static sites (HTML/CSS/JS) or simple React apps.",
    pros: ["Drag & drop deployment", "Generous free tier", "Very simple UI"],
    cons: ["Can require configuration for complex dynamic apps"],
    difficulty: "Easy",
    bestFor: "First-time deployers & simple websites"
  },
  {
    name: "Vercel",
    description: " The gold standard for Next.js and React. Integrates deeply with GitHub.",
    pros: ["Zero configuration for React/Next.js", "Fastest global speeds", "Automatic preview links"],
    cons: ["Strict error checking (builds fail if code isn't perfect)"],
    difficulty: "Medium",
    bestFor: "React applications & Vibe Coders using 'shadcn' stacks"
  },
  {
    name: "Replit",
    description: "Code and host in the same place. No need to move files around.",
    pros: ["One-click deployment", "You're already coding there", "Database built-in"],
    cons: ["Costs money for always-on hosting", "Less professional URL structure"],
    difficulty: "Easy",
    bestFor: "Quick prototypes & backend servers"
  }
];

export const guideData: GuideSection[] = [
  {
    id: 'intro',
    title: 'Start Here: The Mental Block',
    subtitle: 'It is okay to be scared. Let\'s talk about it.',
    estimatedTime: '2 mins',
    type: 'intro',
    content: (
      <div className="space-y-4 text-slate-700">
        <p className="text-lg font-medium text-slate-900">
          Hey, fellow builder. 👋
        </p>
        <p>
          You've probably built amazing things. Maybe you have a folder with 5, 10, or even 700 apps that live only on your computer (or in a chat window). 
        </p>
        <p>
          You haven't deployed them because <strong>deployment feels technical, unforgiving, and permanent.</strong>
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg my-6">
          <h4 className="font-bold text-blue-900 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5" />
            The Truth
          </h4>
          <p className="mt-2 text-blue-800">
            Even professional senior engineers break production. The difference is they know how to roll back. 
            You aren't going to "break the internet." The worst case scenario? The link doesn't work, and you try again.
          </p>
        </div>
        <p>
          This guide is your co-pilot. We will take small steps. We have safety nets. And if you get stuck, we have specific prompts to ask your AI for help.
        </p>
      </div>
    )
  },
  {
    id: 'prereqs',
    title: 'The "Scary" Setup Checklist',
    subtitle: 'Get these ready once, and you are set for life.',
    estimatedTime: '10 mins',
    type: 'checklist',
    content: (
      <div className="space-y-4">
        <p>Before we press the big red button, we need two accounts. Think of these as your "Internet Passport."</p>
        <ul className="space-y-4 mt-4">
          <li className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="bg-slate-100 p-2 rounded-full"><Github className="w-6 h-6 text-slate-700" /></div>
            <div>
              <h4 className="font-bold text-slate-900">1. GitHub Account</h4>
              <p className="text-sm text-slate-600 mt-1">
                This is where your code "lives" in the cloud. It's a backup and a version history.
                <br />
                <a href="https://github.com/signup" target="_blank" className="text-blue-600 underline mt-1 inline-block hover:text-blue-800">Create GitHub Account &rarr;</a>
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="bg-slate-100 p-2 rounded-full"><Cloud className="w-6 h-6 text-slate-700" /></div>
            <div>
              <h4 className="font-bold text-slate-900">2. Netlify or Vercel Account</h4>
              <p className="text-sm text-slate-600 mt-1">
                This is the "server" that shows your website to the world. They both have free tiers.
                <br />
                <span className="text-xs text-slate-500 italic">Recommendation: Start with Netlify for drag-and-drop simplicity.</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 'prepare-code',
    title: 'Preparing Your Code',
    subtitle: 'Cleaning up the messy room before guests arrive.',
    estimatedTime: '5 mins',
    type: 'tutorial',
    content: (
      <div className="space-y-4">
        <p>
          AI code often comes in snippets. For deployment, we need a <strong>folder</strong>.
        </p>
        <div className="space-y-4 mt-6">
          <h4 className="font-semibold text-slate-900">The "Golden Rule" of AI Code:</h4>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
            Make sure you have an <code>index.html</code> file. If you are using React/Vite, make sure you can run the build command locally if you know how. If not, don't worry, we have a prompt for that.
          </div>
        </div>
      </div>
    ),
    prompts: [
      {
        label: "Ask AI to organize your files",
        text: "I want to deploy this app to Netlify. Can you please give me the complete file structure and the content of every single file I need? Please ensure there is an index.html file.",
        copyText: "I want to deploy this app to Netlify. Can you please give me the complete file structure and the content of every single file I need? Please ensure there is an index.html file."
      },
      {
        label: "If using React/Vite",
        text: "I want to deploy this React app. Please provide the 'package.json' file configured correctly for a standard Vite build, and tell me exactly what commands to run to create the 'dist' folder.",
        copyText: "I want to deploy this React app. Please provide the 'package.json' file configured correctly for a standard Vite build, and tell me exactly what commands to run to create the 'dist' folder."
      }
    ]
  },
  {
    id: 'method-netlify',
    title: 'Method 1: The "Drag & Drop" (Netlify)',
    subtitle: 'The easiest way to get a static site online.',
    estimatedTime: '3 mins',
    type: 'tutorial',
    content: (
      <div className="space-y-6">
        <ol className="list-decimal pl-5 space-y-4 text-slate-700">
          <li>
            <strong>Get your folder ready:</strong> Ensure all your files (index.html, style.css, script.js) are in one folder on your desktop.
          </li>
          <li>
            <strong>Log in to Netlify:</strong> Go to <a href="https://app.netlify.com" target="_blank" className="text-blue-600 underline">app.netlify.com</a>.
          </li>
          <li>
            <strong>Find the drop zone:</strong> On the "Sites" tab, there is often a box that says "Drag and drop your site output folder here".
            <div className="bg-slate-100 p-4 my-2 rounded text-xs font-mono text-slate-500 text-center border border-dashed border-slate-300">
              [ Visual: A dashed box area ] <br/> Drop folder here
            </div>
          </li>
          <li>
            <strong>Drag your folder:</strong> Drag your project folder from your computer into that box in the browser.
          </li>
          <li>
            <strong>Wait 10 seconds:</strong> You will see a "Production: Published" status. Click the green link!
          </li>
        </ol>
      </div>
    ),
    warning: {
      title: "White Screen of Death?",
      text: "If you see a blank page, it usually means your index.html is referring to a script or css file that isn't in the correct place. Ask the AI: 'I deployed to Netlify but see a blank screen. Here is my index.html code. What is wrong?'"
    }
  },
  {
    id: 'method-vercel',
    title: 'Method 2: The "Professional" (Vercel)',
    subtitle: 'Best for React, Next.js, and modern AI apps.',
    estimatedTime: '8 mins',
    type: 'tutorial',
    content: (
      <div className="space-y-6">
        <p>This method connects your GitHub to Vercel. When you update code on GitHub, your site updates automatically. Magic.</p>
        <ol className="list-decimal pl-5 space-y-4 text-slate-700">
          <li>
            <strong>Upload code to GitHub:</strong> 
            <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
              <li>Create a new Repository on GitHub (call it "my-first-app").</li>
              <li>Upload your files using the "Upload files" link if you don't know Git commands.</li>
            </ul>
          </li>
          <li>
            <strong>Go to Vercel:</strong> Log in and click "Add New..." -> "Project".
          </li>
          <li>
            <strong>Import Git Repository:</strong> You should see your "my-first-app" in the list. Click "Import".
          </li>
          <li>
            <strong>Configure:</strong> Vercel is smart. It usually auto-detects if you are using Vite, Next.js, or Create React App. Just click "Deploy".
          </li>
        </ol>
      </div>
    ),
    prompts: [
      {
        label: "If the Vercel Build Fails",
        text: "I tried deploying to Vercel but the build failed. Here is the error log from Vercel: [PASTE ERROR HERE]. Can you fix my package.json or code to solve this?",
        copyText: "I tried deploying to Vercel but the build failed. Here is the error log from Vercel: [PASTE ERROR HERE]. Can you fix my package.json or code to solve this?"
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Emergency Room: It Failed',
    subtitle: 'Don\'t panic. It happens to everyone.',
    estimatedTime: 'Variable',
    type: 'troubleshooting',
    content: (
      <div className="space-y-4">
        <p>Deployment errors usually fall into three buckets:</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
            <h5 className="font-bold text-red-900 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> 1. Build Failed</h5>
            <p className="text-sm text-red-800 mt-1">The computer couldn't translate your code. Usually a typo in <code>package.json</code> or a missing comma.</p>
          </div>
          <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
             <h5 className="font-bold text-orange-900 flex items-center gap-2"><Terminal className="w-4 h-4"/> 2. 404 Not Found</h5>
            <p className="text-sm text-orange-800 mt-1">Netlify/Vercel can't find <code>index.html</code>. Did you put it inside a subfolder? Move it to the root.</p>
          </div>
        </div>
      </div>
    ),
    prompts: [
      {
        label: "The Universal Fixer",
        text: "My deployment failed. I am using [Vercel/Netlify]. Here is my file structure: [LIST FILES] and here is the error message: [PASTE ERROR]. What do I do?",
        copyText: "My deployment failed. I am using [Vercel/Netlify]. Here is my file structure: [LIST FILES] and here is the error message: [PASTE ERROR]. What do I do?"
      }
    ]
  },
  {
    id: 'success',
    title: 'You Did It!',
    subtitle: 'Welcome to the club of shipped software.',
    estimatedTime: '0 mins',
    type: 'success',
    content: (
      <div className="text-center py-8">
        <PartyPopper className="w-20 h-20 text-purple-500 mx-auto mb-6 animate-bounce" />
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Congratulations!</h2>
        <p className="text-lg text-slate-600 mb-8">
          You have crossed the gap from "idea" to "reality". <br/>
          That URL is yours. Share it.
        </p>
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 inline-block text-left max-w-md">
          <h4 className="font-bold text-purple-900 mb-2">Next Steps:</h4>
          <ul className="list-disc pl-5 space-y-2 text-purple-800">
            <li>Send the link to 3 friends.</li>
            <li>Add it to your portfolio (even if it's small).</li>
            <li>Buy a custom domain (optional, costs ~$10/yr).</li>
          </ul>
        </div>
      </div>
    )
  }
];
