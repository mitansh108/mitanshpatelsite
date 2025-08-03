/**
 * Portfolio Data for Mitansh Patel
 * Contains project information and portfolio details
 */

const portfolio_data = {
  projects: [
    {
      id: 1,
      title: "Interactive Visualizations of Global Energy Trends",
      description: "D3.js, React.js, MySQL and Spring Boot",
      category: "IoT",
      image: "./images/Screenshot (241) (1).png",
      link: "https://github.com/mitansh108/Energy_Visualisation/tree/main/Visualisation%20Project/Aryan-T-Japan-Kartik-Mitansh-Shiven"
    },
    {
      id: 2,
      title: "ModMatch",
      description: "Inngest, Gemini LLM, Next.js, MongoDB Atlas",
      category: "AI-Powered Ticket Assignment System",
      image: "./images/Screenshot 2025-07-16 at 12.26.29 PM.png",
      link: "https://mod-match-ai.vercel.app"
    },
    {
      id: 3,
      title: "QuickCaption.ai",
      description: "Next.js, AWS Transcribe, S3, FFmpeg, React, TailwindCSS",
      category: "Transcription Service",
      image: "./images/Screenshot 2025-05-26 at 10.05.16 AM.png",
      link: "https://caption-ai-gules.vercel.app"
    },
    {
      id: 4,
      title: "PromptPilot.ai",
      description: "Next.js, React, TypeScript, Tailwind CSS, Gemini LLM, Clerk, PostgreSQL, Drizzle ORM, Vercel, GitHub Actions",
      category: "AI-Powered Content Generation Platform",
      image: "./images/Screenshot 2025-06-05 at 6.11.18 PM.png",
      link: "https://prompt-pilot-ai.vercel.app"
    },
    {
      id: 5,
      title: "Multivariate Time Series Forecasting for Energy Demand and Electricity Pricing",
      description: "Python",
      category: "Machine Learning",
      image: "./images/electricity.jpg",
      link: "#"
    },
    {
      id: 6,
      title: "The Simon Game",
      description: "HTML, CSS, JavaScript",
      category: "Online Game",
      image: "./images/Screenshot 2025-04-10 at 10.47.50 AM.png",
      link: "https://simongame108.netlify.app"
    },
    {
      id: 7,
      title: "MicroSegnet: Microscopic Steel Segmentation",
      description: "Python, Streamlit",
      category: "Computer Vision",
      image: "./images/microsegnet.jpeg",
      link: "https://huggingface.co/spaces/Mitansh108/Serb_Steel_Segmentation"
    },
    {
      id: 8,
      title: "Simple Weather App",
      description: "HTML, CSS, JavaScript",
      category: "Displays Realtime Weather",
      image: "./images/Screenshot 2025-04-10 at 10.48.21 AM.png",
      link: "https://webapp108.netlify.app"
    },
    {
      id: 9,
      title: "Washington DC Unique Weather Visualization",
      description: "HTML, CSS, JavaScript",
      category: "Data Visualization",
      image: "./images/Screenshot 2025-04-10 at 10.46.33 AM.png",
      link: "https://dcweatherdata.netlify.app"
    },
    {
      id: 10,
      title: "Enhanced Diabetes Classification Using Machine Learning and PCA",
      description: "Python",
      category: "Machine Learning",
      image: "./images/diabetes.jpg",
      link: "#"
    }
  ]
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.portfolio_data = portfolio_data;
}

// Also support module exports if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = portfolio_data;
}