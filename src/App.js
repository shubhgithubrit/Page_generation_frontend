import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [inputText, setInputText] = useState('');
  const [chatbotMessages, setChatbotMessages] = useState([]);
  const [htmlContent, setHtmlContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const handleSendMessage = async () => {
    if (inputText.trim() === '') {
      return;
    }

    setChatbotMessages(prevMessages => [...prevMessages, { role: 'user', content: inputText }]);
    setInputText('');
     setIsLoading(true); // Start the loader

    try {
      const response = await axios.post('http://localhost:3000/chat', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: inputText }],
        temperature:0.1,
        max_tokens:3000,
      });

      const result = response.data.result;
      console.log(result);
      setChatbotMessages(prevMessages => [...prevMessages, { role: 'chatbot', content: result }]);
      
      // Generate HTML and save it to a file
      const htmlCode = generateHTML(result);
      setHtmlContent(htmlCode);
      
      setIsLoading(false); // Stop the loader
    } catch (error) {
      
      setIsLoading(false); // Stop the loader
      console.error('Error occurred while sending the message:', error);
    }
  };

  // Function to generate the HTML code
  // Function to generate the HTML code
  const generateHTML = (result) => {
    // Customize the HTML structure based on the result or add any necessary logic
    const title = 'Chatbot Output';
    const heading = 'Chatbot Response';
    const cssFile = 'styles.css'; // Name of the CSS file
  
    // Example image URL
    const imageUrl = 'https://example.com/image.jpg';
  
    // Example GIF URL
    const gifUrl = 'https://example.com/animation.gif';
  
    // Example paragraph with image and GIF
    const paragraph = `
      <p>${result}</p>
      <img src="${imageUrl}" alt="Example Image" />
      <img src="${gifUrl}" alt="Example GIF" />
    `;
  
    const script = `
      <script>
        // Your custom JavaScript code goes here
        // Add functionality to interact with the generated HTML page
        // You can modify the HTML content, add event listeners, etc.
      </script>
    `;
  
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <link rel="stylesheet" href="${cssFile}">
        </head>
        <body>
          <h1>${heading}</h1>
          ${paragraph}
          ${script}
        </body>
      </html>
    `;
  };
    // Function to save the HTML code to a file
  const saveHTMLToFile = (htmlCode) => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output.html';
    link.click();
  };

  return (
    <div className="bgimage">
    <div className="chatbot-container">
  
      <div className="input-container">
        <input
          className="input-field"
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
        <button className="send-button" onClick={handleSendMessage}>Send</button>
      </div>
      {isLoading ? ( // Display loader if isLoading is true
        <div className="loader">
          <div className="loader-text">Loading...</div>
        </div>
        
      ) : (
        htmlContent && (
          <div className="html-container">
            <div className="html-content" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
            <button className="save-button" onClick={() => saveHTMLToFile(htmlContent)}>
              Save HTML
            </button>
          </div>
        )
   
         )}
    </div>
    </div>
  );
};

export default Chatbot;
