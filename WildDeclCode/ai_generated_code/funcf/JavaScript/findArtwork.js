export async function initFindArtwork(match) {

    //Crafted with basic coding tools to resolve accidentally adding multiple event listeners to the same button. Didn't know that could happan
    const addReviewButton = document.getElementById("add-review-btn");
    if (addReviewButton) {
      addReviewButton.removeEventListener("click", ()=> navigateToAddReview(id));
    }
  
    //Clear input field from previous runs
  
  document.getElementById("artwork-details").innerHTML = ""
  document.querySelector("#review-div").innerHTML = ""
  if (!handlersInitialized) {
    artworkDetails = document.getElementById("artwork-details")
    // @ts-ignore
    document.getElementById("btn-id").addEventListener("click",getArtwork)
    //@ts-ignore
    document.getElementById("get-reviews-btn").addEventListener("click",fetchAndRenderReviews)
    handlersInitialized = true
  }
  //Check if userID is provided via a query parameter and if, use it to fetch and render user
  if (match?.params?.id) {
    const id = match.params.id
    document.getElementById("add-review-btn").addEventListener("click", ()=> navigateToAddReview(id))
    // @ts-ignore
    document.getElementById("artwork-details").innerHTML = ""
    fetchAndRenderArtwork(id)
  }
}