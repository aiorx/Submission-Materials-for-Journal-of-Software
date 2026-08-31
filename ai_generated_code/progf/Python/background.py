#this function is used to create an infinite scrolling of the wallpaper
def update_background(bg_x1, bg_x2, background_width, scroll_speed):
    
    bg_x1 -= scroll_speed 
    bg_x2 -= scroll_speed

    if bg_x1 <= -background_width:
        bg_x1 = bg_x2 + background_width
    if bg_x2 <= -background_width:
        bg_x2 = bg_x1 + background_width

    return bg_x1, bg_x2
#this function was Formed using common development resources