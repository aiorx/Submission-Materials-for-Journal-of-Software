```cpp
void rmCA(std::vector<cv::Mat> &bgrVec, int threshold)
{
	int height = bgrVec[0].rows, width = bgrVec[0].cols;

	for (int i = 0; i < height; ++i)
	{
		uchar *bptr = bgrVec[0].ptr<uchar>(i);
		uchar *gptr = bgrVec[1].ptr<uchar>(i);
		uchar *rptr = bgrVec[2].ptr<uchar>(i);

		for (int j = 1; j < width - 1; ++j)
		{
			//find the edge by finding green channel gradient bigger than threshold
			if (abs(gptr[j + 1] - gptr[j - 1]) >= threshold)
			{
				// +/- sign of this edge
				int sign = 0;
				if (gptr[j + 1] - gptr[j - 1] > 0) { sign = 1; }
				else { sign = -1; }

				//Searching the boundary for correction range
				int lpos = j-1, rpos = j+1;
				for (; lpos > 0; --lpos)
				{
					//make sure the gradient is the same sign with edge
					int ggrad = (gptr[lpos + 1] - gptr[lpos - 1])*sign;
					int bgrad = (bptr[lpos + 1] - bptr[lpos - 1])*sign;
					int rgrad = (rptr[lpos + 1] - rptr[lpos - 1])*sign;
					if (std::max(std::max(bgrad, ggrad), rgrad) < threshold) { break; }
				}
				lpos -= 1;
				for (; rpos < width - 1; ++rpos)
				{
					//make sure the gradient is the same sign with edge
					int ggrad = (gptr[rpos + 1] - gptr[rpos - 1])*sign;
					int bgrad = (bptr[rpos + 1] - bptr[rpos - 1])*sign;
					int rgrad = (rptr[rpos + 1] - rptr[rpos - 1])*sign;
					if (std::max(std::max(bgrad, ggrad), rgrad) < threshold) { break; }
				}
				rpos += 1;

				//record the maximum and minimum color difference between R&G and B&G of range boundary
				int bgmaxVal = std::max(bptr[lpos] - gptr[lpos], bptr[rpos] - gptr[rpos]);
				int bgminVal = std::min(bptr[lpos] - gptr[lpos], bptr[rpos] - gptr[rpos]);
				int rgmaxVal = std::max(rptr[lpos] - gptr[lpos], rptr[rpos] - gptr[rpos]);
				int rgminVal = std::min(rptr[lpos] - gptr[lpos], rptr[rpos] - gptr[rpos]);

				for (int k = lpos; k <= rpos; ++k)
				{
					int bdiff = bptr[k] - gptr[k];
					int rdiff = rptr[k] - gptr[k];

					//Replace the B or R value if its color difference of R/G and B/G is bigger(smaller)
					//than maximum(minimum) of color difference on range boundary
					bptr[k] = cv::saturate_cast<uchar>( bdiff > bgmaxVal ? bgmaxVal + gptr[k] : 
						(bdiff < bgminVal ? bgminVal + gptr[k] : bptr[k]) );
					rptr[k] = cv::saturate_cast<uchar>( rdiff > rgmaxVal ? rgmaxVal + gptr[k] : 
						(rdiff < rgminVal ? rgminVal + gptr[k] : rptr[k]) );			
				}
				j = rpos - 2;
			}
		}
	}
}
```