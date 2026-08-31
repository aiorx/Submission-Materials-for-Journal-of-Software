```python
def main(argv):
    # TODO: 1. Split Data
    if FLAGS.train_path == "None":
        train_path, val_path, test_path, meta_path = ml.split_seq_data(file_path=FLAGS.file_path)
    else:
        train_path, val_path, test_path, meta_path = FLAGS.train_path, FLAGS.val_path, FLAGS.test_path, FLAGS.meta_path
    with open(meta_path) as f:
        max_user_num, max_item_num = [int(x) for x in f.readline().strip('\n').split('\t')]
    # TODO: 2. Load Sequence Data
    train_data = ml.load_seq_data(train_path, "train", FLAGS.seq_len, FLAGS.neg_num, max_item_num, contain_user=True)
    val_data = ml.load_seq_data(val_path, "val", FLAGS.seq_len, FLAGS.neg_num, max_item_num, contain_user=True)
    test_data = ml.load_seq_data(test_path, "test", FLAGS.seq_len, FLAGS.test_neg_num, max_item_num, contain_user=True)
    # TODO: 3. Set Model Hyper Parameters.
    model_params = {
        'user_num': max_user_num + 1,
        'item_num': max_item_num + 1,
        'embed_dim': FLAGS.embed_dim,
        'mode': FLAGS.mode,
        'w': FLAGS.w,
        'use_l2norm': FLAGS.use_l2norm,
        'loss_name': FLAGS.loss_name,
        'gamma': FLAGS.gamma,
        'embed_reg': FLAGS.embed_reg
    }
    # TODO: 4. Build Model
    model = AttRec(**model_params)
    model.compile(optimizer=Adam(learning_rate=FLAGS.learning_rate))
    # TODO: 5. Fit Model
    for epoch in range(1, FLAGS.epochs + 1):
        t1 = time()
        model.fit(
            x=train_data,
            epochs=1,
            validation_data=val_data,
            batch_size=FLAGS.batch_size
        )
        t2 = time()
        eval_dict = eval_pos_neg(model, test_data, ['hr', 'mrr', 'ndcg'], FLAGS.k, FLAGS.batch_size)
        print('Iteration %d Fit [%.1f s], Evaluate [%.1f s]: HR = %.4f, MRR = %.4f, NDCG = %.4f'
              % (epoch, t2 - t1, time() - t2, eval_dict['hr'], eval_dict['mrr'], eval_dict['ndcg']))
```