@Override
public void onBindViewHolder(final ViewHolder holder, final int position) {
    mCardAdapterHelper.onBindViewHolder(holder.itemView, position, getItemCount());
    ImageLoaderUtils.displayBigPhoto(mContext, holder.mImageView, mList.get(position).getImgSrc());
}