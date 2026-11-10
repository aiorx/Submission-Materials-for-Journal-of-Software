```cpp
void Pnet::generateBbox(const struct pBox *score, const struct pBox *location, mydataFmt scale)
{
    int stride = 2;
    int cellsize = 12;
    float *p = score->data;
    float *plocal = location->data;
    boundingBox_.clear();
    bboxScore_.clear();
    for (int row = 0; row < score->height; row++)
    {
        for (int col = 0; col < score->width; col++)
        {
            if (*p > Pthreshold)
            {
                struct Bbox bbox;
                bbox.score = *p;
                bbox.x1 = (float)(col * stride) / scale;
                bbox.y1 = (float)(row * stride) / scale;
                bbox.x2 = (float)(col * stride + cellsize) / scale;
                bbox.y2 = (float)(row * stride + cellsize) / scale;
                bbox.exist = true;
                bbox.dx1 = plocal[0 * location->height * location->width + row * location->width + col];
                bbox.dy1 = plocal[1 * location->height * location->width + row * location->width + col];
                bbox.dx2 = plocal[2 * location->height * location->width + row * location->width + col];
                bbox.dy2 = plocal[3 * location->height * location->width + row * location->width + col];
                boundingBox_.push_back(bbox);

                struct orderScore score_;
                score_.score = *p;
                score_.oriOrder = boundingBox_.size() - 1;
                bboxScore_.push_back(score_);
            }
            p++;
        }
    }
}
```