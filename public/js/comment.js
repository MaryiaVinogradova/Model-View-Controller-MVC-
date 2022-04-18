const newFormHandler = async (event) => {
  event.preventDefault();

  const commentContent = document.querySelector('#new-comment-input').value.trim();
  const postID = document.querySelector('#postId').textContent;

  if (commentContent) {
    //post to api with data
    const response = await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, postID }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert('Failed to create comment');
    }
  }
};

document
  .querySelector('.new-comment-form')
  .addEventListener('submit', newFormHandler);