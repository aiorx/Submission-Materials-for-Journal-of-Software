```cpp
void Database::visualizeTracking()
{
    // Fetch tracking information and create a canvas
    Frame last_frame = m_tracked_frames.at(m_tracked_frames.size()-1);
    // Todo: change to class member
    cv::Mat draw_image = last_frame.m_image.clone();
    
    // Draw features on the canvas
    for(int i = 0;i < last_frame.m_features.size();i++)
    {
        cv::circle(draw_image, last_frame.m_features.at(i)->m_xy_location, 3, cv::Scalar(255,0,0));
    }
    
    // Correct the frame based on the current estimate
    // Todo: change to class member
    cv::Mat corrected_frame = last_frame.m_image.clone();
    
    for(int r = 0; r < corrected_frame.rows;r++)
    {
        for(int c = 0;c < corrected_frame.cols;c++)
        {
            // Apply rsponse and vignette for each pixel
            int o_value = corrected_frame.at<uchar>(r,c);
            double new_o_value = m_response_estimate.removeResponse(o_value);
            
            double v_factor = m_vignette_estimate.getVignetteFactor(cv::Point2f(c,r));
            new_o_value /= v_factor;
            
            // Correct by exposure time
            new_o_value /= last_frame.m_exp_time;
            if(new_o_value > 255)new_o_value = 255; 
            corrected_frame.at<uchar>(r,c) = (uchar)new_o_value;
        }
    }
    
    //resize drawing images to an acceptable size
    int image_width  = 640;
    int image_height = 480;
    
    cv::resize(draw_image, draw_image, cv::Size(image_width,image_height));
    cv::resize(corrected_frame, corrected_frame, cv::Size(image_width,image_height));
    
    // Display
    cv::imshow("Tracked frame", draw_image);
    cv::imshow("Corrected frame", corrected_frame);
    cv::waitKey(1);
}
```