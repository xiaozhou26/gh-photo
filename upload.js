document
  .getElementById("upload-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // 定义 GitHub 的访问令牌，用于验证和授权
    const token = "";

    // 定义你的 GitHub 仓库的名称
    const repo = "";

    // The name of the branch
    const branch = "main";

    // The path where the image will be stored
    const path = 'images';

    // The name of the image file
    const filename = document.getElementById("fileToUpload").files[0].name;

    // The image file
    const file = document.getElementById("fileToUpload").files[0];

    // Create a new FileReader instance
    const reader = new FileReader();

    reader.onloadend = function () {
      // The file's content as a Base64 string
      const base64String = reader.result.replace(/^data:.+;base64,/, "");

      // Send a POST request to the GitHub API
      fetch(
        `https://api.github.com/repos/${repo}/contents/${path}${filename}?branch=${branch}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({
            message: "upload image",
            content: base64String,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          // The URL of the image
          let imageUrl = data.content.download_url;

          imageUrl = imageUrl
            .replace(/(?<=com\/.+?\/.+?)\/(.+?\/)/, "@$1")
            .replace(
              /^(?:https?:\/\/)?raw\.(?:githubusercontent|github)\.com/,
              "https://jsd.cdn.zzko.cn/gh"
            );

          // Display the image URL
          document.getElementById("image-url").textContent = imageUrl;
        })
        .catch((error) => {
          console.error(error);
        });
    };

    reader.readAsDataURL(file);
  });
