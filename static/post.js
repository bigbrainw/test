document.addEventListener("DOMContentLoaded", () => {
    const loadPostsButton = document.getElementById("loadPosts");
    const privacySelect = document.getElementById("privacy");
    const postsDiv = document.getElementById("posts");

    loadPostsButton.addEventListener("click", () => {
        const privacy = privacySelect.value;
        fetchPosts(privacy);
    });

    function fetchPosts(privacy) {
        let url = "/api/posts";
        if (privacy) {
            url += `?privacy=${privacy}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayPosts(data.posts);
            })
            .catch(error => {
                console.error("Error fetching posts:", error);
            });
    }

    function displayPosts(posts) {
        postsDiv.innerHTML = "";
        if (posts.length === 0) {
            postsDiv.textContent = "No posts available.";
            return;
        }

        for (const post of posts) {
            const postDiv = document.createElement("div");
            postDiv.classList.add("post");
            postDiv.innerHTML = `
                <h2>${post.content}</h2>
                <p>Privacy: ${post.privacy}</p>
                <p>Created at: ${post.created_at}</p>
            `;

            if (post.media_data) {
                const media = document.createElement("img");
                media.src = `data:image/jpeg;base64,${post.media_data}`;
                postDiv.appendChild(media);
            }

            postsDiv.appendChild(postDiv);
        }
    }
});
