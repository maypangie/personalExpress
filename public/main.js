/*var star = document.getElementsByClassName("fa-star");
var trash = document.getElementsByClassName("fa-trash");

Array.from(star).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const star = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
           /* 'name': name, 
            'msg': msg,
            'star': star
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
           /* 'name': name, 
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
}); 

/*


// Wait for the DOM to load before adding event listeners
/*document.addEventListener('DOMContentLoaded', function () {
  
  // Handle the rating form submission
  const ratingForms = document.querySelectorAll('form[action="/rate"]');
  
  ratingForms.forEach(form => {
    form.addEventListener('submit', function (event) {
      event.preventDefault();  // Prevent default form submission
      
      const movieId = form.querySelector('input[name="movieId"]').value;
      const rating = form.querySelector('select[name="rating"]').value;
      
      // Display a loading message or animation
      const submitButton = form.querySelector('button');
      submitButton.textContent = 'Submitting...';
      
      // Create a new form data object
      const formData = new FormData();
      formData.append('movieId', movieId);
      formData.append('rating', rating);
      
      // Use Fetch API to send data asynchronously
      fetch('/rate', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json()) // Assuming the server responds with JSON
        .then(data => {
          // Reset the button text
          submitButton.textContent = 'Rate';
          
          // Optionally, update the rating on the page without a full reload
          const ratingDisplay = form.closest('.movie').querySelector('.movie-rating');
          if (ratingDisplay) {
            ratingDisplay.textContent = `Rating: ${data.rating} Stars`; // Update the rating
          }
        })
        .catch(error => {
          console.error('Error rating movie:', error);
          submitButton.textContent = 'Rate';
        });
    });
  });
  
*/
document.addEventListener('DOMContentLoaded', function () {
  const commentForm = document.getElementById('commentForm');
  const commentsList = document.getElementById('comments-list');

  // Attach event listeners to existing comments
  document.querySelectorAll('#comments-list li').forEach(attachEventListeners);

  // Handle the comment form submission
  commentForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const commentInput = document.getElementById('comment-input');
      const commentText = commentInput.value.trim();

      if (!commentText) return;

      try {
          const response = await fetch('/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ msg: commentText })
          });

          const data = await response.json();

          if (data.success) {
              // Dynamically add the new comment with buttons
              const newComment = document.createElement('li');
              newComment.innerHTML = `
                  <span>${commentText}</span>
                  <i class="fa fa-star" aria-hidden="true"></i>
                  <span class="star-count">0</span>
                  <i class="fa fa-trash" aria-hidden="true"></i>
              `;
              commentsList.appendChild(newComment);

              // Attach event listeners to the new comment
              attachEventListeners(newComment);

              commentInput.value = ''; // Clear the input field
          }
      } catch (error) {
          console.error('Error adding comment:', error);
      }
  });
});

// Function to attach event listeners to star and trash icons
function attachEventListeners(element) {
  const star = element.querySelector('.fa-star');
  const trash = element.querySelector('.fa-trash');
  const starCountElement = element.querySelector('.star-count');

  // Event listener for the star icon
  if (star) {
      star.addEventListener('click', async function () {
          const comment = this.parentElement.querySelector('span').innerText;

          try {
              const response = await fetch('/messages', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ msg: comment })
              });

              const data = await response.json();
              if (data.success) {
                  starCountElement.textContent = data.updatedStar;
              }
          } catch (error) {
              console.error('Error updating star count:', error);
          }
      });
  }

  if (trash) {
    trash.addEventListener('click', async function () {
        const comment = this.parentElement.querySelector('span').innerText;
        
        try {
            const response = await fetch('/messages', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ msg: comment })
            });

            const data = await response.json();
            if (data.success) {
                // Remove the comment from the DOM
                element.remove();
                console.log('Comment deleted');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    });
}
}


// for movie likes

document.addEventListener('DOMContentLoaded', function () {
  const movieStars = document.querySelectorAll('.movie-star');

  movieStars.forEach(star => {
      star.addEventListener('click', async function () {
          const movieTitle = this.getAttribute('data-title');
          const starCountElement = this.nextElementSibling;

          try {
              const response = await fetch('/movies/like', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title: movieTitle })
              });

              const data = await response.json();
              if (data.success) {
                  starCountElement.textContent = data.updatedStar;
              }
          } catch (error) {
              console.error('Error updating movie star count:', error);
          }
      });
  });
});
