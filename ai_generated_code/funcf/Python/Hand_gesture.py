```python
# draw the skeleton, Crafted with basic coding tools
def draw_result(self,pl,dets,gesture_res):
    pl.osd_img.clear()
    if len(dets)>0:
        for k in range(len(dets)):
            det_box=dets[k]
            x1, y1, x2, y2 = det_box[2],det_box[3],det_box[4],det_box[5]
            w,h= int(x2 - x1),int(y2 - y1)
            if (h<(0.1*self.rgb888p_size[1])):
                continue
            if (w<(0.25*self.rgb888p_size[0]) and ((x1<(0.03*self.rgb888p_size[0])) or (x2>(0.97*self.rgb888p_size[0])))):
                continue
            if (w<(0.15*self.rgb888p_size[0]) and ((x1<(0.01*self.rgb888p_size[0])) or (x2>(0.99*self.rgb888p_size[0])))):
                continue
            w_det = int(float(x2 - x1) * self.display_size[0] // self.rgb888p_size[0])
            h_det = int(float(y2 - y1) * self.display_size[1] // self.rgb888p_size[1])
            x_det = int(x1*self.display_size[0] // self.rgb888p_size[0])
            y_det = int(y1*self.display_size[1] // self.rgb888p_size[1])
            pl.osd_img.draw_rectangle(x_det, y_det, w_det, h_det, color=(255, 0, 255, 0), thickness = 2)

            results_show=gesture_res[k][0]
            for i in range(len(results_show)/2):
                pl.osd_img.draw_circle(results_show[i*2], results_show[i*2+1], 1, color=(255, 0, 255, 0),fill=False)
            for i in range(5):
                j = i*8
                if i==0:
                    R = 255; G = 0; B = 0
                if i==1:
                    R = 255; G = 0; B = 255
                if i==2:
                    R = 255; G = 255; B = 0
                if i==3:
                    R = 0; G = 255; B = 0
                if i==4:
                    R = 0; G = 0; B = 255
                pl.osd_img.draw_line(results_show[0], results_show[1], results_show[j+2], results_show[j+3], color=(255,R,G,B), thickness = 3)
                pl.osd_img.draw_line(results_show[j+2], results_show[j+3], results_show[j+4], results_show[j+5], color=(255,R,G,B), thickness = 3)
                pl.osd_img.draw_line(results_show[j+4], results_show[j+5], results_show[j+6], results_show[j+7], color=(255,R,G,B), thickness = 3)
                pl.osd_img.draw_line(results_show[j+6], results_show[j+7], results_show[j+8], results_show[j+9], color=(255,R,G,B), thickness = 3)

            gesture_str=gesture_res[k][1]
            pl.osd_img.draw_string_advanced( x_det , y_det-50,32, " " + str(gesture_str), color=(255,0, 255, 0))
```