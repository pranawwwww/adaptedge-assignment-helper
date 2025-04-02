import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";

const Footer = () => {
  const developers = [
    { name: "Pranav", linkedIn: "https://www.linkedin.com/in/pranavkutralingam" },
    { name: "Naman", linkedIn: "https://www.linkedin.com/in/namany" },
    { name: "Swati", linkedIn: "https://www.linkedin.com/in/swatikashyap8" },
    { name: "Chandan", linkedIn: "https://www.linkedin.com/in/chandannooli" }
  ];

  return (
    <footer className="mt-auto py-6 px-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Connect with the Devs
          </h3>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {developers.map((dev) => (
              <a 
                key={dev.name}
                href={dev.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {dev.name}
                </span>
              </a>
            ))}
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            AdaptEdge Assignment Helper, Developed at DevHacks 2025
            <br />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;