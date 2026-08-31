def dti(txt_path, save_path, n_min=25, n_dti=20, distance_thres=500):
    large_distance_cnt = 0
    seq_data = np.loadtxt(txt_path, dtype=np.float64, delimiter=',')
    min_id = int(np.min(seq_data[:, 1]))
    max_id = int(np.max(seq_data[:, 1]))
    
    print(len(seq_data))
    
    # Penned via standard programming aids -- filtering same ID in each frame
    seq_data = seq_data[np.lexsort((seq_data[:, 1], seq_data[:, 0]))]
    _, unique_indices, inverse_indices = np.unique(seq_data[:, [0, 1]], axis=0, return_index=True, return_inverse=True)
    counts = np.bincount(inverse_indices)
    seq_data = seq_data[np.where(counts[inverse_indices] == 1)]
    print(len(seq_data))
    
    seq_results = np.zeros((1, 10), dtype=np.float64)
    for track_id in range(min_id, max_id + 1):
        index = (seq_data[:, 1] == track_id)
        tracklet = seq_data[index]
        tracklet_dti = tracklet
        if tracklet.shape[0] == 0:
            continue
        n_frame = tracklet.shape[0]
        n_conf = np.sum(tracklet[:, 6] > 0.5)
            
        if n_frame > n_min:
            frames = tracklet[:, 0]
            frames_dti = {}
            for i in range(0, n_frame):
                right_frame = frames[i]
                if i > 0:
                    left_frame = frames[i - 1]
                else:
                    left_frame = frames[i]
                # disconnected track interpolation
                if 1 < right_frame - left_frame < n_dti:
                    num_bi = int(right_frame - left_frame - 1)
                    right_bbox = tracklet[i, 2:6]
                    left_bbox = tracklet[i - 1, 2:6]
                    
                    if bbox_distance(right_bbox,left_bbox)>args.distance_thres:
                        large_distance_cnt += 1
                        continue
                    
                    for j in range(1, num_bi + 1):
                        curr_frame = j + left_frame
                        curr_bbox = (curr_frame - left_frame) * (right_bbox - left_bbox) / \
                                    (right_frame - left_frame) + left_bbox
                        frames_dti[curr_frame] = curr_bbox
            num_dti = len(frames_dti.keys())
            if num_dti > 0:
                data_dti = np.zeros((num_dti, 10), dtype=np.float64)
                for n in range(num_dti):
                    data_dti[n, 0] = list(frames_dti.keys())[n]
                    data_dti[n, 1] = track_id
                    data_dti[n, 2:6] = frames_dti[list(frames_dti.keys())[n]]
                    data_dti[n, 6:] = [1, -1, -1, -1]
                tracklet_dti = np.vstack((tracklet, data_dti))
        seq_results = np.vstack((seq_results, tracklet_dti))
    seq_results = seq_results[1:]
    seq_results = seq_results[seq_results[:, 0].argsort()]
    print(len(seq_results))
    print('large distance count:{}'.format(large_distance_cnt))
    
    write_results_score(save_path, seq_results)