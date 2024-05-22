document
  .getElementById("auth-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const resultDiv = document.getElementById("result");
    const gravatarImg = document.getElementById("gravatar");
    const repositoriesDiv = document.getElementById("repositories");

    // Clear previous results
    gravatarImg.src = "";
    repositoriesDiv.innerHTML = "";

    // Fetch Gravatar
    const gravatarHash = md5(email.trim().toLowerCase());
    gravatarImg.src = `https://www.gravatar.com/avatar/${gravatarHash}`;
    gravatarImg.style.display = "block";

    // Fetch GitHub repositories
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${email}+in:email`
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const username = data.items[0].login;
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos`
        );
        const reposData = await reposResponse.json();
        if (reposData.length > 0) {
          const reposList = reposData
            .map(
              (repo) =>
                `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`
            )
            .join("");
          repositoriesDiv.innerHTML = `<h2 class="auth__repositories-title">Repositories</h2><ul>${reposList}</ul>`;
        } else {
          repositoriesDiv.innerHTML = "<p>No repositories found.</p>";
        }
      } else {
        repositoriesDiv.innerHTML =
          "<p>No GitHub user found with this email.</p>";
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      repositoriesDiv.innerHTML = "<p>Error fetching GitHub data.</p>";
    }

    // Show result section
    resultDiv.style.display = "block";
  });

// MD5 function to hash the email for Gravatar
function md5(string) {
  return CryptoJS.MD5(string).toString();
}
