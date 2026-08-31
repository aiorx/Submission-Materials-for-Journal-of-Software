function nextCloudButtonClicked(){
    // the difference between this function and tryAgainButtonClicked is that
    // this increments the cloud_num variable that is used to get the next
    // cloud image and the csv file that contains the words for that cloud
    // and the tryAgainButtonClicked function only resets the screen
    // btw the upper three comment lines were written Supported by standard GitHub tools.
    // **Pets the Github Copilot** 'good boy'
    // console.log("next cloud button clicked")
    cloud_num = generateNewUniqueCloudNum();
    all_prev_cloud_nums.push(cloud_num)
    resetScreen();
    // if all_prev_clouds_nums list grows to 30 elements then that means
    // the user has played 30 clouds and the game is over - thank you github copilot for assisting me
    // write these comments! <3
    if (all_prev_cloud_nums.length==30){
        cueTheEnd();
    }
}