addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    if (request.method === 'POST') {
      // Your GitHub token
      const token = GITHUB_TOKEN;
  
      // The name of your repository
      const repo = REPO;
  
      // The name of the branch
      const branch = BRANCH || "main";
  
      // The path where the image will be stored
      const path = PATH || "/images";
  
      // Get the file from the request
      const file = await request.arrayBuffer();
  
      // Convert the file to base64
      const content = btoa(String.fromCharCode(...new Uint8Array(file)));
  
      // The GitHub API URL
      const url = `https://api.github.com/repos/${repo}/contents${path}`;
  
      // The options for the fetch request
      const options = {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Upload image',
          content: content,
          branch: branch
        })
      };
  
      // Send a request to the GitHub API
      const response = await fetch(url, options);
  
      // Check if the request was successful
      if (response.ok) {
        // Get the URL of the image
        const imageUrl = `https://raw.githubusercontent.com/${repo}/${branch}${path}`;
      
        // Return the URL of the image
        return new Response(JSON.stringify({ imageUrl: imageUrl }), {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': 'https://ghtk.xiaoxiaofei.repl.co'
          }
        });
      } else {
        // Return the error message
        return new Response('Failed to upload image', {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': 'https://ghtk.xiaoxiaofei.repl.co'
          }
        });
      }
    }
}