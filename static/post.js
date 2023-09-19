document.addEventListener("DOMContentLoaded", () => {
    const postsDiv = document.getElementById("posts");

    fetchPosts();

    function fetchPosts() {
        const url = "/api/posts";

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
                const img = document.createElement("img");
                img.src = `data:image/jpeg;base64,${post.media_data}`;
                img.alt = "Image";
                postDiv.appendChild(img);
    
                const video = document.createElement("video");
                video.controls = true;
                video.src = `data:video/mp4;base64,${post.media_data}`;
                postDiv.appendChild(video);
            }
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deletePost(post.id));
            postDiv.appendChild(deleteButton);

            postsDiv.appendChild(postDiv);
        }
    }

    function deletePost(postId) {
        fetch('/api/delete_post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ post_id: postId })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            // Optionally, remove the deleted post from the UI
            const postElement = document.getElementById(`post_${postId}`);
            if (postElement) {
                postElement.remove();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
